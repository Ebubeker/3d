'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { LinkableImage } from './LinkableImage';
import { YoutubeEmbed } from './YoutubeEmbed';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useRef, useState } from 'react';
import { uploadMedia } from '@/lib/supabase/storage';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Youtube as YoutubeIcon,
  Undo,
  Redo,
  Code,
} from 'lucide-react';

interface TipTapEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function TipTapEditor({
  value,
  onChange,
  placeholder = 'Start writing your post...',
}: TipTapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        // StarterKit 3.x bundles its own Link extension. We register a
        // custom-configured Link below, so disable the bundled one to avoid
        // a duplicate-extension conflict that breaks link behavior.
        link: false,
      }),
      LinkableImage.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-4',
        },
      }),
      YoutubeEmbed,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-black underline underline-offset-2 hover:text-gray-700',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-neutral max-w-none min-h-[400px] px-4 py-3 focus:outline-none',
      },
    },
  });

  if (!editor) {
    return (
      <div className="border-2 border-gray-200 rounded-lg min-h-[500px] bg-gray-50" />
    );
  }

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadMedia(file, 'blog');
      if (result?.url) {
        editor.chain().focus().setImage({ src: result.url }).run();
      } else {
        alert('Image upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Image upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const setLink = () => {
    // If an image is selected, attach the link to the image itself. TipTap's
    // text Link mark can't apply to an image node, so this is what makes a
    // cover/inline image clickable.
    if (editor.isActive('image')) {
      const previous = editor.getAttributes('image').href as string | undefined;
      const url = window.prompt(
        'Link this image to (URL) — leave empty to remove the link',
        previous || 'https://'
      );
      if (url === null) return;
      const href = url.trim() ? normalizeUrl(url) : null;
      editor.chain().focus().updateAttributes('image', { href }).run();
      return;
    }

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl || 'https://');
    if (url === null) return;
    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: normalizeUrl(url) })
      .run();
  };

  const addYoutube = () => {
    const url = window.prompt(
      'Paste a YouTube link (normal video or Shorts) to embed it'
    );
    if (!url || !url.trim()) return;
    const inserted = editor
      .chain()
      .focus()
      .setYoutubeEmbed({ src: url.trim() })
      .run();
    if (!inserted) {
      alert(
        "That doesn't look like a YouTube link. Use a youtube.com, youtu.be, or youtube.com/shorts URL."
      );
    }
  };

  return (
    <div className="border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-black transition-colors">
      <Toolbar
        editor={editor}
        onImageClick={() => fileInputRef.current?.click()}
        onLinkClick={setLink}
        onYoutubeClick={addYoutube}
        isUploading={isUploading}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <EditorContent editor={editor} />
    </div>
  );
}

/**
 * Ensure a user-entered URL has a scheme. Bare domains typed into the link
 * prompt (e.g. "virtuality.fashion") otherwise get saved verbatim and become
 * broken/relative links — this prefixes https:// while leaving full URLs,
 * mailto:, anchors, and root-relative paths untouched.
 */
function normalizeUrl(input: string): string {
  const url = input.trim();
  if (/^(https?:\/\/|mailto:|\/|#)/i.test(url)) return url;
  return `https://${url}`;
}

interface ToolbarProps {
  editor: Editor;
  onImageClick: () => void;
  onLinkClick: () => void;
  onYoutubeClick: () => void;
  isUploading: boolean;
}

function Toolbar({
  editor,
  onImageClick,
  onLinkClick,
  onYoutubeClick,
  isUploading,
}: ToolbarProps) {
  const btn = (active: boolean) =>
    `p-2 rounded-md transition-colors ${
      active
        ? 'bg-black text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <div className="flex flex-wrap items-center gap-1 px-2 py-2 border-b border-gray-200 bg-gray-50">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btn(editor.isActive('bold'))}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btn(editor.isActive('italic'))}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-gray-200 mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btn(editor.isActive('heading', { level: 2 }))}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={btn(editor.isActive('heading', { level: 3 }))}
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-gray-200 mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btn(editor.isActive('bulletList'))}
        title="Bullet list"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btn(editor.isActive('orderedList'))}
        title="Numbered list"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btn(editor.isActive('blockquote'))}
        title="Quote"
      >
        <Quote className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={btn(editor.isActive('codeBlock'))}
        title="Code block"
      >
        <Code className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-gray-200 mx-1" />
      <button
        type="button"
        onClick={onLinkClick}
        className={btn(
          editor.isActive('link') || !!editor.getAttributes('image').href
        )}
        title={
          editor.isActive('image')
            ? 'Link this image'
            : 'Link (select text or an image first)'
        }
      >
        <LinkIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={onImageClick}
        disabled={isUploading}
        className={`${btn(false)} ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
        title="Insert image"
      >
        <ImageIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={onYoutubeClick}
        className={btn(editor.isActive('youtubeEmbed'))}
        title="Embed a YouTube video"
      >
        <YoutubeIcon className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-gray-200 mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className={`${btn(false)} disabled:opacity-30`}
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className={`${btn(false)} disabled:opacity-30`}
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </button>
      {isUploading && (
        <span className="text-xs text-gray-500 ml-2">Uploading image...</span>
      )}
    </div>
  );
}
