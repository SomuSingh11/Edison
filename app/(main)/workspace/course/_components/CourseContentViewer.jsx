"use client";

import { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";
import List from "@editorjs/list";
import CodeTool from "@editorjs/code";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import Quote from "@editorjs/quote";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import Marker from "@editorjs/marker";
import Underline from "@editorjs/underline";
import Checklist from "@editorjs/checklist";
import CodeBox from "@bomdi/codebox";

export default function CourseContentViewer({ courseContent }) {
  const editorInstances = useRef([]);

  useEffect(() => {
    // Clean up previous instances
    editorInstances.current.forEach((editor) => {
      if (editor?.destroy) {
        editor.destroy();
      }
    });
    editorInstances.current = [];

    // Initialize Editor.js for each chapter
    if (courseContent && Array.isArray(courseContent)) {
      courseContent.forEach((chapter, index) => {
        // Skip if no blocks
        if (
          !chapter.CourseContent?.blocks ||
          chapter.CourseContent.blocks.length === 0
        ) {
          return;
        }

        // Sanitize YouTube URLs
        const sanitizedData = JSON.parse(JSON.stringify(chapter.CourseContent));
        sanitizedData.blocks?.forEach((block) => {
          if (block.type === "embed" && block.data.service === "youtube") {
            const url = block.data.embed || block.data.source;
            if (url && url.includes("watch?v=")) {
              try {
                const videoId = new URL(url).searchParams.get("v");
                if (videoId) {
                  block.data.embed = `https://www.youtube.com/embed/${videoId}`;
                  block.data.source = `https://www.youtube.com/watch?v=${videoId}`;
                }
              } catch (e) {
                console.error("Could not parse YouTube URL:", url);
              }
            }
          }
        });

        const editor = new EditorJS({
          holder: `editor-${index}`,
          readOnly: true,
          data: sanitizedData,
          tools: {
            header: {
              class: Header,
              config: {
                placeholder: "Enter a header",
                levels: [1, 2, 3, 4, 5, 6],
                defaultLevel: 3,
              },
            },
            paragraph: {
              class: Paragraph,
              inlineToolbar: true,
            },
            list: {
              class: List,
              inlineToolbar: true,
              config: {
                defaultStyle: "unordered",
              },
            },
            checklist: {
              class: Checklist,
              inlineToolbar: true,
            },
            code: {
              class: CodeTool,
              config: {
                placeholder: "Enter code",
              },
            },
            embed: {
              class: Embed,
              config: {
                services: {
                  youtube: {
                    regex:
                      /(?:https?:\/\/)?(?:www\.)?(?:(?:youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))|(?:youtu\.be\/))([a-zA-Z0-9_-]{11})/,
                    embedUrl:
                      "https://www.youtube.com/embed/<%= remote_id %>?rel=0&showinfo=0&ecver=2",
                    html: '<iframe width="100%" height="320" frameborder="0" allowfullscreen></iframe>',
                    height: 320,
                    width: 580,
                  },
                  vimeo: true,
                  twitter: true,
                  codepen: true,
                  instagram: true,
                },
              },
            },
            table: {
              class: Table,
              inlineToolbar: true,
              config: {
                rows: 2,
                cols: 3,
              },
            },
            quote: {
              class: Quote,
              inlineToolbar: true,
              config: {
                quotePlaceholder: "Enter a quote",
                captionPlaceholder: "Quote's author",
              },
            },
            delimiter: Delimiter,
            inlineCode: {
              class: InlineCode,
            },
            marker: {
              class: Marker,
            },
            underline: Underline,
          },
          minHeight: 0,
          onReady: () => {
            console.log(`Editor ${index} is ready`);
            console.log("Chapter data:", sanitizedData);
          },
        });

        editorInstances.current.push(editor);
      });
    }

    // Cleanup on unmount
    return () => {
      editorInstances.current.forEach((editor) => {
        if (editor?.destroy) {
          editor.destroy();
        }
      });
    };
  }, [courseContent]);

  if (!courseContent || courseContent.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No course content available
      </div>
    );
  }

  return (
    <div className="course-content-container mx-auto">
      <style jsx global>{`
        .cdx-block iframe {
          width: 100% !important;
          min-height: 320px;
          pointer-events: auto !important;
        }
        .embed-tool iframe {
          max-width: 100%;
        }
      `}</style>
      {courseContent.map((chapter, index) => (
        <div
          key={index}
          className="chapter-section mb-12 bg-white rounded-lg shadow-sm p-6"
        >
          <div id={`editor-${index}`} className="editor-content" />
        </div>
      ))}
    </div>
  );
}
