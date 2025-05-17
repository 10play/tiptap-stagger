import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import { useState, useEffect } from "react";

const defaultContent = `
<h1>Welcome to the Tiptap Editor</h1>
<p>This is a rich text editor that supports <strong>bold</strong>, <em>italic</em>, and many other formatting options.</p>

<h2>Features</h2>
<ul>
  <li>Text formatting with <strong>bold</strong> and <em>italic</em></li>
  <li>Different heading levels</li>
  <li>Bullet lists like this one</li>
  <li>Ordered lists</li>
  <li>Code blocks</li>
</ul>

<h2>Code Example</h2>
<pre><code>function helloWorld() {
  console.log("Hello, world!");
}
</code></pre>

<h3>Ordered List Example</h3>
<ol>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ol>

<p>Try editing this content and watch it stream to the right editor when you click the "Stream Content" button!</p>
`;

export default function App() {
  const [content, setContent] = useState(defaultContent);
  const [readonlyContent, setReadonlyContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Markdown],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const readonlyEditor = useEditor({
    extensions: [StarterKit, Markdown],
    content: readonlyContent,
    editable: false,
  });

  useEffect(() => {
    if (readonlyEditor && readonlyContent) {
      readonlyEditor.commands.setContent(readonlyContent);
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
      <h1 className="editor-title">Tiptap Editor</h1>

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
          />
        </div>
      </div>
    </div>
  );
}
