import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://virtuality.fashion";

export const metadata: Metadata = {
  title: "Project Inquiry | Get a Custom Quote | Virtuality Fashion",
  description:
    "Tell us about your fashion project and we'll put together a tailored quote for virtual sampling, tech pack creation, or 3D garment development. Response within 24 hours.",
  alternates: {
    canonical: `${SITE_URL}/inquiry`,
  },
  openGraph: {
    title: "Project Inquiry | Get a Custom Quote | Virtuality Fashion",
    description:
      "Get a tailored quote for virtual sampling, tech pack creation, or 3D garment development.",
    url: `${SITE_URL}/inquiry`,
  },
};

export default function InquiryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
