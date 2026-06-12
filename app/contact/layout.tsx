import type { Metadata } from "next";
import { OG_IMAGES } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us | Get a Quote for Virtual Sampling & Tech Pack Services",
  description: "Ready to reduce physical samples and accelerate your fashion development? Contact virtuality.fashion for virtual sampling, tech pack creation, and 3D design services. Get a response within 24 hours.",
  keywords: [
    "contact virtuality.fashion",
    "virtual sampling quote",
    "tech pack services quote",
    "3D fashion design inquiry",
    "CLO3D project quote",
    "Browzwear services contact",
    "fashion development quote",
    "digital sampling services",
    "hire fashion designer",
    "fashion project consultation"
  ],
  openGraph: {
    title: "Contact Us | Get a Quote for Virtual Sampling & Tech Pack Services",
    description: "Contact virtuality.fashion for virtual sampling, tech pack creation, and 3D design services.",
    url: `${SITE_URL}/contact`,
    images: OG_IMAGES,
  },
  alternates: {
    canonical: `${SITE_URL}/contact`
  }
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
