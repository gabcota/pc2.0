export type IpGeolocationData = Record<string, unknown>;

let ipDataRequest: Promise<IpGeolocationData | null> | null = null;

/**
 * Busca a localização do IP no backend uma única vez por carregamento do app,
 * persiste o resultado para as próximas etapas e avisa as telas já montadas.
 */
export function loadIpGeolocation(): Promise<IpGeolocationData | null> {
  if (ipDataRequest) return ipDataRequest;

  ipDataRequest = fetch("/api/user-ip-data")
    .then(async (response) => {
      if (!response.ok) return null;

      const payload = await response.json();
      const ipData = payload?.data ?? payload;
      if (!ipData || typeof ipData !== "object") return null;

      localStorage.setItem("user_ip_data", JSON.stringify(ipData));
      window.dispatchEvent(
        new CustomEvent("ipDataReady", { detail: ipData }),
      );

      return ipData as IpGeolocationData;
    })
    .catch(() => null);

  return ipDataRequest;
}