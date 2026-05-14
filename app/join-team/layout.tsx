import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://virtuality.fashion";

export const metadata: Metadata = {
  title: "Join the Team | Virtuality Fashion",
  description:
    "Become part of Virtuality Fashion's global team of 3D designers, patternmakers, and technical developers. Submit a short application and book an interview to start working with leading fashion brands.",
  alternates: {
    canonical: `${SITE_URL}/join-team`,
  },
  openGraph: {
    title: "Join the Team | Virtuality Fashion",
    description:
      "Become part of Virtuality Fashion's global team of 3D designers, patternmakers, and technical developers.",
    url: `${SITE_URL}/join-team`,
  },
};

export default function JoinTeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
