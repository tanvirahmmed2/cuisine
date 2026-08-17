import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { 
    RiBold, RiItalic, RiStrikethrough, RiListUnordered, RiListOrdered, RiArrowGoBackLine, RiArrowGoForwardLine 
} from 'react-icons/ri'

const MenuBar = ({ editor }) => {
    if (!editor) {
        return null
    }

    const buttonClass = (isActive) => `p-1.5 rounded-md transition-colors ${
        isActive ? 'bg-primary/10 text-primary' : 'text-tertiary-dark/60 hover:bg-tertiary-dark/5 hover:text-tertiary-dark'
    }`

    return (
        <div className="flex flex-wrap items-center gap-1 border-b border-tertiary-dark/10 p-2 bg-tertiary-dark/5 rounded-t-lg">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={buttonClass(editor.isActive('bold'))}
                title="Bold"
            >
                <RiBold className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={buttonClass(editor.isActive('italic'))}
                title="Italic"
            >
                <RiItalic className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={buttonClass(editor.isActive('strike'))}
                title="Strike"
            >
                <RiStrikethrough className="w-4 h-4" />
            </button>
            
            <div className="w-px h-4 bg-tertiary-dark/20 mx-1" />
            
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={buttonClass(editor.isActive('bulletList'))}
                title="Bullet List"
            >
                <RiListUnordered className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={buttonClass(editor.isActive('orderedList'))}
                title="Ordered List"
            >
                <RiListOrdered className="w-4 h-4" />
            </button>

            <div className="w-px h-4 bg-tertiary-dark/20 mx-1" />

            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="p-1.5 rounded-md text-tertiary-dark/60 hover:bg-tertiary-dark/5 disabled:opacity-50"
                title="Undo"
            >
                <RiArrowGoBackLine className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="p-1.5 rounded-md text-tertiary-dark/60 hover:bg-tertiary-dark/5 disabled:opacity-50"
                title="Redo"
            >
                <RiArrowGoForwardLine className="w-4 h-4" />
            </button>
        </div>
    )
}

const TiptapEditor = ({ content, onChange, placeholder = 'Write here...' }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html === '<p></p>' ? '' : html);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[150px] p-4 max-w-none text-sm text-tertiary-dark',
            },
        },
    })

    return (
        <div className="border border-tertiary-dark/20 rounded-lg overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all w-full bg-tertiary-light">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}

export default TiptapEditor
