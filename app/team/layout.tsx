import type { Metadata } from "next";
import { OG_IMAGES } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Team | Vetted 3D & Technical Design Experts",
  description: "Browse virtuality.fashion's curated team of vetted 3D designers and technical developers. Find CLO3D experts, Browzwear specialists, and tech pack professionals ready to help your brand reduce samples and accelerate development.",
  keywords: [
    "3D design team",
    "CLO3D experts",
    "Browzwear specialists",
    "technical design team",
    "digital fashion professionals",
    "vetted 3D designers",
    "fashion development experts",
    "tech pack professionals"
  ],
  openGraph: {
    title: "Our Team | Vetted 3D & Technical Design Experts",
    description: "Browse virtuality.fashion's curated team of vetted 3D designers and technical developers.",
    url: `${SITE_URL}/team`,
    images: OG_IMAGES,
  },
  // Without an explicit twitter block this page would inherit the root
  // layout's homepage twitter:title/description.
  twitter: {
    card: "summary_large_image",
    title: "Our Team | Vetted 3D & Technical Design Experts | virtuality.fashion",
    description: "Browse virtuality.fashion's curated team of vetted 3D designers and technical developers.",
    images: [OG_IMAGES[0].url],
  },
  alternates: {
    canonical: `${SITE_URL}/team`
  }
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
