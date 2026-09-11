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
  toProductView,
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
      getStockGalleryImages(10),
    ]);

  const productViews = products.map((product) =>
    toProductView(product, categories),
  );

  const categoriesWithCounts = categories.map((category) => {
    const categoryProducts = productViews.filter(
      (product) => product.categoryId === category.id,
    );
    const preview = categoryProducts.find(
      (product) => product.imageUrls.length > 0,
    );

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

  const heroProducts = [...featured, ...productViews.filter((product) => !featured.some((item) => item.id === product.id))].slice(0, 3);

  return (
    <>
      <Hero
        settings={settings}
        productCount={products.length}
        brandCount={brands.length}
        products={heroProducts}
      />
      <BrandList brands={brands} />
      <CategoryGrid categories={categoriesWithCounts.filter((category) => category.productCount > 0)} />
      <FeaturedProducts products={featured} />
      <StockGallery images={galleryImages} />
      <About settings={settings} image={galleryImages[0]} />
      <WhyVentum />
      <Contact settings={settings} />
    </>
  );
}
