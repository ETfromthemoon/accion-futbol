import { Providers } from "@/components/providers";
import { SiteNav } from "@/components/sections/site-nav";
import { Hero } from "@/components/sections/hero";
import { TrustBand } from "@/components/sections/trust-band";
import { Method } from "@/components/sections/method";
import { Programs } from "@/components/sections/programs";
import { StatementBreak } from "@/components/sections/statement-break";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Testimonials } from "@/components/sections/testimonials";
import { Location } from "@/components/sections/location";
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
        <TrustBand />
        <Method />
        <Programs />
        <StatementBreak />
        <HowItWorks />
        <Testimonials />
        <Location />
        <EnrollForm />
      </main>
      <SiteFooter />
      <MobileCtaBar />
    </Providers>
  );
}
