import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") || "Oracle of Freedom").slice(0, 140);
  const locale = searchParams.get("locale") === "es" || searchParams.get("locale") === "pt" ? searchParams.get("locale") : "en";
  const eyebrow = locale === "es" ? "Fotografía y cine" : locale === "pt" ? "Fotografia e filme" : "Photo & film";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#1B1512",
          color: "#F4ECE1",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, textTransform: "uppercase", color: "#D9913A" }}>
          {eyebrow}
        </div>
        <div style={{ display: "flex", marginTop: 24, fontSize: title.length > 60 ? 54 : 68, lineHeight: 1.05, maxWidth: 980 }}>
          {title}
        </div>
        <div style={{ display: "flex", marginTop: 36, fontSize: 28, color: "#E7D6C3" }}>Algarve to Lisbon · Portugal</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
