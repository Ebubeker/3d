import { Node, mergeAttributes } from '@tiptap/core';

export interface YoutubeEmbedOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    youtubeEmbed: {
      /** Insert a responsive YouTube embed from any YouTube/Shorts/youtu.be URL. */
      setYoutubeEmbed: (options: { src: string }) => ReturnType;
    };
  }
}

/**
 * Normalize any YouTube URL (watch, youtu.be, Shorts, or an already-embed
 * URL) into a canonical privacy-friendly embed URL. Returns null if the
 * input isn't a recognizable YouTube link, so callers can reject it.
 */
export function toYoutubeEmbedUrl(input: string): string | null {
  if (!input) return null;
  const url = input.trim();
  const id = (re: RegExp) => {
    const m = url.match(re);
    return m ? m[1] : null;
  };
  const videoId =
    id(/(?:youtube\.com|youtube-nocookie\.com)\/embed\/([A-Za-z0-9_-]{6,})/) ||
    id(/youtu\.be\/([A-Za-z0-9_-]{6,})/) ||
    id(/youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/) ||
    id(/youtube\.com\/live\/([A-Za-z0-9_-]{6,})/) ||
    id(/[?&]v=([A-Za-z0-9_-]{6,})/);
  if (!videoId) return null;
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

/**
 * Inline YouTube video node.
 *
 * Renders as <div class="youtube-embed"><iframe …></iframe></div>. The wrapper
 * carries the responsive 16:9 sizing (see globals.css). Kept as a custom node
 * (instead of @tiptap/extension-youtube) so we own the URL parsing — notably
 * Shorts URLs — and emit markup the public sanitizer already trusts.
 */
export const YoutubeEmbed = Node.create<YoutubeEmbedOptions>({
  name: 'youtubeEmbed',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addOptions() {
    return { HTMLAttributes: {} };
  },

  addAttributes() {
    return {
      src: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'iframe',
        getAttrs: (el) => {
          const src = (el as HTMLElement).getAttribute('src') || '';
          return /youtube(-nocookie)?\.com\/embed\//.test(src)
            ? { src }
            : false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const src = (HTMLAttributes.src as string) || '';
    return [
      'div',
      { 'data-youtube-embed': '', class: 'youtube-embed' },
      [
        'iframe',
        mergeAttributes(this.options.HTMLAttributes, {
          src,
          frameborder: '0',
          allow:
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
          allowfullscreen: 'true',
          title: 'YouTube video',
        }),
      ],
    ];
  },

  addCommands() {
    return {
      setYoutubeEmbed:
        (options) =>
        ({ commands }) => {
          const src = toYoutubeEmbedUrl(options.src);
          if (!src) return false;
          return commands.insertContent({
            type: this.name,
            attrs: { src },
          });
        },
    };
  },
});

export default YoutubeEmbed;
