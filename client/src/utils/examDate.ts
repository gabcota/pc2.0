/**
 * Exam date utility — single source of truth for the general exam date.
 *
 * Rule: always skip the immediate next Sunday and use the one after.
 * This ensures candidates always have at least ~8+ days of notice.
 */

export function getExamDate(): Date {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday

  // Days until the immediate next Sunday
  let daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;

  // Skip the next 5 Sundays — use the 6th upcoming Sunday
  daysUntilSunday += 5 * 7;

  const result = new Date(today);
  result.setDate(today.getDate() + daysUntilSunday);
  return result;
}

/** ISO date string — e.g. "2026-06-08" — for localStorage / API payloads */
export function getExamDateISO(): string {
  const d = getExamDate();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/** Full PT-BR formatted string — e.g. "domingo, 8 de junho de 2026" */
export function getExamDateFormatted(): string {
  return getExamDate().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Short PT-BR formatted string — e.g. "08/06/2026" */
export function getExamDateShort(): string {
  return getExamDate().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
