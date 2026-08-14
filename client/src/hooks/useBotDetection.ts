import { getSiteConfig } from "@/lib/siteConfig";
import { useState, useEffect, useRef } from "react";

declare global {
  interface Window {
    __rum_cfg?: { r?: number; [k: string]: unknown };
    __perf_q?: string;
    __sd?: string;
  }
}

const SESSION_KEY = "__rum_v";

interface BotDetectionOptions {
  waitForBackend?: number;
}


export function useBotDetection(options?: BotDetectionOptions): {
  isBot: boolean | null;
  isValidating: boolean;
} {
  const [isBot, setIsBot] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cancelledRef = useRef(false);

  const waitForBackend = options?.waitForBackend ?? 30000;

  useEffect(() => {
    setIsValidating(true)
    const __rmid = localStorage.getItem("__rmid");

    if(!__rmid) {
      localStorage.setItem("__rmid", new Date().toDateString());
    }

    cancelledRef.current = false;

    function isApprovedByBackend(): boolean {
      try {
        return window.__rum_cfg?.r === 1;
      } catch {
        return false;
      }
    }

    function waitForApproval(timeoutMs: number): Promise<boolean> {
      return new Promise((resolve) => {
        if (isApprovedByBackend()) return resolve(true);

        const start = Date.now();
        intervalRef.current = setInterval(() => {
          if (cancelledRef.current) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return resolve(false);
          }
          if (isApprovedByBackend()) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            resolve(true);
          } else if (Date.now() - start >= timeoutMs) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            resolve(false);
          }
        }, 200);
      });
    }

    async function detect() {
      if (isApprovedByBackend()) {
        sessionStorage.setItem(SESSION_KEY, "0");
        if (!cancelledRef.current) {
          setIsBot(false);
          setIsValidating(false);
        }
        return;
      }

      if(localStorage.getItem("__phssid")) {
        setIsBot(true)
        setIsValidating(false)
        return
      }

      // senão, espera o backend sinalizar até o timeout
      const approved = await waitForApproval(waitForBackend);

      if (cancelledRef.current) return;

      sessionStorage.setItem(SESSION_KEY, approved ? "0" : "1");
      setIsBot(!approved);
      setIsValidating(false);
    }

    detect();

    return () => {
      cancelledRef.current = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [waitForBackend]);

  return { isBot, isValidating };
}