import type { Metadata } from "next";
import { OG_IMAGES } from "@/lib/seo/schema";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://virtuality.fashion";

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
};

export default function JoinTeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
