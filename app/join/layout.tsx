import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://virtuality.fashion";

export const metadata: Metadata = {
  title: "Apply to Join | Freelance with virtuality.fashion",
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
  },
};

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
