import type { Metadata } from "next";
import { OG_IMAGES } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Employees",
  description:
    "Meet the in-house specialists behind virtuality.fashion. Vetted 3D designers, technical developers, and patternmakers delivering virtual sampling and tech pack services for leading fashion brands.",
  alternates: {
    canonical: `${SITE_URL}/employees`,
  },
  openGraph: {
    title: "Our Employees | virtuality.fashion",
    description:
      "Meet the in-house specialists behind virtuality.fashion: 3D designers, technical developers, and patternmakers.",
    url: `${SITE_URL}/employees`,
    images: OG_IMAGES,
  },
};

export default function EmployeesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
