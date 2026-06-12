import type { Metadata } from "next";
import { OG_IMAGES } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  // `absolute` bypasses the root layout's "%s | virtuality.fashion" title
  // template so the title renders exactly as specified, with no brand
  // suffix appended.
  title: {
    absolute: "Join Our Team | Work With Leading Fashion Brands",
  },
  description:
    "Join virtuality.fashion's curated network of 3D designers, technical designers, and pattern makers. Remote work, quality projects, leading brands.",
  alternates: {
    canonical: `${SITE_URL}/join-team`,
  },
  openGraph: {
    title: "Join Our Team | Work With Leading Fashion Brands",
    description:
      "Join virtuality.fashion's curated network of 3D designers, technical designers, and pattern makers. Remote work, quality projects, leading brands.",
    url: `${SITE_URL}/join-team`,
    images: OG_IMAGES,
  },
  // Without an explicit twitter block this page would inherit the root
  // layout's homepage twitter:title/description.
  twitter: {
    card: "summary_large_image",
    title: "Join Our Team | Work With Leading Fashion Brands",
    description:
      "Join virtuality.fashion's curated network of 3D designers, technical designers, and pattern makers. Remote work, quality projects, leading brands.",
    images: [OG_IMAGES[0].url],
  },
};

export default function JoinTeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
