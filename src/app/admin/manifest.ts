import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ventum Admin",
    short_name: "Ventum Admin",
    description: "Ventum Global Automation administration dashboard",
    start_url: "/admin",
    scope: "/admin/",
    display: "standalone",
    background_color: "#f7f7f5",
    theme_color: "#081525",
    icons: [
      {
        src: "/brand/ventum-mark.png",
        sizes: "any",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
