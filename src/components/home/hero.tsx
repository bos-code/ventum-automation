import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { getSettings } from "@/lib/data/settings";
import { whatsappLink } from "@/lib/site-config";
import protectionParts from "../../../assets/products/client_photos/enhanced_full/1000420738_enhanced.jpg";
import protectionBox from "../../../assets/products/client_photos/enhanced_full/1000420740_enhanced.jpg";
import styles from "./hero.module.css";
import { HeroVideo } from "./hero-video";

// Curated real stock photography, bundled locally for a reliable first paint.
const brands = [
  { name: "Schneider Electric", file: "schneider-electric-white.png" },
  { name: "JOYELEC", file: "joyelec-white.png" },
  { name: "Posmith", file: "posmith-white.png" },
  { name: "CHINT", file: "chint-white.png" },
];

export async function Hero() {
  const settings = await getSettings();
  const imageProps = {
    alt: "JOYELEC circuit breakers, surge protection devices and voltage protector photographed at Ventum",
    quality: 95,
    loading: "eager" as const,
    fetchPriority: "high" as const,
    className: styles.productImage,
  };
  const { props: desktopImage } = getImageProps({
    ...imageProps,
    src: protectionParts,
    sizes:
      "(min-width: 1152px) 516px, (min-width: 1101px) calc((100vw - 120px) / 2), calc((100vw - 98px) / 2)",
  });
  const { props: mobileImage } = getImageProps({
    ...imageProps,
    src: protectionBox,
    sizes:
      "(min-width: 608px) 558px, (min-width: 480px) calc(100vw - 50px), calc(100vw - 42px)",
  });

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <HeroVideo />
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>
              <span aria-hidden="true" /> Electrical / Solar / Industrial
            </p>
            <h1 id="hero-title" className={styles.title}>
              Electrical &amp; Solar Equipment
              <span>You Can Trust.</span>
            </h1>
            <p className={styles.description}>
              Quality breakers, contactors, solar protection and industrial
              components.
            </p>

            <div className={styles.actions}>
              <Link href="/products" className={styles.primary}>
                Browse Products <Arrow />
              </Link>
              <a
                href={whatsappLink(
                  settings.whatsapp,
                  "Hi Ventum, I'd like to check availability and pricing for a part.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondary}
              >
                Check stock on WhatsApp <Arrow />
              </a>
            </div>
            <a
              href={whatsappLink(
                settings.whatsapp,
                "Hi Ventum, I don't know the name of this part. I'll send you a photo — can you help me identify it?",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.photoNote}
            >
              <span aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  width="15"
                  height="15"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </span>
              <span>
                <strong>Don&apos;t know the part name?</strong> Send us a photo
                — we&apos;ll identify it.
              </span>
            </a>
          </div>

          <figure className={styles.showcase}>
            <div className={styles.figureHeader}>
              <span>IN FOCUS / JOYELEC</span>
              <span className={styles.photoLabel}>Our product photography</span>
            </div>
            <div className={styles.imageFrame}>
              <picture>
                <source
                  media="(min-width: 900px)"
                  srcSet={desktopImage.srcSet}
                  sizes={desktopImage.sizes}
                  width={desktopImage.width}
                  height={desktopImage.height}
                />
                {/* Next.js generates optimized sources; picture downloads only the matching photo. */}
                <img {...mobileImage} alt={imageProps.alt} />
              </picture>
            </div>
            <figcaption className={styles.caption}>
              <div>
                <span className={styles.captionLabel}>
                  BUILT AROUND YOUR INSTALLATION
                </span>
                <p>Protection. From the start.</p>
              </div>
              <span className={styles.figureNumber} aria-hidden="true">
                01
              </span>
            </figcaption>
          </figure>
        </div>
        <div className={styles.trust}>
          <div className={styles.location}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <div>
              <strong>Visit our store</strong>
              <span>{settings.address}</span>
            </div>
          </div>
          <div
            className={styles.brands}
            aria-label="Some of the brands we sell"
          >
            <span className={styles.brandsLabel}>
              BRANDS
              <br />
              WE SELL
            </span>
            {brands.map((brand) => (
              <Image
                key={brand.file}
                src={`/brand/manufacturers/${brand.file}`}
                alt={brand.name}
                width={130}
                height={40}
                className={styles.brand}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
