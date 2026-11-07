/** Analytics-ready event layer. Names + timestamp only; no identifiers, no
 *  third parties. Events go to window.dataLayer if a host page provides one. */
export type EventName =
  | "page_view" | "cta_click" | "recruiter_mode_opened" | "explore_mode_opened" | "district_opened"
  | "project_opened" | "search_used" | "ask_question" | "ask_refused" | "tool_used" | "export_downloaded"
  | "cv_downloaded" | "contact_click" | "intro_started" | "intro_skipped" | "intro_completed"
  | "guide_opened" | "guide_text" | "guide_voice" | "guide_prompt" | "guide_navigate" | "universe_opened" | "universe_marker";
export function track(name: EventName, detail?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: unknown[] };
  (w.dataLayer ??= []).push({ event: name, t: Date.now(), ...detail });
}
