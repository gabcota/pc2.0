import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { transformSync } from "esbuild";
import { createSmsSender, normalizeSmsPhone, type SmsRequest } from "../server/smsTransport";

const token = "test-only-token";
const phone = "11900000000";
const message = "Mensagem original, sem alteracoes.";
const accepted = () => new Response(JSON.stringify({
  error: 0, data: { messageId: "test-id", queued: true },
}), { status: 200 });

test("normaliza números nacionais e preserva o DDI existente", () => {
  assert.equal(normalizeSmsPhone("(11) 90000-0000"), "5511900000000");
  assert.equal(normalizeSmsPhone("+55 11 90000-0000"), "5511900000000");
  assert.equal(normalizeSmsPhone("(11) 3000-0000"), "551130000000");
});

test("usa send-sms com lista E.164, remetente e texto original", async () => {
  let calls = 0;
  const send = createSmsSender({ integraxToken: token, integraxFrom: "29094" }, async (url, init) => {
    calls++;
    assert.equal(url, `https://sms.aresfun.com/v1/integration/${token}/send-sms`);
    assert.equal(init?.method, "POST");
    assert.equal(init?.redirect, "error");
    assert.deepEqual(JSON.parse(String(init?.body)), { to: ["5511900000000"], from: "29094", message });
    return accepted();
  });
  assert.deepEqual(await send({ phone, message }), {
    success: true, provider: "integrax", httpStatus: 200, messageId: "test-id",
  });
  assert.equal(calls, 1);
});

test("sem token não dispara nem usa Manager silenciosamente", async () => {
  const send = createSmsSender({}, async () => { throw new Error("não deveria chamar"); });
  assert.match((await send({ phone, message })).error!, /TOKEN/);
});

test("provedor desconhecido e dados inválidos não disparam", async () => {
  let calls = 0;
  const request = async () => { calls++; return accepted(); };
  assert.equal((await createSmsSender({ provider: "unknown" }, request)({ phone, message })).success, false);
  for (const input of [{ phone: "", message }, { phone, message: "" }, { phone: "123", message }]) {
    assert.equal((await createSmsSender({ integraxToken: token }, request)(input)).success, false);
  }
  assert.equal(calls, 0);
});

for (const status of [400, 401, 403, 404, 429, 500]) {
  test(`HTTP ${status} é falha e não vaza corpo ou credenciais`, async () => {
    let calls = 0;
    const send = createSmsSender({ integraxToken: token }, async () => {
      calls++;
      return new Response(JSON.stringify({ message: `sensitive ${token} ${phone}` }), { status });
    });
    const result = await send({ phone, message });
    assert.equal(result.success, false);
    assert.equal(result.httpStatus, status);
    assert.ok(!JSON.stringify(result).includes(token));
    assert.ok(!JSON.stringify(result).includes(phone));
    assert.equal(calls, 1);
  });
}

test("HTTP 200 com recusa ou corpo inesperado não é aceitação", async () => {
  for (const body of [{ success: false }, { error: 1 }, {}, { error: "Token inválido" }]) {
    const send = createSmsSender({ integraxToken: token }, async () => new Response(JSON.stringify(body)));
    assert.equal((await send({ phone, message })).success, false);
  }
  const send = createSmsSender({ integraxToken: token }, async () => new Response("<html>login</html>"));
  assert.equal((await send({ phone, message })).success, false);
});

test("falha de conexão não causa repetição nem fallback", async () => {
  let calls = 0;
  const send = createSmsSender({ integraxToken: token }, async () => {
    calls++;
    throw new Error(`https://example.invalid/${token}`);
  });
  const result = await send({ phone, message });
  assert.equal(result.success, false);
  assert.equal(calls, 1);
  assert.ok(!JSON.stringify(result).includes(token));
});

test("Manager pode ser selecionado explicitamente sem chamar Integra X", async () => {
  const send = createSmsSender({ provider: "manager", managerUrl: "https://manager.invalid/api" }, async (url, init) => {
    assert.equal(url, "https://manager.invalid/api");
    assert.deepEqual(JSON.parse(String(init?.body)), { phone: "5511900000000", message, dontRepeat: true });
    return new Response(JSON.stringify({ success: true }));
  });
  assert.equal((await send({ phone, message, dontRepeat: true })).provider, "manager");
});

// Evaluate the real route handlers with an isolated sender, without starting the
// app/database or dispatching real SMS.
const source = ts.createSourceFile("routes.ts", readFileSync("server/routes.ts", "utf8"), ts.ScriptTarget.Latest, true);
function routeHandler(route: string, send: (input: SmsRequest) => Promise<unknown>) {
  let handler: string | undefined;
  function visit(node: ts.Node) {
    if (ts.isCallExpression(node) && node.expression.getText(source) === "app.post" &&
        ts.isStringLiteral(node.arguments[0]) && node.arguments[0].text === route) {
      handler = node.arguments[1].getText(source);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  assert.ok(handler, `Rota ausente: ${route}`);
  const js = transformSync(`globalThis.handler = ${handler};`, { loader: "ts" }).code;
  const context: Record<string, any> = {
    sendTransactionalSms: send,
    logSmsResult: () => {},
    console: { log() {}, error() {} },
  };
  runInNewContext(js, context);
  return context.handler as (req: any, res: any) => Promise<void>;
}
function responseRecorder() {
  return {
    statusCode: 200, body: undefined as any,
    status(code: number) { this.statusCode = code; return this; },
    json(body: any) { this.body = body; return this; },
  };
}

const expectedMessages = {
  "/api/sms-extra": "Sr. Teste, sua vaga em Sao Paulo esta reservada por tempo limitado. Conclua o cadastro antes que o prazo expire.",
  "/api/sms-pagamento": "Sr. Teste, o sistema em Sao Paulo esta aguardando a confirmacao do seu pagamento para liberar o proximo passo do seu processo.",
  "/api/sms-agendamento": "Ola Teste! Seu exame esta agendado. Confirme sua presenca para garantir o horario.",
};
for (const [route, expected] of Object.entries(expectedMessages)) {
  test(`${route}: preserva mensagem e validação dos campos`, async () => {
    const sent: SmsRequest[] = [];
    const handler = routeHandler(route, async (input) => {
      sent.push(input);
      return { success: true, provider: "integrax" };
    });
    const invalid = responseRecorder();
    await handler({ body: {} }, invalid);
    assert.equal(invalid.statusCode, 400);
    assert.equal(sent.length, 0);
    const res = responseRecorder();
    await handler({ body: { phoneNumber: phone, firstName: "Teste", gender: "masculino", city: "Sao Paulo" } }, res);
    assert.equal(sent.length, 1);
    assert.equal(sent[0].message, expected);
    assert.equal(res.body.success, true);
  });
}

test("falha do serviço não bloqueia respostas de pagamento e agendamento", async () => {
  for (const route of ["/api/sms-pagamento", "/api/sms-agendamento"]) {
    const handler = routeHandler(route, async () => ({ success: false, provider: "integrax", error: "indisponível" }));
    const res = responseRecorder();
    await handler({ body: { phoneNumber: phone, firstName: "Teste" } }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
  }
});

test("primeiro SMS expõe falha sem expor resposta bruta do provedor", async () => {
  const handler = routeHandler("/api/sms-extra", async () => ({ success: false, error: "Recusado" }));
  const res = responseRecorder();
  await handler({ body: { phoneNumber: phone, firstName: "Teste", gender: "masculino", city: "Sao Paulo" } }, res);
  assert.equal(res.statusCode, 502);
  assert.equal(res.body.success, false);
  assert.equal(res.body.error, "Recusado");
});
