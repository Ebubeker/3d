import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works | Virtual Sampling & Digital Fashion Services",
  description: "Learn how Virtuality Fashion connects brands with expert 3D designers. From virtual sampling to tech pack creation, our vetted professionals deliver production-ready digital assets using CLO3D, Browzwear, and industry-standard tools.",
  keywords: [
    "virtual sampling process",
    "digital fashion workflow",
    "3D garment development",
    "CLO3D services",
    "Browzwear services",
    "tech pack creation process",
    "fashion design outsourcing",
    "reduce sampling costs",
    "faster product development",
    "digital fashion production"
  ],
  openGraph: {
    title: "How It Works | Virtual Sampling & Digital Fashion Services",
    description: "Learn how virtuality.fashion connects brands with expert 3D designers for virtual sampling and tech pack services.",
    url: "https://virtuality.fashion/solutions",
  },
  alternates: {
    canonical: "https://virtuality.fashion/solutions"
  }
};

export default function SolutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
