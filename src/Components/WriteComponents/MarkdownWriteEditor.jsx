/* eslint-disable no-unused-vars */
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

export function MarkdownWriteEditor({ value, onChange, mode }) {
  const editorRef = useRef(null);
  const iconClass = "w-5 h-5 text-[#475569] dark:text-gray-200";

  /* ---------- Custom Toolbar Commands ---------- */
  const customCommands = [
    {
      ...commands.bold,
      icon: <Bold className={iconClass} />,
    },
    {
      ...commands.italic,
      icon: <Italic className={iconClass} />,
    },
    {
      ...commands.strikethrough,
      icon: <Strikethrough className={iconClass} />,
    },
    {
      name: "underline",
      keyCommand: "underline",
      icon: <Underline className={iconClass} />,
      execute: (state, api) => {
        api.replaceSelection(`<u>${state.selectedText || ""}</u>`);
      },
    },
    {
      ...commands.link,
      icon: <LinkIcon className={iconClass} />,
    },
    {
      ...commands.unorderedListCommand,
      icon: <List className={iconClass} />,
    },
    {
      ...commands.orderedListCommand,
      icon: <ListOrdered className={iconClass} />,
    },
    {
      ...commands.title2,
      icon: <Heading className={iconClass} />,
    },
    {
      ...commands.quote,
      icon: <Quote className={iconClass} />,
    },
    {
      ...commands.codeBlock,
      icon: <SquareCode className={iconClass} />,
    },
    {
      name: "divider",
      keyCommand: "divider",
      icon: <Minus className={iconClass} />,
      execute: (state, api) => {
        api.replaceSelection("\n\n---\n\n");
      },
    },
  ];

  /* ---------- Preview Mode ---------- */
  if (mode === "preview") {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 min-h-125 dark:bg-bg-primary-dark dark:border-gray-700 transition-colors">
        {value?.trim() ? (
          /* إضافة wmde-markdown-var وكلاسات الـ lists لضمان ظهور النقط والأرقام */
          <div
            data-color-mode="light"
            className="dark:bg-transparent! prose prose-slate dark:prose-invert max-w-none"
          >
            <MDEditor.Markdown
              source={value}
              components={{
                a: ({ node, ...props }) => (
                  <a {...props} target="_blank" rel="noopener noreferrer" />
                ),
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
            title="Editor Guide"
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-bg-secondary-dark transition-colors"
          >
            <CircleHelp className={iconClass} />
          </RouterLink>
        </div>
      </div>

      {/* Editor Area */}
      <div className="p-6">
        <div data-color-mode="auto">
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
    </div>
  );
}
