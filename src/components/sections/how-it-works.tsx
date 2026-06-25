import { STEPS } from "@/lib/site";
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

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.12}>
              <div className="relative h-full rounded-[1.5rem] border border-border bg-background/40 p-7">
                <span className="font-display text-5xl font-extrabold text-primary/30">
                  {step.number}
                </span>
                <h3 className="mt-3 font-display text-xl font-bold">
                  {step.title}
                </h3>
                <p className="mt-2 text-foreground/70">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
