import type { Metadata } from "next";

// Deep team-member project pages mirror content shown via the modal on
// /team/[id]?project=... and aren't in the sitemap. Keeping them
// noindex avoids duplicate-content signals.
export const metadata: Metadata = {
  title: "Team Project",
  robots: { index: false, follow: true },
};

export default function TeamProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
