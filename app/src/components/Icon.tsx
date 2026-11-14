/** Line icons from the approved brand library (brand/assets/icons), inlined so
 *  they inherit currentColor. Always paired with visible text or an aria-label. */
const P: Record<string, string> = {
  product: '<path d="M12 2.8 20 7.2v9.6L12 21.2 4 16.8V7.2z"/><path d="M4 7.2 12 11.6 20 7.2M12 11.6v9.6"/>',
  ai: '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="17" r="2"/><circle cx="19" cy="17" r="2"/><circle cx="12" cy="12" r="1.6"/><path d="M12 7v3.4M10.7 13 6.6 15.9M13.3 13l4.1 2.9M7 17h10"/>',
  code: '<rect x="3" y="4.5" width="18" height="12.5" rx="1.8"/><path d="M2 20h20M10 8.5 7.6 10.8 10 13M14 8.5l2.4 2.3L14 13"/>',
  leadership: '<path d="M4 6h9M4 12h13M4 18h7"/><circle cx="16" cy="6" r="2"/><circle cx="20" cy="12" r="2"/><circle cx="14" cy="18" r="2"/>',
  health: '<path d="M2.5 12h4.2l2-4.5 3 9 2.4-6.5 1.4 2H21.5"/>',
  shield: '<path d="M12 2.8 19.5 5.6v6c0 4.4-3.2 8-7.5 9.6-4.3-1.6-7.5-5.2-7.5-9.6v-6z"/><circle cx="12" cy="11.5" r="2.4"/>',
  research: '<circle cx="6" cy="17" r="1.5"/><circle cx="10" cy="11" r="1.5"/><circle cx="15" cy="14" r="1.5"/><circle cx="18.5" cy="6.5" r="1.5"/><path d="M3 21h18"/>',
  experience: '<path d="M3 15h18"/><circle cx="6" cy="15" r="1.6"/><circle cx="12" cy="15" r="1.6"/><circle cx="18" cy="15" r="1.6"/><path d="M12 13.4V8h6v-3"/>',
  hq: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="3.5" r="1.4"/><circle cx="20.1" cy="9.4" r="1.4"/><circle cx="7" cy="18.9" r="1.4"/>',
  explore: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  recruiter: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M5.5 16c.6-1.6 1.7-2.4 3-2.4s2.4.8 3 2.4M14 10h4M14 13.5h3"/>',
  download: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M12.5 10.5v6M10 14l2.5 2.5L15 14"/>',
  search: '<circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5"/>',
  ask: '<path d="M4 5h16v11H9.5L5 19.5V16H4z"/><path d="M9.5 9.2a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.7-.9 1.3M12 14.6v.1"/>',
  skip: '<path d="M5 6v12l9-6zM18 6v12"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  arrow: '<path d="M4 12h15M14 7l5 5-5 5"/>',
  back: '<path d="M20 12H5M10 7l-5 5 5 5"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  evidence: '<path d="M12 3 4.5 6v5.5c0 4.3 3.1 7.9 7.5 9.5 4.4-1.6 7.5-5.2 7.5-9.5V6z"/><path d="m8.8 12.2 2.2 2.2 4.4-4.6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
  linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10.5V17M8 7.2v.1M12 17v-3.6c0-1.6 1-2.6 2.3-2.6s2.2 1 2.2 2.6V17M12 10.5V17"/>',
  github: '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  up: '<path d="m6 15 6-6 6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  left: '<path d="m15 6-6 6 6 6"/>',
  right: '<path d="m9 6 6 6-6 6"/>',
  reset: '<path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  play: '<path d="M7 4.5v15l12-7.5z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  sound: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11"/>',
  mute: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="m17 10 4 4M21 10l-4 4"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
};
export type IconName = keyof typeof P;
export function Icon({ name, size = 18, className = "", label }: { name: IconName; size?: number; className?: string; label?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}
      strokeLinecap="round" strokeLinejoin="round" className={className}
      role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{ __html: P[name] ?? "" }} />
  );
}
