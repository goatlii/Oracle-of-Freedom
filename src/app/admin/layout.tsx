import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Karla } from "next/font/google";
import { InstallAppButton } from "@/components/install-app-button";
import "../globals.css";

const serif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const sans = Karla({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-karla",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Estudio · Oracle of Freedom",
  applicationName: "Estudio",
  manifest: "/admin/manifest.webmanifest",
  robots: { index: false, follow: false },
  appleWebApp: {
    capable: true,
    title: "Estudio",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4ece1",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen bg-sand font-sans text-ink antialiased">
        {children}
        <InstallAppButton />
      </body>
    </html>
  );
}
