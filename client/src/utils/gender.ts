const FEMININE_VALUES = new Set(['f', 'feminino', 'female', 'fem', '2']);

export function normalizeGender(raw: string | null | undefined): 'feminino' | 'masculino' {
  if (!raw) return 'masculino';
  return FEMININE_VALUES.has(raw.trim().toLowerCase()) ? 'feminino' : 'masculino';
}
