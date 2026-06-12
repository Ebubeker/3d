import type { Metadata } from "next";
import { solutionsGraph, OG_IMAGES } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "How It Works | Virtual Sampling & Digital Fashion Services",
  description: "Learn how virtuality.fashion connects brands with expert 3D designers. From virtual sampling to tech pack creation, our vetted professionals deliver production-ready digital assets using CLO3D, Browzwear, and industry-standard tools.",
  keywords: [
    "virtual sampling process",
    "digital fashion workflow",
    "3D garment development",
    "CLO3D services",
    "Browzwear services",
    "tech pack creation process",
    "fashion design outsourcing",
    "reduce sampling costs",
    "faster product development",
    "digital fashion production"
  ],
  openGraph: {
    title: "How It Works | Virtual Sampling & Digital Fashion Services",
    description: "Learn how virtuality.fashion connects brands with expert 3D designers for virtual sampling and tech pack services.",
    url: `${SITE_URL}/solutions`,
    images: OG_IMAGES,
  },
  // Without an explicit twitter block this page would inherit the root
  // layout's homepage twitter:title/description.
  twitter: {
    card: "summary_large_image",
    title: "How It Works | Virtual Sampling & Digital Fashion Services | virtuality.fashion",
    description: "Learn how virtuality.fashion connects brands with expert 3D designers. From virtual sampling to tech pack creation, our vetted professionals deliver production-ready digital assets.",
    images: [OG_IMAGES[0].url],
  },
  alternates: {
    canonical: `${SITE_URL}/solutions`
  }
};

export default function SolutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(solutionsGraph()) }}
      />
      {children}
    </>
  );
}
