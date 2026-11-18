import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/emisora";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: undefined,
    host: SITE_URL,
  };
}
