import type { Metadata } from "next";

// Individual project detail pages currently use placeholder data and
// aren't included in the sitemap. Marking noindex so Google doesn't
// surface them until they're powered by real project records.
export const metadata: Metadata = {
  title: "Project Details | virtuality.fashion",
  robots: { index: false, follow: true },
};

export default function ProjectDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
