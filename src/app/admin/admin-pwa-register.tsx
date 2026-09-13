"use client";

import { useEffect } from "react";

export function AdminPwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/admin/sw.js", { scope: "/admin/" })
      .catch((error) => {
        console.error("Admin service worker registration failed:", error);
      });
  }, []);

  return null;
}
