import "./index.css";
import TiptapEditor from "./components/TiptapEditor";

export function App() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Tiptap Editor with Markdown</h1>
      <p className="text-muted-foreground mb-8">
        Edit content in the editor and see the Markdown output below. Use the
        download button to export as Markdown.
      </p>
      <div className="max-w-5xl mx-auto">
        <TiptapEditor />
      </div>
    </div>
  );
}

export default App;
