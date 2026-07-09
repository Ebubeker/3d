import Image from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/core';

/**
 * Image node that can carry an optional link.
 *
 * TipTap's default Link is a *mark* and only applies to inline text, so
 * selecting an image and clicking "link" does nothing — which is exactly
 * the bug authors hit when they try to make a cover/inline image clickable.
 *
 * This extension adds an `href` attribute to the image node itself. When set,
 * the image renders wrapped in an anchor: <a href><img …></a>. The href is
 * also mirrored onto the <img> as data-href so it round-trips when an existing
 * post is re-opened for editing (the public sanitizer keeps the <a> wrapper
 * and strips data-href, which is fine — the link still works).
 */
export const LinkableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      href: {
        default: null,
        // Read the link back from the wrapping anchor or the data-href mirror.
        parseHTML: (element: HTMLElement) =>
          element.getAttribute('data-href') ||
          element.closest('a')?.getAttribute('href') ||
          null,
        // Rendered by hand in renderHTML below (as an <a> wrapper + data-href),
        // so it must not also be emitted as a bare href="" on the <img>.
        renderHTML: () => ({}),
      },
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    const href = node.attrs.href as string | null;
    const imgAttrs = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes);

    if (href) {
      imgAttrs['data-href'] = href;
      return [
        'a',
        { href, target: '_blank', rel: 'noopener noreferrer' },
        ['img', imgAttrs],
      ];
    }

    return ['img', imgAttrs];
  },
});

export default LinkableImage;
