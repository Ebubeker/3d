import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Get a Quote for Virtual Sampling & Tech Pack Services",
  description: "Ready to reduce physical samples and accelerate your fashion development? Contact Virtuality Fashion for virtual sampling, tech pack creation, and 3D design services. Get a response within 24 hours.",
  keywords: [
    "contact Virtuality Fashion",
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
    description: "Contact Virtuality Fashion for virtual sampling, tech pack creation, and 3D design services.",
    url: "https://virtuality.fashion/contact",
  },
  alternates: {
    canonical: "https://virtuality.fashion/contact"
  }
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
