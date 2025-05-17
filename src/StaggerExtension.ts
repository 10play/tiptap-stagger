import { Extension } from "@tiptap/core";
import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    StaggerText: {
      setStaggerEnabled: (enabled: boolean) => ReturnType;
    };
  }
}

export const StaggerExtension = Extension.create<{
  enabled: boolean;
  animation: "default"; // one day we'll have more animations
}>({
  name: "StaggerText",
  addOptions() {
    return {
      enabled: true,
      animation: "default",
    };
  },
  addCommands() {
    return {
      setStaggerEnabled: (enabled: boolean) => () => {
        this.options.enabled = enabled;
        return true;
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations: (state) => {
            if (!this.options.enabled) return null;
            const { doc } = state;
            const decorations: Decoration[] = [];
            let segmentIndex = 0;

            doc.descendants((node, pos) => {
              // Handle all nodes including text and custom citation nodes
              if (node.isText) {
                const text = node.text ?? "";
                let offset = 0;

                // split into words *and* whitespace, so we preserve spaces
                for (const segment of text.split(/(\s+)/)) {
                  const len = segment.length;
                  // Apply decoration to every segment
                  decorations.push(
                    Decoration.inline(pos + offset, pos + offset + len, {
                      class: "stagger-text",
                      style: `--delay: ${Math.min(segmentIndex * 0.05, 200)}ms`,
                    })
                  );
                  segmentIndex++;
                  offset += len;
                }
              } else {
                // Apply decoration nodes
                decorations.push(
                  Decoration.node(pos, pos + node.nodeSize, {
                    class: "stagger-node",
                    style: `--delay: ${Math.min(segmentIndex * 0.05, 200)}ms`,
                  })
                );
                segmentIndex++;
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
