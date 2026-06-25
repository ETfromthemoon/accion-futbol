import { METRICS } from "@/lib/site";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Reveal } from "@/components/ui/reveal";

export function TrustBand() {
  return (
    <section className="relative border-y border-border bg-surface/40">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden px-5 py-12 sm:px-8 lg:grid-cols-4">
        {METRICS.map((metric, i) => (
          <Reveal key={metric.label} delay={i * 0.1} className="px-3 text-center">
            <div className="font-display text-4xl font-extrabold text-primary sm:text-5xl">
              {metric.prefix}
              <NumberTicker value={metric.value} />
              {metric.suffix}
            </div>
            <p className="mt-2 text-sm text-muted">{metric.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
