import type { Editor } from '@tiptap/react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { JSX } from 'react';

interface ToolbarAction
{
    label: string;
    run: (editor: Editor) => boolean;
}

const TOOLBAR: ToolbarAction[] = [
    { label: 'B', run: (editor) => editor.chain().focus().toggleBold().run() },
    { label: 'I', run: (editor) => editor.chain().focus().toggleItalic().run() },
    { label: 'U', run: (editor) => editor.chain().focus().toggleUnderline().run() },
    { label: '• List', run: (editor) => editor.chain().focus().toggleBulletList().run() },
    { label: '1. List', run: (editor) => editor.chain().focus().toggleOrderedList().run() },
];

interface RichTextEditorProps
{
    id: string;
    value: string;
    onChange: (html: string) => void;
}

export function RichTextEditor({ id, value, onChange }: RichTextEditorProps): JSX.Element
{
    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        onUpdate: ({ editor: current }): void => onChange(current.getHTML()),
        editorProps: {
            attributes: { id, class: 'rich-text min-h-40 px-3 py-2 text-sm text-slate-800 focus:outline-none' },
        },
    });

    return (
        <div className="overflow-hidden rounded-md border border-slate-300 bg-white focus-within:border-indigo-500">
            <div className="flex gap-1 border-b border-slate-200 bg-slate-50 p-1">
                {TOOLBAR.map((action) => (
                    <button
                        key={action.label}
                        type="button"
                        onClick={(): void =>
                        {
                            action.run(editor);
                        }}
                        className="rounded px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-200"
                    >
                        {action.label}
                    </button>
                ))}
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}
