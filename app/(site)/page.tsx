import { Hero } from "@/components/site/home/hero";
import { CategoryGrid } from "@/components/site/home/category-grid";
import { FeaturedProducts } from "@/components/catalog/featured-products";
import { BrandList } from "@/components/site/home/brand-list";
import { About } from "@/components/site/home/about";
import { WhyVentum } from "@/components/site/home/why-ventum";
import { StockGallery } from "@/components/site/home/stock-gallery";
import { Contact } from "@/components/site/home/contact";
import {
  getFeaturedProducts,
  getPublishedProducts,
  getStockGalleryImages,
} from "@/lib/appwrite/products";
import { getPublishedCategories } from "@/lib/appwrite/categories";
import { getSettings } from "@/lib/appwrite/settings";

export const revalidate = 300;

export default async function HomePage() {
  const [settings, products, categories, featured, galleryImages] =
    await Promise.all([
      getSettings(),
      getPublishedProducts(),
      getPublishedCategories(),
      getFeaturedProducts(8),
      getStockGalleryImages(8),
    ]);

  const categoriesWithCounts = categories.map((category) => ({
    ...category,
    productCount: products.filter((p) => p.categoryId === category.id).length,
  }));

  const brands = [
    ...new Set(products.map((p) => p.brand).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b));

  return (
    <>
      <Hero
        settings={settings}
        productCount={products.length}
        brandCount={brands.length}
      />
      <CategoryGrid categories={categoriesWithCounts} />
      <FeaturedProducts products={featured} />
      <BrandList brands={brands} />
      <About settings={settings} />
      <WhyVentum />
      <StockGallery images={galleryImages} />
      <Contact settings={settings} />
    </>
  );
}
