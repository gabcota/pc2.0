const SCRIPT_NAME = 'release:sync-domains';
const log = (level, msg, extra = {}) => {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    script: SCRIPT_NAME,
    msg,
    ...extra,
  };
  console.log(JSON.stringify(payload));
};

const startedAt = Date.now();
log('info', 'Release script started');

const CUSTOM_VALIDATOR = process.env.CUSTOM_VALIDATOR;

if (!CUSTOM_VALIDATOR) {
  log('warn', 'CUSTOM_VALIDATOR env var not set, skipping sync', {
    durationMs: Date.now() - startedAt,
  });
  process.exit(0);
}

const WAIT_SECONDS = 60;
const FETCH_TIMEOUT_MS = 30_000;
const FIRE_AND_FORGET_DELAY_MS = 200;

const url = `${CUSTOM_VALIDATOR}/api/metrics/sync-domains?waitSeconds=${WAIT_SECONDS}`;
log('info', 'Triggering domain sync (fire-and-forget)', {
  url,
  fetchTimeoutMs: FETCH_TIMEOUT_MS,
  waitSeconds: WAIT_SECONDS,
});

try {
  // Fire-and-forget: não aguardamos a resposta para não bloquear o release.
  // O endpoint pode demorar até `waitSeconds` para responder, mas só precisamos
  // garantir que a requisição saiu.
  fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })
    .then((res) => {
      log('info', 'Sync request completed (post-exit)', {
        status: res.status,
        ok: res.ok,
      });
    })
    .catch((err) => {
      log('warn', 'Sync request failed (post-exit, ignored)', {
        error: err?.message ?? String(err),
        name: err?.name,
      });
    });

  // Pequeno delay para garantir que o socket TCP da requisição abriu antes
  // de o processo encerrar. Sem isso, o exit imediato pode cancelar o fetch.
  await new Promise((r) => setTimeout(r, FIRE_AND_FORGET_DELAY_MS));

  log('info', 'Release script finished successfully', {
    durationMs: Date.now() - startedAt,
  });
  process.exit(0);
} catch (err) {
  log('error', 'Unexpected error in release script (exiting 0 anyway)', {
    error: err?.message ?? String(err),
    name: err?.name,
    durationMs: Date.now() - startedAt,
  });
  // Saímos com 0 para não abortar o release por causa de um sync opcional.
  process.exit(0);
}