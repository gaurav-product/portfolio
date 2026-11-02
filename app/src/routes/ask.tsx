import { PageHero, Container } from "~/components/ui";
import { AskGaurav } from "~/components/AskGaurav";
import { RoboGuide } from "~/components/RoboGuide";
import { seo, asset } from "~/lib/meta";
export const meta = () => seo("Ask Gaurav", "A transparent, local Q&A over verified portfolio facts. No live AI model; unsupported questions are refused.", "/ask");
export default function Ask() {
  return (
    <>
      <PageHero eyebrow="Ask Gaurav" title="Questions, answered only from evidence" intro="No language model is connected. Your question is checked for unsupported asks, then matched to a pre-written answer built from the CV and project repositories. If nothing matches, it says so." />
      <Container className="grid gap-8 py-12 lg:grid-cols-[1.4fr_1fr]">
        <AskGaurav />
        <div className="grid content-start gap-6"><RoboGuide className="max-w-[170px]" /><figure className="card self-start p-4">
          <img src={asset("/brand/sections/section-ask-gaurav-pipeline.svg")} alt="Question, intent, evidence, grounded answer and sources, with a refusal branch when no evidence exists." width={1600} height={900} className="w-full rounded-lg" loading="lazy" />
          <figcaption className="mt-3 text-sm text-muted">The refusal check runs first, so “What is Aaroh's revenue?” is refused instead of answered with the general Aaroh entry.</figcaption>
        </figure></div>
      </Container>
    </>
  );
}
