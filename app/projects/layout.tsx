import type { Metadata } from "next";
import { OG_IMAGES } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/site";

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
  // Demo page with placeholder content, kept out of the index until it is
  // backed by real project records. No canonical (contradictory on noindex).
  robots: { index: false, follow: false },
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
