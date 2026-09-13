import Image from "next/image";
import Link from "next/link";
import { getSettings } from "@/lib/data/settings";
import { whatsappLink } from "@/lib/site-config";
import protectionParts from "../../../assets/products/client_photos/enhanced_full/1000420738_enhanced.jpg";
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
            The right parts.
            <span>For what’s next.</span>
          </h1>
          <p className={styles.description}>
            Circuit breakers, contactors and solar protection for your next
            project. Find your part. Check the specs. Talk to our team.
          </p>

          <div className={styles.actions}>
            <Link
              href="#catalogue"
              className={styles.primary}
            >
              Browse Products <Arrow />
            </Link>
            <a
              href={whatsappLink(
                settings.whatsapp,
                "Hi Ventum, I'd like to check availability and pricing for a part."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondary}
            >
              Check stock on WhatsApp <Arrow />
            </a>
          </div>
          <p className={styles.note}>Have a part number or photo? Send it to us.</p>
        </div>

        <figure className={styles.showcase}>
          <div className={styles.figureHeader}>
            <span>IN FOCUS / JOYELEC</span>
            <span className={styles.photoLabel}>Our product photography</span>
          </div>
          <div className={styles.imageFrame}>
          <Image
            src={protectionParts}
            alt="JOYELEC circuit breakers, surge protection devices and adjustable voltage protector photographed at Ventum"
            preload
            placeholder="blur"
            sizes="(min-width: 1152px) 510px, (min-width: 900px) 46vw, (min-width: 600px) 560px, 100vw"
            className={styles.productImage}
          />
          </div>
          <figcaption className={styles.caption}>
            <div>
              <span className={styles.captionLabel}>BUILT AROUND YOUR INSTALLATION</span>
              <p>Protection. From the start.</p>
            </div>
            <span className={styles.figureNumber} aria-hidden="true">01</span>
          </figcaption>
        </figure>
       </div>
        <div className={styles.trust}>
          <div className={styles.location}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <div><strong>Visit our store</strong><span>Alaba International Market, Lagos</span></div>
          </div>
          <div className={styles.brands} aria-label="Some of the brands we sell">
            <span className={styles.brandsLabel}>BRANDS<br />WE SELL</span>
            {brands.map((brand) => (
              <Image key={brand.file} src={`/brand/manufacturers/${brand.file}`}
                alt={brand.name} width={130} height={40} className={styles.brand} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
