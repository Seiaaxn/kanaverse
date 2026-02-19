import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KanaVerse - Baca Komik Manga, Manhwa, Manhua Sub Indo",
    short_name: "KanaVerse",
    description:
      "Baca komik manga, manhwa, manhua subtitle Indonesia secara gratis di kuromanga.me",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0f",
    theme_color: "#3B82F6",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
