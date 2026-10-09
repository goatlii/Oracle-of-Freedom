import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Karla } from "next/font/google";
import { InstallAppButton } from "@/components/install-app-button";
import { StudioLangProvider } from "@/components/studio-lang";
import { studioLang } from "@/lib/studio-locale.server";
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

export async function generateMetadata(): Promise<Metadata> {
  const lang = await studioLang();
  const name = lang === "en" ? "Studio" : "Estudio";
  return {
    title: `${name} · Oracle of Freedom`,
    applicationName: name,
    manifest: "/admin/manifest.webmanifest",
    robots: { index: false, follow: false },
    appleWebApp: {
      capable: true,
      title: name,
      statusBarStyle: "default",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#f4ece1",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const lang = await studioLang();
  return (
    <html lang={lang} className={`${serif.variable} ${sans.variable}`}>
      <body className="studio-app min-h-screen bg-sand font-sans text-ink antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){if(window.__oofInstallBound)return;window.__oofInstallBound=true;window.addEventListener("beforeinstallprompt",function(event){event.preventDefault();window.__oofInstall=event;window.dispatchEvent(new Event("oof-install"));});if("serviceWorker"in navigator){navigator.serviceWorker.register("/studio-sw.js").catch(function(){});}})();`,
          }}
        />
        <StudioLangProvider lang={lang}>
          {children}
          <InstallAppButton />
        </StudioLangProvider>
      </body>
    </html>
  );
}
