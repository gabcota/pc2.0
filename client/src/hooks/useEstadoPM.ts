import { useEffect, useState } from 'react';
import { loadIpGeolocation } from '@/lib/ipGeolocation';
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
  const [estado, setEstado] = useState<EstadoPMData | null>(() => getEstadoPMFromStorage());

  useEffect(() => {
    let active = true;

    const syncEstado = () => {
      if (active) setEstado(getEstadoPMFromStorage());
    };

    window.addEventListener('ipDataReady', syncEstado);

    // Também funciona quando o usuário abre /marcar ou qualquer etapa
    // personalizada diretamente, sem ter passado antes pela página inicial.
    loadIpGeolocation().then(syncEstado);

    return () => {
      active = false;
      window.removeEventListener('ipDataReady', syncEstado);
    };
  }, []);

  return estado;
}
