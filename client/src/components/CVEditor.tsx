import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

export default function CVEditor({
  content,
  onChange,
}: {
  content: Record<string, unknown>;
  onChange: (doc: Record<string, unknown>) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
  });
  useEffect(() => {
    if (editor && content) editor.commands.setContent(content);
  }, [editor]);
  if (!editor) return null;
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 16,
        minHeight: 400,
      }}
    >
      <EditorContent editor={editor} />
    </div>
  );
}
