import { useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { UNIVERSE_REDIRECTS } from "~/content/universe";
import { BASE, SITE_URL } from "~/lib/meta";
import type { Route } from "./+types/universe-redirect";

/**
 * Old /universe/<slug> addresses (before the Earth showed the 90 case studies).
 * Static hosting has no server redirects, so each old address is a prerendered
 * page that moves on at once: client navigation when the app runs, a meta
 * refresh without JavaScript, and a canonical link to the new address.
 * The query string and hash are carried over (e.g. ?tier=laptop, ?view=2d):
 * by the client navigation, and before the app starts by the inline script
 * in root.tsx, which runs before the meta refresh (that only fires after load).
 */
export const withQuery = (to: string, search: string, hash: string) => {
  const [path, toHash] = to.split("#");
  return path + search + (hash || (toHash ? `#${toHash}` : ""));
};
export const meta = ({ params }: Route.MetaArgs) => {
  const to = UNIVERSE_REDIRECTS[params.slug];
  if (!to) return [{ title: "Moved · Gaurav.OS" }, { name: "robots", content: "noindex" }];
  return [
    { title: "Moved · Gaurav.OS" },
    { name: "robots", content: "noindex" },
    { httpEquiv: "refresh", content: `0; url=${BASE}${to}` },
    ...(SITE_URL ? [{ tagName: "link", rel: "canonical", href: SITE_URL + to }] : []),
  ];
};

export default function UniverseRedirect() {
  const { slug = "" } = useParams();
  const { search, hash } = useLocation();
  const navigate = useNavigate();
  const to = UNIVERSE_REDIRECTS[slug];
  useEffect(() => { if (to) navigate(withQuery(to, search, hash), { replace: true }); }, [to, search, hash, navigate]);
  return (
    <div className="grid min-h-[60svh] place-items-center p-6 text-center" data-testid="moved">
      <div>
        <h1 className="text-3xl font-bold">{to ? "This page has moved" : `No destination called “${slug}”`}</h1>
        <p className="mt-3 text-muted">{to ? <Link to={to} className="underline underline-offset-4">Continue to the new page</Link> : <Link to="/universe" className="underline underline-offset-4">The 90 case studies in 3D</Link>}</p>
      </div>
    </div>
  );
}
