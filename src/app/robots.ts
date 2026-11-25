import type { MetadataRoute } from "next";
import { canonicalOrigin } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/webhooks/" },
    sitemap: new URL("/sitemap.xml", canonicalOrigin).href,
  };
}
