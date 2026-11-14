import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

const EMPTY = new URLSearchParams();

/**
 * useSearchParams for prerendered pages. Every page is prerendered without a query string, so a page
 * that filters from ?category=… on its very first browser render produces different text from the
 * prerendered HTML (React hydration error #418 on shared links). This returns empty params for that
 * first render — matching the HTML — and the real params immediately after hydration. Setting params
 * is unchanged.
 */
export function useHydratedSearchParams() {
  const [params, setParams] = useSearchParams();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return [hydrated ? params : EMPTY, setParams] as const;
}
