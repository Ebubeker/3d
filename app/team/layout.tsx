import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Team | Vetted 3D & Technical Design Experts",
  description: "Browse Virtuality Fashion's curated team of vetted 3D designers and technical developers. Find CLO3D experts, Browzwear specialists, and tech pack professionals ready to help your brand reduce samples and accelerate development.",
  keywords: [
    "3D design team",
    "CLO3D experts",
    "Browzwear specialists",
    "technical design team",
    "digital fashion professionals",
    "vetted 3D designers",
    "fashion development experts",
    "tech pack professionals"
  ],
  openGraph: {
    title: "Our Team | Vetted 3D & Technical Design Experts",
    description: "Browse Virtuality Fashion's curated team of vetted 3D designers and technical developers.",
    url: "https://virtuality.fashion/team",
  },
  alternates: {
    canonical: "https://virtuality.fashion/team"
  }
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
