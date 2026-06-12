import type { Metadata } from "next";
import experts from "@/data/experts.json";
import { SITE_URL } from "@/lib/site";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const expert = experts.find((e) => e.id === id);

  if (!expert) {
    return {
      title: "Expert",
      robots: { index: false, follow: true },
    };
  }

  const title = `${expert.name} | ${expert.title}`;
  const rawDescription = expert.bio || "";
  const description =
    rawDescription.length > 155
      ? `${rawDescription.slice(0, 152).trim()}...`
      : rawDescription;

  const url = `${SITE_URL}/experts/${id}`;
  const image = expert.photo
    ? `${SITE_URL}${expert.photo}`
    : `${SITE_URL}/opengraph-image`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: image }],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default function ExpertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
