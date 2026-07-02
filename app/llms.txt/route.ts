import { createClient } from '@/lib/supabase/server';
import { SITE_URL } from '@/lib/site';

// llms.txt: structured site guide for AI crawlers and assistants
// (https://llmstxt.org). Served dynamically so newly published blog
// posts appear without a redeploy, mirroring app/sitemap.ts. Every
// fact below comes from existing site copy; nothing here may claim
// anything the site itself does not.
export const dynamic = 'force-dynamic';

interface PostRow {
  slug: string;
  title: string;
  published_at: string | null;
}

async function getPublishedPosts(): Promise<PostRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, title, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    if (error) {
      console.error('llms.txt: failed to fetch blog posts', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('llms.txt: blog post query threw', err);
    return [];
  }
}

export async function GET() {
  const posts = await getPublishedPosts();

  const blogSection = posts.length
    ? `\n## Blog\n${posts
        .map((p) => {
          const date = p.published_at ? ` (${p.published_at.slice(0, 10)})` : '';
          return `- [${p.title}](${SITE_URL}/blog/${p.slug})${date}`;
        })
        .join('\n')}\n`
    : '';

  const body = `# virtuality.fashion

> virtuality.fashion is a fashion-tech services company (founded 2016, based in Israel, serving clients worldwide) that provides virtual sampling, 3D garment prototyping, production-ready tech packs, and e-commerce product visuals for fashion brands, design studios, and manufacturers. Work is delivered by a vetted network of 3D and technical fashion designers working in CLO3D, Browzwear VStitcher, Optitex, Style3D, and Marvelous Designer. Virtual sampling reduces physical samples by up to 70% and cuts development time roughly in half.

## Main pages
- [Solutions](${SITE_URL}/solutions): Services offered: virtual sampling, tech pack creation, 3D fashion design, and technical design.
- [Get a quote](${SITE_URL}/contact): Request a quote for a project. Responses typically within 24 hours on business days. Project information is kept confidential under NDA.
- [Team](${SITE_URL}/team): The vetted network of fashion technical designers and 3D specialists.
- [About](${SITE_URL}/about): Company background and mission.
- [Blog](${SITE_URL}/blog): Articles on 3D fashion design, virtual sampling, and digital product development.
- [Join the team](${SITE_URL}/join-team): Application page for fashion specialists (3D designers, technical designers, patternmakers) who want to join the network.
${blogSection}
## Key facts
- Founded: 2016
- Location: Israel; clients worldwide
- Contact: info@virtuality.fashion
- Tools used by the network: CLO3D, Browzwear VStitcher, Optitex, Style3D, Marvelous Designer, Adobe Illustrator
- Services: virtual sampling, 3D garment simulation, production-ready tech packs, technical design, e-commerce product visuals
- Buyers: fashion brands, design studios needing overflow capacity, manufacturers wanting clearer specifications
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
