import { Container, ButtonLink } from "~/components/ui";
import { seo } from "~/lib/meta";
export const meta = () => seo("Page not found", "This page does not exist.", "/404");
export default function NotFound() {
  return (
    <Container className="py-24">
      <p className="eyebrow mb-3">404</p>
      <h1 className="text-4xl font-bold">This page does not exist.</h1>
      <p className="mt-4 text-muted">It may have moved in the rebuild. Everything is reachable from the homepage or search.</p>
      <div className="mt-8 flex flex-wrap gap-3"><ButtonLink to="/" variant="primary" icon="back">Home</ButtonLink><ButtonLink to="/search" icon="search">Search</ButtonLink></div>
    </Container>
  );
}
