import type { Metadata } from "next";

// Nested expert-project pages duplicate content that already lives on
// /experts/[id] and aren't in the sitemap. Noindex until the route is
// repurposed or its content is unique.
export const metadata: Metadata = {
  title: "Expert Project | virtuality.fashion",
  robots: { index: false, follow: true },
};

export default function ExpertProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
