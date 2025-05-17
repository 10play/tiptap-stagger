import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { Markdown } from "tiptap-markdown";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Code,
  Quote,
  Undo,
  Redo,
  FileDown,
} from "lucide-react";
import { cn } from "../lib/utils";

type ToolbarButtonProps = {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
};

const ToolbarButton = ({ onClick, isActive, children }: ToolbarButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-2 rounded-md hover:bg-secondary transition-colors",
        isActive && "bg-secondary text-primary"
      )}
    >
      {children}
    </button>
  );
};

const TiptapEditor = () => {
  const [editorContent, setEditorContent] = useState(
    `<h1>Markdown Example</h1>
    <p>This is a <strong>rich text editor</strong> with <em>Markdown support</em>.</p>
    <h2>Features:</h2>
    <ul>
      <li>Easy content formatting</li>
      <li>Export to Markdown</li>
      <li>Live Markdown preview</li>
    </ul>
    <p>Try editing this content or use the toolbar buttons above!</p>
    <blockquote>
      <p>You can also use the <code>FileDown</code> button to download the Markdown version.</p>
    </blockquote>`
  );
  const [markdownContent, setMarkdownContent] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      // Markdown,
    ],
    content: editorContent,
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
      // Get the markdown version of the content
      const markdown = editor.storage.markdown.getMarkdown();
      setMarkdownContent(markdown);
    },
  });

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  const exportMarkdown = () => {
    const markdown = editor.storage.markdown.getMarkdown();
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "document.md";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="border rounded-lg overflow-hidden mb-4">
        <div className="flex flex-wrap gap-1 p-2 bg-card border-b">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive("heading", { level: 1 })}
          >
            <Heading1 className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive("heading", { level: 2 })}
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
          >
            <List className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive("codeBlock")}
          >
            <Code className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>
            <Undo className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton onClick={() => editor.chain().focus().redo().run()}>
            <Redo className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton onClick={exportMarkdown}>
            <FileDown className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <EditorContent
          editor={editor}
          className="prose prose-sm sm:prose-base mx-auto p-4 min-h-[200px] focus:outline-none"
        />
      </div>

      {/* Markdown Preview */}
      <div className="border rounded-lg p-4 bg-muted/50">
        <h3 className="font-medium mb-2">Markdown Output</h3>
        <pre className="whitespace-pre-wrap text-sm bg-muted p-3 rounded-md overflow-auto max-h-[200px]">
          {markdownContent}
        </pre>
      </div>
    </div>
  );
};

export default TiptapEditor;
