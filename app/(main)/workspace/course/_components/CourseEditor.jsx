"use client";
import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import DragDrop from "editorjs-drag-drop";
import Undo from "editorjs-undo";

// --- IMPORT ALL THE TOOLS ---
import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";
import List from "@editorjs/list";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import Quote from "@editorjs/quote";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import Marker from "@editorjs/marker";
import Underline from "@editorjs/underline";
import Checklist from "@editorjs/checklist";
import InlineImage from "editorjs-inline-image";
import CodeBox from "@bomdi/codebox";
import LaTexTool from "editorjs-latex";

import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import { toast } from "sonner";

const CourseEditor = ({ initialData, onSave, onCancel }) => {
  const editorRef = useRef(null);
  const holderId = "editable-editor-js";
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editorRef.current) {
      return;
    }

    // Sanitize the initial data before loading, especially for YouTube URLs
    const sanitizedData = JSON.parse(
      JSON.stringify(initialData || { blocks: [] })
    );
    sanitizedData.blocks?.forEach((block) => {
      if (block.type === "embed" && block.data.service === "youtube") {
        const watchUrl = block.data.embed;
        if (watchUrl && watchUrl.includes("watch?v=")) {
          try {
            const videoId = new URL(watchUrl).searchParams.get("v");
            if (videoId) {
              block.data.embed = `https://www.youtube.com/embed/${videoId}`;
            }
          } catch (e) {
            console.error("Could not parse YouTube URL:", watchUrl);
          }
        }
      }
    });

    const editor = new EditorJS({
      holder: holderId,
      tools: {
        // --- ALL TOOLS CONFIGURED HERE ---
        header: Header,
        paragraph: { class: Paragraph, inlineToolbar: true },
        list: { class: List, inlineToolbar: true },
        checklist: { class: Checklist, inlineToolbar: true },
        embed: {
          class: Embed,
          config: {
            services: {
              youtube: {
                regex:
                  /(?:https?:\/\/)?(?:www\.)?(?:(?:youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))|(?:youtu\.be\/))([a-zA-Z0-9_-]{11})/,
                embedUrl:
                  "https://www.youtube.com/embed/<%= remote_id %>?rel=0&showinfo=0&ecver=2",
                html: '<iframe width="580" height="320" frameborder="0" allowfullscreen></iframe>',
                height: 320,
                width: 580,
              },
              vimeo: true,
              coub: true,
              vine: true,
              twitter: true,
              instagram: true,
              codepen: true,
              pinterest: true,
              github: true,
            },
          },
        },
        table: Table,
        quote: Quote,
        delimiter: Delimiter,
        inlineCode: InlineCode,
        marker: Marker,
        underline: Underline,
        inlineImage: {
          class: InlineImage,
          inlineToolbar: true,
          config: { embed: { display: true } },
        },
        codeBox: {
          class: CodeBox,
          config: {
            themeURL:
              "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.1.2/build/styles/atom-one-dark.min.css",
            themeName: "atom-one-dark",
          },
        },
        latex: {
          class: LaTexTool,
          config: {
            // This relies on the KaTeX script loaded in your layout
            katex: global.katex,
          },
        },
      },
      data: sanitizedData,
      onReady: () => {
        new DragDrop(editor);
        new Undo({ editor });
        console.log("Editor.js is ready with all tools!");
      },
    });

    editorRef.current = editor;

    return () => {
      if (
        editorRef.current &&
        typeof editorRef.current.destroy === "function"
      ) {
        editorRef.current.destroy();
      }
      editorRef.current = null;
    };
  }, []);

  const handleSave = async () => {
    if (!editorRef.current) return;
    try {
      setIsSaving(true);
      const savedData = await editorRef.current.save();
      onSave(savedData); // Pass the data to the parent for the API call
    } catch (error) {
      toast.error("Failed to save content. Please check for errors.");
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative">
      <style jsx global>{`
        .ce-block__content {
          max-width: 100% !important;
        }
        .cdx-block iframe {
          width: 100% !important;
          min-height: 320px !important;
          pointer-events: auto !important;
          display: block !important;
        }
        .embed-tool iframe {
          max-width: 100% !important;
        }
        .ce-block__content iframe {
          width: 100% !important;
          margin: 0 auto !important;
        }
        .embed-tool__caption {
          margin-top: 8px;
        }
      `}</style>
      <div
        id={holderId}
        className="prose max-w-none border rounded-lg p-4 bg-white min-h-[400px]"
      />
      <div className="flex sticky top-0 z-50 items-center right-0 w-full pt-2">
        <div className="flex items-center gap-2 ml-auto">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-green-700 hover:bg-green-800 hover:cursor-pointer"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            variant="ghost"
            className="hover:cursor-pointer"
            onClick={onCancel}
            disabled={isSaving}
          >
            <X className="w-4 h-4 mr-2" /> Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseEditor;
