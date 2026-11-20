import type { MetadataRoute } from "next";
import { canonicalOrigin } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/cutpilot", "/about", "/faq", "/safety-usage", "/returns", "/privacy", "/terms"].map(
    (path) => ({ url: new URL(path, canonicalOrigin).href }),
  );
}
