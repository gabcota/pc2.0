const KEY = import.meta.env.VITE_ACCOUNT_G ?? "fv";
const IS_UNDER = import.meta.env.VITE_IS_UNDER === "true";

export const markFunnelValidated = (): void => {
  if (IS_UNDER) return;
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {}
  try {
    localStorage.setItem(KEY, "1");
  } catch {}
};

export const isFunnelValidated = (): boolean => {
  if (IS_UNDER) return false;

  try {
    const sessionValue = sessionStorage.getItem(KEY);
    if (sessionValue === "1") return true;
  } catch {}

  try {
    const localValue = localStorage.getItem(KEY);
    if (localValue === "1") return true;
  } catch {}

  return false;
};