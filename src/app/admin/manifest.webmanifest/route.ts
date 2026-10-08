import { NextResponse } from "next/server";

const manifest = {
  name: "Estudio · Oracle of Freedom",
  short_name: "Estudio",
  description: "Solicitudes, agenda y precios de Oracle of Freedom.",
  start_url: "/admin",
  scope: "/admin",
  display: "standalone",
  background_color: "#f4ece1",
  theme_color: "#f4ece1",
  lang: "es",
  id: "/admin",
  icons: [
    { src: "/studio/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/studio/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    { src: "/studio/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
  ],
};

export function GET() {
  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
