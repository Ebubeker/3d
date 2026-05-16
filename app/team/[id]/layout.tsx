import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://virtuality.fashion";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const supabase = await createClient();
    const { data: member } = await supabase
      .from("team_members")
      .select("name, role, bio, location, portrait, specialties")
      .eq("id", id)
      .single();

    if (!member) {
      return {
        title: "Team Member | virtuality.fashion",
        robots: { index: false, follow: true },
      };
    }

    const title = `${member.name} | ${member.role} | virtuality.fashion`;
    // Trim the bio to ~155 chars so it fits Google's snippet limit without
    // being truncated mid-word in the SERP.
    const rawDescription =
      member.bio ||
      `${member.role} based in ${member.location || "our global network"}, specialising in ${(member.specialties || []).slice(0, 3).join(", ") || "fashion technical design"}.`;
    const description =
      rawDescription.length > 155
        ? `${rawDescription.slice(0, 152).trim()}...`
        : rawDescription;

    const url = `${SITE_URL}/team/${id}`;
    const image = member.portrait || `${SITE_URL}/images/og-image.jpg`;

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
  } catch {
    return {
      title: "Team Member | virtuality.fashion",
    };
  }
}

export default function TeamMemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
