import type { Metadata } from "next";

// Utility page reached only from emailed unsubscribe links. No SEO
// value and shouldn't appear in search results.
export const metadata: Metadata = {
  title: "Unsubscribe | virtuality.fashion",
  robots: { index: false, follow: false },
};

export default function UnsubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
