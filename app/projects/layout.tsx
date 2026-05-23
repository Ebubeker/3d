import type { Metadata } from "next";
import { OG_IMAGES } from "@/lib/seo/schema";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://virtuality.fashion";

export const metadata: Metadata = {
  title: "Projects & Case Studies",
  description:
    "Explore virtuality.fashion case studies: 3D virtual sampling, tech pack creation, and digital fashion development projects delivered for global brands.",
  keywords: [
    "fashion case studies",
    "3D sampling case studies",
    "virtual fashion projects",
    "tech pack examples",
    "CLO3D project examples",
    "digital fashion portfolio",
  ],
  alternates: {
    canonical: `${SITE_URL}/projects`,
  },
  openGraph: {
    title: "Projects & Case Studies | virtuality.fashion",
    description:
      "Case studies of virtual sampling, tech pack creation, and 3D fashion development delivered for global brands.",
    url: `${SITE_URL}/projects`,
    images: OG_IMAGES,
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
