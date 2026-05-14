import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://virtuality.fashion";

export const metadata: Metadata = {
  title: "Privacy Policy | Virtuality Fashion",
  description:
    "How Virtuality Fashion collects, uses, and protects your personal information. Read our privacy policy for full details on data handling, retention, and your rights.",
  alternates: {
    canonical: `${SITE_URL}/privacy`,
  },
  openGraph: {
    title: "Privacy Policy | Virtuality Fashion",
    description:
      "How Virtuality Fashion collects, uses, and protects your personal information.",
    url: `${SITE_URL}/privacy`,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
