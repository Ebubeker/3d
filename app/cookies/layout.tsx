import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://virtuality.fashion";

export const metadata: Metadata = {
  title: "Cookie Policy | Virtuality Fashion",
  description:
    "Which cookies Virtuality Fashion uses, what they're used for, and how you can manage or disable them in your browser.",
  alternates: {
    canonical: `${SITE_URL}/cookies`,
  },
  openGraph: {
    title: "Cookie Policy | Virtuality Fashion",
    description:
      "Which cookies Virtuality Fashion uses and how you can manage them.",
    url: `${SITE_URL}/cookies`,
  },
};

export default function CookiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
