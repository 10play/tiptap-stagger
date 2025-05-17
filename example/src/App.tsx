import "@10play/tiptap-stagger/styles.css";
import { StaggerExtension } from "@10play/tiptap-stagger";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import { useState, useEffect, useRef } from "react";

const defaultContent = `
<h1>Welcome to the Tiptap Editor</h1>
<p>This is a rich text editor that supports <strong>bold</strong>, <em>italic</em>, <strong><em>bold-italic</em></strong>, and <s>strikethrough</s> formatting options.</p>

<h2>Inspirational Quotes</h2>
<blockquote>
  <p>The future belongs to those who believe in the beauty of their dreams.</p>
  <p>Eleanor Roosevelt</p>
</blockquote>

<p>As Steve Jobs once said, <strong>"Innovation distinguishes between a leader and a follower."</strong></p>

<h2>Text Styling Examples</h2>
<ul>
  <li><strong>Bold text</strong> for emphasis</li>
  <li><em>Italic text</em> for subtle emphasis</li>
  <li><s>Strikethrough</s> for outdated content</li>
  <li><strong><em>Bold and italic</em></strong> for maximum emphasis</li>
  <li>Regular text mixed with <strong>bold</strong> and <em>italic</em> words</li>
</ul>

<h3>Famous Literary Quotes</h3>
<ol>
  <li>"<strong>All that we see or seem is but a dream within a dream.</strong>" <em>— Edgar Allan Poe</em></li>
  <li>"It is <s>never</s> <strong>always</strong> a mistake to not follow your heart." <em>— Unknown</em></li>
  <li>"<em>In the midst of chaos, there is also opportunity.</em>" <strong>— Sun Tzu</strong></li>
</ol>

<blockquote>
  <p><strong><em>The only limit to our realization of tomorrow will be our doubts of today.</em></strong></p>
  <p>— Franklin D. Roosevelt</p>
</blockquote>

<p>Try editing this content and watch it stream to the right editor when you click the "Stream Content" button!</p>
`;

export default function App() {
  const [content, setContent] = useState(defaultContent);
  const [readonlyContent, setReadonlyContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const readonlyEditorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [StarterKit, Markdown],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const readonlyEditor = useEditor({
    extensions: [StarterKit, Markdown, StaggerExtension],
    content: readonlyContent,
    editable: false,
  });

  useEffect(() => {
    if (readonlyEditor && readonlyContent) {
      readonlyEditor.commands.setContent(readonlyContent);

      // Auto-scroll when content changes
      if (readonlyEditorRef.current) {
        const element = readonlyEditorRef.current;
        element.scrollTop = element.scrollHeight;
      }
    }
  }, [readonlyContent, readonlyEditor]);

  const streamContent = async () => {
    if (!editor) return;

    setIsStreaming(true);
    setReadonlyContent("");

    const markdown = editor.storage.markdown.getMarkdown();
    const chunks = markdown.split(" ");
    let currentText = "";

    for (let i = 0; i < chunks.length; i++) {
      currentText += chunks[i] + " ";
      setReadonlyContent(currentText);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    setIsStreaming(false);
  };

  const containerStyle = {
    width: "95%",
    maxWidth: "1600px",
    margin: "0 auto",
    padding: "20px",
  };

  const editorStyle = {
    height: "500px",
    width: "100%",
    minWidth: "500px",
    overflow: "auto",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "10px",
    backgroundColor: "#fff",
  };

  return (
    <div className="editor-container" style={containerStyle}>
      <h1 className="editor-title">Tiptap Stagger</h1>

      <div style={{ display: "flex", gap: "40px", width: "100%" }}>
        <div className="editor-wrapper" style={{ flex: 1, minWidth: "500px" }}>
          <div className="menu-bar">
            <button
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`menu-button ${
                editor?.isActive("bold") ? "is-active" : ""
              }`}
            >
              B
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`menu-button ${
                editor?.isActive("italic") ? "is-active" : ""
              }`}
            >
              I
            </button>
            <button
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`menu-button ${
                editor?.isActive("heading", { level: 1 }) ? "is-active" : ""
              }`}
            >
              H1
            </button>
            <button
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`menu-button ${
                editor?.isActive("heading", { level: 2 }) ? "is-active" : ""
              }`}
            >
              H2
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`menu-button ${
                editor?.isActive("bulletList") ? "is-active" : ""
              }`}
            >
              • List
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={`menu-button ${
                editor?.isActive("orderedList") ? "is-active" : ""
              }`}
            >
              1. List
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
              className={`menu-button ${
                editor?.isActive("codeBlock") ? "is-active" : ""
              }`}
            >
              Code
            </button>
          </div>

          <EditorContent
            editor={editor}
            className="editor-content"
            style={editorStyle}
          />
        </div>

        <div className="editor-wrapper" style={{ flex: 1, minWidth: "500px" }}>
          <div className="menu-bar">
            <button
              onClick={streamContent}
              className="menu-button"
              disabled={isStreaming}
            >
              {isStreaming ? "Streaming..." : "Stream Content"}
            </button>
          </div>
          <EditorContent
            editor={readonlyEditor}
            className="editor-content"
            style={editorStyle}
            ref={readonlyEditorRef}
          />
        </div>
      </div>
    </div>
  );
}
