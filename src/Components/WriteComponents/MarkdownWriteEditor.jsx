import MDEditor, { commands } from "@uiw/react-md-editor";
import {
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Heading,
  Strikethrough,
  Underline,
  Minus,
  CircleHelp,
  SquareCode,
} from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { useRef } from "react";
import remarkGfm from "remark-gfm";
import React from "react";

export function MarkdownWriteEditor({ value, onChange, mode }) {
  const editorRef = useRef(null);
  const iconClass = "w-5 h-5 text-[#475569] dark:text-gray-200";

  /* ---------- Custom Toolbar Commands ---------- */
  const customCommands = [
    {
      ...commands.bold,
      icon: <Bold className={iconClass} />,
      label: "Bold (**text**)",
    },
    {
      ...commands.italic,
      icon: <Italic className={iconClass} />,
      label: "Italic (*text*)",
    },
    {
      ...commands.strikethrough,
      icon: <Strikethrough className={iconClass} />,
      label: "Strikethrough (~~text~~)",
    },
    {
      name: "underline",
      keyCommand: "underline",
      icon: <Underline className={iconClass} />,
      label: "Underline (<u>text</u>)",
      execute: (state, api) => {
        api.replaceSelection(`<u>${state.selectedText || ""}</u>`);
      },
    },
    {
      ...commands.link,
      icon: <LinkIcon className={iconClass} />,
      label: "Link ([text](url))",
    },
    {
      ...commands.unorderedListCommand,
      icon: <List className={iconClass} />,
      label: "Bulleted list",
    },
    {
      ...commands.orderedListCommand,
      icon: <ListOrdered className={iconClass} />,
      label: "Numbered list",
    },
    {
      ...commands.title2,
      icon: <Heading className={iconClass} />,
      label: "Heading (##)",
    },
    {
      ...commands.quote,
      icon: <Quote className={iconClass} />,
      label: "Quote (>)",
    },
    {
      ...commands.codeBlock,
      icon: <SquareCode className={iconClass} />,
      label: "Code block (```)",
    },
    {
      name: "divider",
      keyCommand: "divider",
      icon: <Minus className={iconClass} />,
      label: "Horizontal rule (---)",
      execute: (state, api) => {
        api.replaceSelection("\n\n---\n\n");
      },
    },
  ];

  /* ---------- Preview Mode ---------- */
  if (mode === "preview") {
    return (
      <div
        className="bg-white border border-gray-200 rounded-lg p-8 min-h-125 dark:bg-bg-primary-dark dark:border-gray-700 transition-colors"
        data-color-mode="light"
      >
        {value?.trim() ? (
          <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert">
            <MDEditor.Markdown
              source={value}
              previewOptions={{
                remarkPlugins: [remarkGfm],
              }}
              style={{
                backgroundColor: "transparent",
                color: "inherit",
              }}
            />
          </div>
        ) : (
          <p className="text-gray-400">Nothing to preview yet...</p>
        )}
      </div>
    );
  }

  /* ---------- Editor Mode ---------- */
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden dark:bg-bg-primary-dark dark:border-gray-700 transition-colors">
      {/* Toolbar */}
      <div className="sticky top-0 bg-slate-100/50 border-b border-gray-200 p-2 z-10 dark:bg-bg-primary-dark dark:border-gray-700">
        <div className="flex gap-1 flex-wrap items-center">
          {customCommands.map((cmd) => (
            <button
              key={cmd.name}
              type="button"
              title={cmd.label}
              onClick={() => {
                if (editorRef.current) {
                  editorRef.current.commandOrchestrator.executeCommand(cmd);
                }
              }}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-bg-secondary-dark transition-colors"
            >
              {cmd.icon}
            </button>
          ))}

          <div className="mx-2 h-6 w-px bg-gray-200 dark:bg-gray-700" />

          <RouterLink
            to="/editor-guide"
            title="Editor guide and Markdown syntax"
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-bg-secondary-dark transition-colors"
          >
            <CircleHelp className={iconClass} />
          </RouterLink>
        </div>
      </div>

      {/* Editor Area */}
      <div className="p-6" data-color-mode="auto">
        <MDEditor
          ref={editorRef}
          value={value}
          onChange={onChange}
          commands={[]}
          extraCommands={[]}
          hideToolbar={true}
          preview="edit"
          visibleDragbar={false}
          height="auto"
          minHeight={500}
          textareaProps={{
            placeholder: "Write in Markdown...",
            className: "outline-none focus:ring-0 text-black dark:text-white",
          }}
          className="border-none! bg-transparent! shadow-none! dark:text-white!"
        />
      </div>
    </div>
  );
}
