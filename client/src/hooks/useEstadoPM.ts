import { useState, useEffect } from 'react';
import { type EstadoPMData, getEstadoPMFromStorage } from '@/utils/estadoPM';

/**
 * Hook React: detecta o estado do usuário via IP (localStorage.user_ip_data)
 * e retorna o EstadoPMData correspondente, ou null se não detectado.
 *
 * Exemplo de uso:
 *   const estadoPM = useEstadoPM();
 *   const sigla = estadoPM?.sigla ?? 'PM';
 */
export function useEstadoPM(): EstadoPMData | null {
  const [estado, setEstado] = useState<EstadoPMData | null>(null);
  useEffect(() => { setEstado(getEstadoPMFromStorage()); }, []);
  return estado;
}
