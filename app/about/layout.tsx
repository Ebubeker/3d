import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Digital Fashion Pioneers Since 2015",
  description: "Virtuality Fashion was founded in 2015 by fashion tech veterans. We pioneered 3D as a Service (3DaaS), helping brands adopt virtual sampling without building in-house operations. Thousands of digitized garments, hundreds of global projects.",
  keywords: [
    "about Virtuality Fashion",
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
    title: "About Us | Digital Fashion Pioneers Since 2015",
    description: "Virtuality Fashion was founded in 2015 by fashion tech veterans. Pioneers in 3D as a Service (3DaaS).",
    url: "https://virtuality.fashion/about",
  },
  alternates: {
    canonical: "https://virtuality.fashion/about"
  }
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
