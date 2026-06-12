import type { Metadata } from "next";
import { OG_IMAGES } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Which cookies virtuality.fashion uses, what they're used for, and how you can manage or disable them in your browser.",
  alternates: {
    canonical: `${SITE_URL}/cookies`,
  },
  openGraph: {
    title: "Cookie Policy | virtuality.fashion",
    description:
      "Which cookies virtuality.fashion uses and how you can manage them.",
    url: `${SITE_URL}/cookies`,
    images: OG_IMAGES,
  },
};

export default function CookiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
