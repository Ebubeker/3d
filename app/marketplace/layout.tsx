import type { Metadata } from "next";
import { OG_IMAGES } from "@/lib/seo/schema";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://virtuality.fashion";

export const metadata: Metadata = {
  title: "Marketplace | Hire Vetted 3D Fashion Designers & Tech Pack Pros",
  description:
    "Hire vetted 3D fashion designers, patternmakers, and tech pack specialists on demand. Browse the virtuality.fashion marketplace and connect directly with the right expert for your project.",
  keywords: [
    "hire 3D fashion designer",
    "freelance patternmaker",
    "tech pack freelancer",
    "fashion design marketplace",
    "CLO3D freelancer",
    "Browzwear freelancer",
  ],
  alternates: {
    canonical: `${SITE_URL}/marketplace`,
  },
  openGraph: {
    title: "Marketplace | Hire Vetted 3D Fashion Designers & Tech Pack Pros",
    description:
      "Hire vetted 3D fashion designers, patternmakers, and tech pack specialists on demand.",
    url: `${SITE_URL}/marketplace`,
    images: OG_IMAGES,
  },
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
