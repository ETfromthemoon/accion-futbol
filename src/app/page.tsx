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
import { StructuredData } from "@/components/structured-data";
import { SectionScroll } from "@/components/sections/section-scroll";
import { NewsSection } from "@/components/news/news-section";
import { listPublishedNews } from "@/lib/news/repository";
import type { NewsPost } from "@/lib/news/schema";

export const dynamic = "force-dynamic";

export default async function Home() {
  let news: NewsPost[] = [];
  try { news = await listPublishedNews(3); } catch { /* La portada sigue disponible si falla la base de noticias. */ }
  return (
    <Providers>
      <StructuredData />
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <SiteNav />
      <SectionScroll />
      <main id="contenido" tabIndex={-1}>
        <Hero />
        <Method />
        <Programs />
        <StatementBreak />
        <HowItWorks />
        <NewsSection posts={news} />
        <Testimonials />
        <SedesMap />
        <EnrollForm />
      </main>
      <SiteFooter />
      <MobileCtaBar />
    </Providers>
  );
}
