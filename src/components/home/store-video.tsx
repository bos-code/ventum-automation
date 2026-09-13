import { getSettings } from "@/lib/data/settings";
import { whatsappLink } from "@/lib/site-config";
import styles from "./store-video.module.css";

export async function StoreVideo() {
  const settings = await getSettings();
  return (
    <section id="inside-ventum" className={styles.section} aria-labelledby="store-video-title">
      <div className={styles.container}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>BEHIND THE COUNTER</p>
          <h2 id="store-video-title">Step inside<br />Ventum.</h2>
          <p className={styles.description}>A quick look at the shelves behind your next project. See our store, then talk to our team about the parts you need.</p>
          <div className={styles.location}>
            <span>FIND US AT</span>
            <p>{settings.address}</p>
          </div>
          <a href={whatsappLink(settings.whatsapp, "Hi Ventum, I'd like to enquire about a part or visit your store.")}
            target="_blank" rel="noopener noreferrer" className={styles.link}>Talk to our team <span aria-hidden="true">↗</span></a>
        </div>
        <figure className={styles.figure}>
          <video controls muted playsInline preload="none" poster="/video/shop-poster.jpg"
            width={848} height={478} aria-label="A look inside the Ventum store, silent video"
            aria-describedby="store-video-caption">
            <source src="/video/shop-silent.mp4" type="video/mp4" />
            <a href="/video/shop-silent.mp4">Watch the silent store video</a>
          </video>
          <figcaption id="store-video-caption"><span>ALABA INTERNATIONAL MARKET / LAGOS</span><span>18 seconds · No audio</span></figcaption>
        </figure>
      </div>
    </section>
  );
}
