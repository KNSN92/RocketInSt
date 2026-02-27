import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RocketIn.st",
    short_name: "RocketInSt",
    description: "キャンパス上の様々な情報を提供するサービス",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        purpose: "any",
        src: "/logo/logo.png",
        sizes: "459x459",
        type: "image/png",
      },
    ],
  };
}
