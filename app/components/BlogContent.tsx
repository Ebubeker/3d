import sanitizeHtml from 'sanitize-html';

interface BlogContentProps {
  html: string;
}

/**
 * Renders sanitized blog post HTML produced by TipTap.
 * Sanitizes on the server with sanitize-html (no jsdom dependency,
 * unlike isomorphic-dompurify which fails on Vercel's serverless runtime).
 */
export default function BlogContent({ html }: BlogContentProps) {
  const clean = sanitizeHtml(html, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'strong', 'em', 'u', 's', 'code', 'pre',
      'blockquote',
      'ul', 'ol', 'li',
      'a', 'img',
      'span', 'div',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel', 'class'],
      img: ['src', 'alt', 'title', 'class'],
      '*': ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {
      img: ['http', 'https', 'data'],
    },
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          rel: 'noopener noreferrer',
          target: attribs.target || '_blank',
        },
      }),
    },
  });

  return (
    <div
      className="blog-content prose prose-neutral prose-lg max-w-none
        prose-headings:font-bold prose-headings:text-gray-900
        prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
        prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:text-gray-700 prose-p:leading-relaxed
        prose-a:text-black prose-a:underline prose-a:underline-offset-2
        prose-img:rounded-xl prose-img:shadow-md
        prose-blockquote:text-gray-700 prose-blockquote:italic
        prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
        prose-pre:bg-gray-900 prose-pre:text-gray-100"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
