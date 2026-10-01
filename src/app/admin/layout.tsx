import type { Metadata } from "next";
import { DM_Serif_Display, Karla } from "next/font/google";
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
  title: "Prices & offers · Oracle of Freedom",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen bg-sand font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
