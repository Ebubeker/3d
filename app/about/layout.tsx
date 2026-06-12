import type { Metadata } from "next";
import { OG_IMAGES } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us | Digital Fashion Pioneers Since 2016",
  description: "virtuality.fashion was founded in 2016 by fashion tech veterans. We pioneered 3D as a Service (3DaaS), helping brands adopt virtual sampling without building in-house operations. Thousands of digitized garments, hundreds of global projects.",
  keywords: [
    "about virtuality.fashion",
    "3D fashion company",
    "digital fashion pioneers",
    "3DaaS provider",
    "virtual sampling company",
    "fashion tech veterans",
    "CLO3D service provider",
    "fashion development history",
    "sustainable fashion technology",
    "digital garment experts"
  ],
  openGraph: {
    title: "About Us | Digital Fashion Pioneers Since 2016",
    description: "virtuality.fashion was founded in 2016 by fashion tech veterans. Pioneers in 3D as a Service (3DaaS).",
    url: `${SITE_URL}/about`,
    images: OG_IMAGES,
  },
  alternates: {
    canonical: `${SITE_URL}/about`
  }
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
