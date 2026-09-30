declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackLead(params: Record<string, unknown>) {
  try {
    window.dataLayer?.push({ event: "generate_lead", ...params });
    window.gtag?.("event", "generate_lead", params);
    window.fbq?.("track", "Lead", params);
  } catch {
    /* tracking nunca deve quebrar o fluxo */
  }
}

/** Captura UTMs/click ids da URL atual (e persiste na sessão). */
export function getUtm(): Record<string, string> {
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"];
  const out: Record<string, string> = {};
  try {
    const stored = JSON.parse(sessionStorage.getItem("lausen_utm") || "{}") as Record<string, string>;
    Object.assign(out, stored);
    const params = new URLSearchParams(window.location.search);
    keys.forEach((k) => {
      const v = params.get(k);
      if (v) out[k] = v;
    });
    sessionStorage.setItem("lausen_utm", JSON.stringify(out));
  } catch {
    /* storage indisponível */
  }
  return out;
}
