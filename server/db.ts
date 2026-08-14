import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema });

/**
 * Bug workaround — Neon HTTP driver sometimes returns `null` instead of `[]`
 * when a query yields no rows. Normalises the result to a safe empty array.
 */
export function safeRows<T>(rows: T[] | null | undefined): T[] {
  return rows ?? [];
}

/**
 * Bug workaround — Drizzle (neon-http) serialises JS `null` as the empty
 * string `""` for `timestamp` and `decimal/numeric` columns, causing Postgres
 * to reject the query with "invalid input syntax". Passing `undefined` instead
 * causes Drizzle to omit the column entirely; for nullable columns the DB then
 * stores NULL correctly.
 *
 * Use this wherever a timestamp or decimal field may legitimately be absent.
 */
export function orUndef<T>(val: T | null | undefined): T | undefined {
  return val ?? undefined;
}

/**
 * Bug workaround — `.returning()` on Neon HTTP sometimes returns an empty
 * array even when the INSERT succeeded. Falls back to a compensating SELECT
 * via the provided `fallback` function so callers always get the inserted row.
 */
export async function safeInsertReturn<T>(
  rows: T[] | null | undefined,
  fallback: () => Promise<T | undefined>,
): Promise<T> {
  const safe = rows ?? [];
  if (safe.length > 0) return safe[0];
  const found = await fallback();
  if (!found) throw new Error("DB insert: row not found in compensating SELECT");
  return found;
}
