import { Providers } from "@/components/providers";
import { SiteNav } from "@/components/sections/site-nav";
import { Hero } from "@/components/sections/hero";
import { Method } from "@/components/sections/method";
import { Programs } from "@/components/sections/programs";
import { StatementBreak } from "@/components/sections/statement-break";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Testimonials } from "@/components/sections/testimonials";
import { SedesMap } from "@/components/sections/sedes/sedes-map";
import { EnrollForm } from "@/components/sections/enroll-form";
import { SiteFooter } from "@/components/sections/site-footer";
import { MobileCtaBar } from "@/components/sections/mobile-cta-bar";

export default function Home() {
  return (
    <Providers>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <SiteNav />
      <main id="contenido" tabIndex={-1}>
        <Hero />
        <Method />
        <Programs />
        <StatementBreak />
        <HowItWorks />
        <Testimonials />
        <SedesMap />
        <EnrollForm />
      </main>
      <SiteFooter />
      <MobileCtaBar />
    </Providers>
  );
}
