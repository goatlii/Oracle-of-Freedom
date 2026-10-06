import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async rewrites() {
    return {
      afterFiles: [
        {
          // A root filename such as /cover-wide.jpg is not a file in public/.
          // Public files are checked before this rewrite; dynamic routes such
          // as app/[locale] are checked after it. Without the rewrite, the
          // filename matches [locale], the proxy skips it (it contains a dot),
          // and next-intl reads request headers on a static page, which 500s.
          // The photographs live in public/images/portfolio/.
          source: "/:file.:ext(jpg|jpeg|png|webp|avif|gif)",
          destination: "/images/portfolio/:file.:ext",
        },
      ],
    };
  },
};

export default withNextIntl(nextConfig);
