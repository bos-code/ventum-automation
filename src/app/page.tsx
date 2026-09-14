import { Hero } from "@/components/home/hero";
import { StatsBand } from "@/components/home/stats-band";
import { WhyVentum } from "@/components/home/why-ventum";
import { WhoWeServe } from "@/components/home/who-we-serve";
import { CatalogueTeaser } from "@/components/home/catalogue-teaser";
import { AboutBrands } from "@/components/home/about-brands";
import { ContactCta } from "@/components/home/contact-cta";
import { StoreVideo } from "@/components/home/store-video";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBand />
      <WhyVentum />
      <WhoWeServe />
      <CatalogueTeaser />
      <AboutBrands />
      <ContactCta />
      <StoreVideo />
    </>
  );
}
