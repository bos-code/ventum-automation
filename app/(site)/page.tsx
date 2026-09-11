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

  const categoriesWithCounts = categories.map((category) => {
    const categoryProducts = products.filter((p) => p.categoryId === category.id);
    const preview = categoryProducts.find((p) => p.imageUrls.length > 0);

    return {
      ...category,
      productCount: categoryProducts.length,
      previewImage: preview?.imageUrls[0],
      previewAlt: preview?.name ?? category.name,
    };
  });

  const brands = [
    ...new Set(products.map((p) => p.brand).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b));

  const heroProducts = (featured.length > 0 ? featured : products).slice(0, 3);

  return (
    <>
      <Hero
        settings={settings}
        productCount={products.length}
        brandCount={brands.length}
        products={heroProducts}
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
