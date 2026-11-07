import { isImmersive } from "~/lib/immersive";
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, Link, useLocation } from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { SearchProvider } from "./components/Search";
import { Container } from "./components/ui";
import { asset } from "./lib/meta";
import { GuideRoot } from "./guide/GuideRoot";
import { Cursor } from "./interaction/Cursor";
import { Transitions } from "./interaction/Transitions";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: asset("/favicon.svg"), type: "image/svg+xml" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0B1110" />
        <meta name="author" content="Gaurav Singh" />
        <Meta />
        {/* old addresses (prerendered redirect pages): carry the query string and hash to the new address before the meta refresh fires */}
        <script dangerouslySetInnerHTML={{ __html: KEEP_QUERY }} />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const KEEP_QUERY = `(function(){var m=document.querySelector('meta[http-equiv="refresh"]');if(!m||!(location.search||location.hash))return;var u=(m.getAttribute("content")||"").split("url=")[1];if(!u)return;var p=u.split("#");location.replace(p[0]+location.search+(location.hash||(p[1]?"#"+p[1]:"")));})()`;

export default function App() {
  // the 3D Earth and the 3D worlds are full-screen cinematic modes with their own top bar (and an Exit)
  const immersive = isImmersive(useLocation().pathname);
  return (
    <SearchProvider>
      <a href="#main" className="skip-link">Skip to content</a>
      {!immersive && <Header />}
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      {!immersive && <Footer />}
      <GuideRoot />
      <Cursor />
      <Transitions />
    </SearchProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let title = "Something went wrong";
  let detail = "An unexpected error occurred. The page has been left as it was.";
  if (isRouteErrorResponse(error)) {
    title = error.status === 404 ? "Page not found" : `Error ${error.status}`;
    detail = error.status === 404 ? "That page does not exist." : error.statusText || detail;
  }
  return (
    <Container className="py-24">
      <p className="eyebrow mb-3">Gaurav.OS</p>
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="mt-4 text-muted">{detail}</p>
      <Link to="/" className="mt-8 inline-block underline underline-offset-4">Return home</Link>
    </Container>
  );
}
