import Image from "next/image";
import Link from "next/link";
import { getFeaturedProducts } from "@/lib/data/products";
import { getSettings } from "@/lib/data/settings";
import { productImageUrl } from "@/lib/appwrite/images";
import { formatPrice } from "@/lib/format";
import { whatsappLink } from "@/lib/site-config";
import styles from "./featured-products.module.css";

export async function FeaturedProducts() {
  const [products, settings] = await Promise.all([getFeaturedProducts(), getSettings()]);
  if (products.length === 0) return null;

  return (
    <section id="featured" aria-labelledby="featured-title" className={styles.section}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>SELECTED FROM OUR SHELVES</p>
            <h2 id="featured-title" className={styles.title}>Parts for the job ahead.</h2>
            <p className={styles.intro}>A closer look at our featured parts. Check the details, then ask us about availability.</p>
          </div>
          <Link href="#catalogue" className={styles.catalogue}>Browse the catalogue <Arrow /></Link>
        </header>

        <div className={styles.grid}>
          {products.map((product, index) => (
            <article key={product.id} className={styles.card} aria-labelledby={`featured-${product.id}`}>
              <div className={styles.cardTop}>
                <span className={styles.brand}>{product.brand}</span>
                <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.media}>
                  {product.imageIds[0] ? (
                    <Image src={productImageUrl(product.imageIds[0])} alt={product.name}
                      fill sizes="(min-width: 1100px) 200px, (min-width: 760px) 36vw, 40vw"
                      className={styles.image} />
                  ) : <span className={styles.noImage}>Photo available on request</span>}
                </div>
                <div className={styles.info}>
                  {product.model && <p className={styles.model}>MODEL / {product.model}</p>}
                  <h3 id={`featured-${product.id}`} className={styles.name}>{product.name}</h3>
                  {product.shortDescription && <p className={styles.description}>{product.shortDescription}</p>}
                  {product.specifications.length > 0 && (
                    <dl className={styles.specs}>
                      {product.specifications.slice(0, 4).map((spec, specIndex) => (
                        <div key={`${spec.label}-${specIndex}`}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>
                      ))}
                    </dl>
                  )}
                  {!product.inStock && <p className={styles.unavailable}>Currently out of stock — ask about restocking.</p>}
                </div>
              </div>
              <footer className={styles.cardFooter}>
                <div className={styles.priceBlock}>
                  <span className={styles.priceLabel}>{product.price == null ? "PRICING" : "LISTED PRICE"}</span>
                  <span className={styles.price}>{formatPrice(product.price, product.currency)}</span>
                </div>
                <a className={styles.enquire}
                  href={whatsappLink(settings.whatsapp, `Hi Ventum, I'm interested in ${product.name} by ${product.brand}${product.model ? ` (model: ${product.model})` : ""}. Please confirm availability and current pricing.`)}
                  target="_blank" rel="noopener noreferrer"
                  aria-label={`Ask on WhatsApp about ${product.name}${product.model ? `, ${product.model}` : ""}`}>
                  Ask about this part <Arrow />
                </a>
              </footer>
            </article>
          ))}
        </div>
        <p className={styles.footnote}><span aria-hidden="true">↗</span> Buying for an installation? Confirm the model, rating and quantity with our team before ordering.</p>
      </div>
    </section>
  );
}

function Arrow() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}
