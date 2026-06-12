import type { Metadata } from "next";
import { OG_IMAGES } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms and conditions that govern your use of virtuality.fashion's website and services. Please read carefully before submitting a project or joining our team.",
  alternates: {
    canonical: `${SITE_URL}/terms`,
  },
  openGraph: {
    title: "Terms of Service | virtuality.fashion",
    description:
      "The terms and conditions that govern your use of virtuality.fashion's website and services.",
    url: `${SITE_URL}/terms`,
    images: OG_IMAGES,
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
