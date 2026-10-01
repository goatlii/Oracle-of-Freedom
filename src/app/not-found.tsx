import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#F4ECE1", color: "#2A211C", fontFamily: "Georgia, serif" }}>
        <main style={{ maxWidth: 640, margin: "0 auto", padding: "6rem 1.5rem" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: 400 }}>This page isn’t here</h1>
          <p style={{ fontFamily: "Karla, sans-serif", fontSize: "1.125rem" }}>
            The path wandered off. <Link href="/">Return home</Link>.
          </p>
        </main>
      </body>
    </html>
  );
}
