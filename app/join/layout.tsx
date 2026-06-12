import type { Metadata } from "next";
import { OG_IMAGES } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Apply to Join Our Network",
  description:
    "Are you a 3D fashion designer, patternmaker, or technical developer? Apply to join our vetted network and work with leading fashion brands on virtual sampling and tech pack projects.",
  alternates: {
    canonical: `${SITE_URL}/join`,
  },
  openGraph: {
    title: "Apply to Join | Freelance with virtuality.fashion",
    description:
      "Apply to our vetted network of 3D fashion designers, patternmakers, and technical developers.",
    url: `${SITE_URL}/join`,
    images: OG_IMAGES,
  },
};

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
