import type { Metadata } from "next";
import { OG_IMAGES } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Fashion Experts | 3D Designers, Patternmakers & Tech Pack Specialists",
  description:
    "Browse our network of vetted fashion experts: 3D garment designers, patternmakers, technical developers, and CLO3D / Browzwear specialists ready to support your next collection.",
  keywords: [
    "fashion experts",
    "3D garment designers",
    "patternmakers",
    "technical developers",
    "CLO3D specialists",
    "Browzwear specialists",
    "freelance fashion designers",
  ],
  alternates: {
    canonical: `${SITE_URL}/experts`,
  },
  openGraph: {
    title: "Fashion Experts | 3D Designers, Patternmakers & Tech Pack Specialists",
    description:
      "Vetted 3D designers, patternmakers, and technical developers for fashion brands.",
    url: `${SITE_URL}/experts`,
    images: OG_IMAGES,
  },
};

export default function ExpertsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
