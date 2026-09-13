import { Hero } from "@/components/home/hero";
import { FeaturedProducts } from "@/components/home/featured-products";
import { WhyVentum } from "@/components/home/why-ventum";
import { CatalogueTeaser } from "@/components/home/catalogue-teaser";
import { BrandsStrip } from "@/components/home/brands-strip";
import { AboutTeaser } from "@/components/home/about-teaser";
import { ContactCta } from "@/components/home/contact-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <WhyVentum />
      <CatalogueTeaser />
      <BrandsStrip />
      <AboutTeaser />
      <ContactCta />
    </>
  );
}
