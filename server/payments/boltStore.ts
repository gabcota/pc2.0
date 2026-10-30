import { sql, type SQL } from "drizzle-orm";
import { db } from "../db";

export interface BoltState {
  provider: "bolt";
  amountCents: number;
  rawStatus: string;
  createdAt: string;
  expiresAt: string;
  nextCheckAt: number;
  leaseUntil: number;
  leaseToken: string;
  confirmedAt?: string;
  customer: { name: string; phone: string; email: string; document?: { number: string; type: string } };
  productName: string;
}
export interface BoltRecord {
  [key: string]: any;
  transaction_id: string;
  amount: string;
  status: string;
  pix_code: string;
  qr_code: string;
  control: BoltState;
  firstPaid?: boolean;
}
export interface BoltStore {
  save(id: string, code: string, state: BoltState, body: any): Promise<BoltRecord>;
  get(id: string): Promise<BoltRecord | null>;
  claim(id: string, token: string): Promise<boolean>;
  finish(id: string, token: string, status: string, paidAt?: string): Promise<BoltRecord | null>;
  defer(id: string, token: string, seconds: number): Promise<void>;
}
const columns = sql`transaction_id, amount, status, pix_code, qr_code, application_data->'_bolt' AS control,
  vaga_title, vaga_company, vaga_location, local_prova_name, local_prova_address, data_prova, hora_prova`;
const clock = sql`(extract(epoch FROM clock_timestamp()) * 1000)::bigint`;
type Execute = (query: SQL) => Promise<any>;
// All synchronization is a conditional UPDATE of an existing row. No process-local
// cache, advisory session locks, new tables, DDL or database migration is needed.
export class PgBoltStore implements BoltStore {
  constructor(private execute: Execute = query => db.execute(query)) {}
  private async rows(query: SQL): Promise<any[]> {
    const result = await this.execute(query);
    return Array.isArray(result) ? result : result?.rows ?? [];
  }
  async save(id: string, code: string, state: BoltState, body: any): Promise<BoltRecord> {
    const application = { ...(body.applicationData ?? {}), _bolt: state };
    const vaga = body.inscricaoData?.vaga ?? {};
    const local = body.inscricaoData?.localProva ?? {};
    const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(code)}`;
    const cpf = String(state.customer.document?.number ?? "");
    const rows = await this.rows(sql`
      WITH candidate AS (
        INSERT INTO candidates(cpf, nome_completo, email, telefone)
          VALUES (${cpf}, ${state.customer.name}, ${state.customer.email}, ${state.customer.phone})
          ON CONFLICT (cpf) DO UPDATE SET nome_completo=EXCLUDED.nome_completo,
            email=EXCLUDED.email, telefone=EXCLUDED.telefone, updated_at=now()
          RETURNING id
      )
      INSERT INTO pix_transactions
        (transaction_id, candidate_id, amount, status, vaga_id, vaga_title, vaga_company,
         vaga_location, local_prova_name, local_prova_address, pix_code, qr_code, application_data,
         user_data, inscricao_data, data_prova, hora_prova)
      VALUES (${id}, (SELECT id FROM candidate), ${(state.amountCents / 100).toFixed(2)}, 'pending',
        ${String(vaga.id || "bolt")}, ${String(vaga.title || state.productName)},
        ${String(vaga.company || "")}, ${String(vaga.location || "")},
        ${String(local.name || "")}, ${String(local.address || "")},
        ${code}, ${qr}, ${JSON.stringify(application)}::jsonb,
        ${JSON.stringify(body.userData ?? body.applicationData?.userData ?? {})}::jsonb,
        ${JSON.stringify(body.inscricaoData ?? {})}::jsonb,
        ${body.inscricaoData?.dataProva ?? null}, ${body.inscricaoData?.horaProva ?? null})
      RETURNING ${columns}`);
    if (!rows[0]) throw new Error("BOLT_PERSIST_FAILED");
    return rows[0];
  }
  async get(id: string): Promise<BoltRecord | null> {
    return (await this.rows(sql`SELECT ${columns} FROM pix_transactions
      WHERE transaction_id=${id} AND application_data->'_bolt'->>'provider'='bolt' LIMIT 1`))[0] ?? null;
  }
  async claim(id: string, token: string): Promise<boolean> {
    const rows = await this.rows(sql`UPDATE pix_transactions SET
      application_data=jsonb_set(application_data, '{_bolt}',
        (application_data->'_bolt') || jsonb_build_object(
          'leaseToken', ${token}::text, 'leaseUntil', ${clock}+60000, 'nextCheckAt', ${clock}+15000)),
      updated_at=now()
      WHERE transaction_id=${id} AND application_data->'_bolt'->>'provider'='bolt'
        AND COALESCE((application_data->'_bolt'->>'leaseUntil')::bigint,0)<=${clock}
        AND COALESCE((application_data->'_bolt'->>'nextCheckAt')::bigint,0)<=${clock}
      RETURNING transaction_id`);
    return rows.length === 1;
  }
  async finish(id: string, token: string, rawStatus: string, paidAt?: string): Promise<BoltRecord | null> {
    const rows = await this.rows(sql`
      WITH previous AS (
        SELECT transaction_id, application_data->'_bolt'->>'confirmedAt' AS confirmed
        FROM pix_transactions WHERE transaction_id=${id}
          AND application_data->'_bolt'->>'provider'='bolt'
          AND application_data->'_bolt'->>'leaseToken'=${token}
      )
      UPDATE pix_transactions p SET
        status=CASE WHEN previous.confirmed IS NOT NULL AND ${rawStatus}='PENDING'
          THEN p.status ELSE lower(${rawStatus}) END,
        application_data=jsonb_set(p.application_data, '{_bolt}',
          (p.application_data->'_bolt') || jsonb_build_object(
            'rawStatus', CASE WHEN previous.confirmed IS NOT NULL AND ${rawStatus}='PENDING'
              THEN p.application_data->'_bolt'->>'rawStatus' ELSE ${rawStatus} END,
            'leaseToken', '', 'leaseUntil', 0, 'nextCheckAt', ${clock}+15000)
          || CASE WHEN ${rawStatus}='PAID' AND previous.confirmed IS NULL
            THEN jsonb_build_object('confirmedAt', ${paidAt || new Date().toISOString()}::text)
            ELSE '{}'::jsonb END),
        updated_at=now()
      FROM previous WHERE p.transaction_id=previous.transaction_id
        AND p.application_data->'_bolt'->>'leaseToken'=${token}
      RETURNING p.transaction_id, p.amount, p.status, p.pix_code, p.qr_code,
        p.application_data->'_bolt' AS control,
        (${rawStatus}='PAID' AND previous.confirmed IS NULL) AS "firstPaid"`);
    return rows[0] ?? null;
  }
  async defer(id: string, token: string, seconds: number): Promise<void> {
    await this.rows(sql`UPDATE pix_transactions SET
      application_data=jsonb_set(application_data, '{_bolt}',
        (application_data->'_bolt') || jsonb_build_object(
          'leaseToken', '', 'leaseUntil', 0, 'nextCheckAt', ${clock}+${seconds * 1000})),
      updated_at=now()
      WHERE transaction_id=${id} AND application_data->'_bolt'->>'provider'='bolt'
        AND application_data->'_bolt'->>'leaseToken'=${token}`);
  }
}
