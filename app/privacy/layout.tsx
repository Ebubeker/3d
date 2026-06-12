import type { Metadata } from "next";
import { OG_IMAGES } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How virtuality.fashion collects, uses, and protects your personal information. Read our privacy policy for full details on data handling, retention, and your rights.",
  alternates: {
    canonical: `${SITE_URL}/privacy`,
  },
  openGraph: {
    title: "Privacy Policy | virtuality.fashion",
    description:
      "How virtuality.fashion collects, uses, and protects your personal information.",
    url: `${SITE_URL}/privacy`,
    images: OG_IMAGES,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
