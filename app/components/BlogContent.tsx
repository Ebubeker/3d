import DOMPurify from 'isomorphic-dompurify';

interface BlogContentProps {
  html: string;
}

/**
 * Renders sanitized blog post HTML produced by TipTap.
 * Sanitizes on the server to prevent XSS from malicious content.
 */
export default function BlogContent({ html }: BlogContentProps) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'strong', 'em', 'u', 's', 'code', 'pre',
      'blockquote',
      'ul', 'ol', 'li',
      'a', 'img',
      'span', 'div',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel'],
  });

  return (
    <div
      className="prose prose-neutral prose-lg max-w-none
        prose-headings:font-bold prose-headings:text-gray-900
        prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
        prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:text-gray-700 prose-p:leading-relaxed
        prose-a:text-black prose-a:underline prose-a:underline-offset-2
        prose-img:rounded-xl prose-img:shadow-md
        prose-blockquote:border-l-4 prose-blockquote:border-black
        prose-blockquote:text-gray-700 prose-blockquote:italic
        prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
        prose-pre:bg-gray-900 prose-pre:text-gray-100"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
