"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./hero.module.css";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let visible = true;
    const sync = () => {
      if (motion.matches || connection?.saveData || !visible || document.hidden || userPaused.current) {
        video.pause();
        return;
      }
      if (!video.getAttribute("src")) video.src = "/video/hero-loop.mp4";
      void video.play().catch(() => { /* Poster and manual play remain available. */ });
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(video);
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      video.pause();
    };
  }, []);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (!video.paused) {
      userPaused.current = true;
      video.pause();
    } else {
      userPaused.current = false;
      if (!video.getAttribute("src")) video.src = "/video/hero-loop.mp4";
      void video.play().catch(() => {});
    }
  }

  return (
    <>
      <video ref={videoRef} className={styles.backgroundVideo} muted loop playsInline
        preload="none" poster="/video/shop-poster.jpg" aria-hidden="true" tabIndex={-1}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
      <div className={styles.videoScrim} aria-hidden="true" />
      <button type="button" className={styles.videoToggle} onClick={togglePlayback}
        aria-label={playing ? "Pause hero background video" : "Play hero background video"}>
        <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span> {playing ? "Pause video" : "Play video"}
      </button>
    </>
  );
}
