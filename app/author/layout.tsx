import type { Metadata } from "next";

// Internal team-member portal. Login form lives at /author and all
// authenticated screens live under /author/(protected). None of this
// belongs in Google's index, but the URLs are publicly reachable
// (unlike /admin which is also blocked via robots.txt), so a noindex
// directive here is the belt-and-braces protection.
export const metadata: Metadata = {
  title: "Author Portal | Virtuality Fashion",
  robots: { index: false, follow: false },
};

export default function AuthorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
