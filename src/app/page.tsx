import { Providers } from "@/components/providers";
import { SiteNav } from "@/components/sections/site-nav";
import { Hero } from "@/components/sections/hero";
import { TrustBand } from "@/components/sections/trust-band";
import { Method } from "@/components/sections/method";
import { Programs } from "@/components/sections/programs";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Testimonials } from "@/components/sections/testimonials";
import { Location } from "@/components/sections/location";
import { EnrollForm } from "@/components/sections/enroll-form";
import { SiteFooter } from "@/components/sections/site-footer";
import { MobileCtaBar } from "@/components/sections/mobile-cta-bar";

export default function Home() {
  return (
    <Providers>
      <SiteNav />
      <main>
        <Hero />
        <TrustBand />
        <Method />
        <Programs />
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
