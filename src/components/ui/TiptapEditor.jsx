import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';

export default function TiptapEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
        }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[120px] p-4 text-slate-700 bg-white border border-slate-200 rounded-b-xl',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-md text-sm font-bold transition-colors ${
            editor.isActive('bold') ? 'bg-pink-100 text-pink-700' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-md text-sm italic transition-colors ${
            editor.isActive('italic') ? 'bg-pink-100 text-pink-700' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded-md text-sm underline transition-colors ${
            editor.isActive('underline') ? 'bg-pink-100 text-pink-700' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Underline"
        >
          U
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded-md text-sm line-through transition-colors ${
            editor.isActive('strike') ? 'bg-pink-100 text-pink-700' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Strike"
        >
          S
        </button>
        
        <div className="w-px h-4 bg-slate-300 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-md text-xs font-bold transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-pink-100 text-pink-700' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded-md text-xs font-bold transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-pink-100 text-pink-700' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Heading 3"
        >
          H3
        </button>

        <div className="w-px h-4 bg-slate-300 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-md text-sm transition-colors flex items-center justify-center ${
            editor.isActive('bulletList') ? 'bg-pink-100 text-pink-700' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Bullet List"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-md text-sm transition-colors flex items-center justify-center ${
            editor.isActive('orderedList') ? 'bg-pink-100 text-pink-700' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Ordered List"
        >
          <span className="text-[10px] font-bold">1.</span>
        </button>

        <div className="w-px h-4 bg-slate-300 mx-1"></div>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-1.5 rounded-md text-sm transition-colors ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-pink-100 text-pink-700' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Align Left"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h16" /></svg>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-1.5 rounded-md text-sm transition-colors ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-pink-100 text-pink-700' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Align Center"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M7 12h10M4 18h16" /></svg>
        </button>
      </div>

      <EditorContent editor={editor} />
      
      <style dangerouslySetInnerHTML={{ __html: `
        .ProseMirror a { color: #0ea5e9; text-decoration: underline; }
        .ProseMirror ul { list-style-type: disc; padding-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }
        .ProseMirror ol { list-style-type: decimal; padding-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }
        .ProseMirror h2 { font-size: 1.5rem; font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem; }
        .ProseMirror h3 { font-size: 1.25rem; font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem; }
      `}} />
    </div>
  );
}
