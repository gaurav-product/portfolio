import { useEffect, useState } from "react";
/** State kept in sessionStorage only: never sent anywhere, cleared when the tab closes. */
export function useSessionState<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const s = sessionStorage.getItem("gos:" + key); if (s) setV(JSON.parse(s)); } catch {}
    setReady(true);
  }, [key]);
  useEffect(() => { if (ready) try { sessionStorage.setItem("gos:" + key, JSON.stringify(v)); } catch {} }, [key, v, ready]);
  return [v, setV] as const;
}
