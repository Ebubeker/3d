import type { Metadata } from "next";
import { OG_IMAGES } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/site";

// Placeholder page: the form only console.logs and the copy carries
// unverified brand claims. Kept out of the index until it is real; the
// live application path is /join-team.
export const metadata: Metadata = {
  title: "Apply to Join Our Network",
  description:
    "Are you a 3D fashion designer, patternmaker, or technical developer? Apply to join our vetted network and work with leading fashion brands on virtual sampling and tech pack projects.",
  robots: { index: false, follow: false },
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
