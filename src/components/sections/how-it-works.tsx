import { MethodJourney } from "@/components/sections/method-journey";
import { KnowledgeSearch } from "@/components/sections/knowledge-search";

export function HowItWorks() {
  return (
    <section id="como-funciona" aria-labelledby="how-title" className="method-knowledge-section relative">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <MethodJourney />
        <KnowledgeSearch />
      </div>
    </section>
  );
}
