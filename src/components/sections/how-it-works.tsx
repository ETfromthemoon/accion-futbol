import { Plus } from "lucide-react";
import { FAQS, STEPS } from "@/lib/site";
import { Reveal } from "@/components/ui/reveal";

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="relative border-y border-border bg-surface/40 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="section-tag">Cómo funciona</p>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl text-balance">
            De la duda a la cancha en tres pasos.
          </h2>
        </Reveal>

        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.number}>
              <Reveal delay={i * 0.12} className="h-full">
                <div className="relative h-full border-t border-primary/50 py-7 pr-6">
                  <span className="font-display text-5xl font-extrabold text-primary">
                    {step.number}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-bold">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-foreground/70">{step.description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="mt-20 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <p className="section-tag">Preguntas frecuentes</p>
            <h3 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-balance">
              Lo que todos preguntan antes de venir.
            </h3>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border-t border-border">
              {FAQS.map((faq) => (
                <details key={faq.question} className="faq-item group border-b border-border">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-lg font-bold">
                    {faq.question}
                    <Plus
                      aria-hidden="true"
                      className="size-5 shrink-0 text-primary transition-transform duration-300 group-open:rotate-45"
                    />
                  </summary>
                  <p className="pb-5 pr-10 text-foreground/70">{faq.answer}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
