/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
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

/* ---------- helpers ---------- */

function ensureHttp(url) {
  const u = (url || "").trim();
  if (!u) return u;
  if (u.startsWith("mailto:") || u.startsWith("tel:") || u.startsWith("#"))
    return u;
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("//")) return `https:${u}`;
  return `https://${u}`;
}

function isEmbedUrl(href) {
  const u = (href || "").toLowerCase();
  return (
    u.includes("youtube.com") ||
    u.includes("youtu.be") ||
    u.includes("twitter.com") ||
    u.includes("x.com") ||
    u.includes("github.com") ||
    u.includes("codepen.io") ||
    u.includes("codesandbox.io") ||
    u.includes("stackblitz.com")
  );
}

function replaceSelection(text, start, end, replacement) {
  return text.slice(0, start) + replacement + text.slice(end);
}

function toggleWrap(text, start, end, left, right) {
  if (start === end) {
    const placeholder = "text";
    const nextText = replaceSelection(
      text,
      start,
      end,
      `${left}${placeholder}${right}`
    );
    const insideStart = start + left.length;
    return {
      nextText,
      nextStart: insideStart,
      nextEnd: insideStart + placeholder.length,
    };
  }

  const selected = text.slice(start, end);
  const hasWrap = selected.startsWith(left) && selected.endsWith(right);

  if (hasWrap) {
    const unwrapped = selected.slice(
      left.length,
      selected.length - right.length
    );
    const nextText = replaceSelection(text, start, end, unwrapped);
    return { nextText, nextStart: start, nextEnd: start + unwrapped.length };
  }

  const before = text.slice(Math.max(0, start - left.length), start);
  const after = text.slice(end, end + right.length);
  if (before === left && after === right) {
    const nextText =
      text.slice(0, start - left.length) +
      selected +
      text.slice(end + right.length);
    const newStart = start - left.length;
    return {
      nextText,
      nextStart: newStart,
      nextEnd: newStart + selected.length,
    };
  }

  const wrapped = `${left}${selected}${right}`;
  const nextText = replaceSelection(text, start, end, wrapped);
  return {
    nextText,
    nextStart: start + left.length,
    nextEnd: start + left.length + selected.length,
  };
}

function prefixLines(text, start, end, prefixFn, fallbackLine) {
  const selected = text.slice(start, end) || fallbackLine;
  const lines = selected.split("\n");
  const out = lines.map(prefixFn).join("\n");
  const nextText = replaceSelection(text, start, end, out);
  const cursor = start + out.length;
  return { nextText, nextStart: cursor, nextEnd: cursor };
}

function insert(text, start, end, snippet, cursorOffset = snippet.length) {
  const nextText = replaceSelection(text, start, end, snippet);
  const cursor = start + cursorOffset;
  return { nextText, nextStart: cursor, nextEnd: cursor };
}

/* ---------- component ---------- */

export function MarkdownWriteEditor({ value, onChange, mode }) {
  const textareaRef = useRef(null);

  // Undo/Redo history (manual)
  const historyRef = useRef({
    past: [],
    future: [],
    lastValue: value ?? "",
  });

  // keep lastValue updated when parent changes value externally
  historyRef.current.lastValue = value ?? "";

  const apply = (formatter) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;

    const { nextText, nextStart, nextEnd } = formatter(value ?? "", start, end);

    // push current -> past
    const h = historyRef.current;
    h.past.push(value ?? "");
    h.future = [];
    h.lastValue = nextText;

    onChange(nextText);

    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(nextStart, nextEnd);
    });
  };

  const handleUndo = () => {
    const h = historyRef.current;
    if (h.past.length === 0) return;
    const prev = h.past.pop();
    h.future.push(value ?? "");
    h.lastValue = prev;
    onChange(prev);
  };

  const handleRedo = () => {
    const h = historyRef.current;
    if (h.future.length === 0) return;
    const next = h.future.pop();
    h.past.push(value ?? "");
    h.lastValue = next;
    onChange(next);
  };

  const handleKeyDown = (e) => {
    const isMac = navigator.platform.toLowerCase().includes("mac");
    const mod = isMac ? e.metaKey : e.ctrlKey;
    if (!mod) return;

    const key = e.key.toLowerCase();

    // Undo: Ctrl/Cmd + Z
    if (key === "z" && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
      return;
    }

    // Redo: Ctrl+Y or Ctrl+Shift+Z
    if (key === "y" || (key === "z" && e.shiftKey)) {
      e.preventDefault();
      handleRedo();
      return;
    }

    // Bold: Ctrl+B
    if (key === "b") {
      e.preventDefault();
      apply((t, s, en) => toggleWrap(t, s, en, "**", "**"));
      return;
    }

    // Italic: Ctrl+I
    if (key === "i") {
      e.preventDefault();
      apply((t, s, en) => toggleWrap(t, s, en, "_", "_"));
      return;
    }

    // Link: Ctrl+K
    if (key === "k") {
      e.preventDefault();
      apply((t, s, en) => {
        const selected = t.slice(s, en) || "link text";
        const md = `[${selected}](https://)`;
        const urlStart = s + `[${selected}](`.length;
        const urlEnd = urlStart + "https://".length;
        const nextText = replaceSelection(t, s, en, md);
        return { nextText, nextStart: urlStart, nextEnd: urlEnd };
      });
      return;
    }
  };

  const toolbar = useMemo(
    () => [
      {
        title: "Bold (Ctrl+B)",
        icon: Bold,
        onClick: () => apply((t, s, e) => toggleWrap(t, s, e, "**", "**")),
      },
      {
        title: "Italic (Ctrl+I)",
        icon: Italic,
        onClick: () => apply((t, s, e) => toggleWrap(t, s, e, "_", "_")),
      },
      {
        title: "Strikethrough",
        icon: Strikethrough,
        onClick: () => apply((t, s, e) => toggleWrap(t, s, e, "~~", "~~")),
      },
      {
        title: "Underline (HTML)",
        icon: Underline,
        onClick: () => apply((t, s, e) => toggleWrap(t, s, e, "<u>", "</u>")),
      },
      {
        title: "Link (Ctrl+K)",
        icon: LinkIcon,
        onClick: () =>
          apply((t, s, e) => {
            const selected = t.slice(s, e) || "link text";
            const md = `[${selected}](https://)`;
            const urlStart = s + `[${selected}](`.length;
            const urlEnd = urlStart + "https://".length;
            const nextText = replaceSelection(t, s, e, md);
            return { nextText, nextStart: urlStart, nextEnd: urlEnd };
          }),
      },
      {
        title: "Bullet list",
        icon: List,
        onClick: () =>
          apply((t, s, e) =>
            prefixLines(t, s, e, (line) => `- ${line}`, "List item")
          ),
      },
      {
        title: "Numbered list",
        icon: ListOrdered,
        onClick: () =>
          apply((t, s, e) => {
            const selected = t.slice(s, e) || "List item";
            const lines = selected.split("\n");
            const out = lines.map((line, i) => `${i + 1}. ${line}`).join("\n");
            const nextText = replaceSelection(t, s, e, out);
            return {
              nextText,
              nextStart: s + out.length,
              nextEnd: s + out.length,
            };
          }),
      },
      {
        title: "Heading (H2)",
        icon: Heading,
        onClick: () =>
          apply((t, s, e) =>
            prefixLines(t, s, e, (line) => `## ${line}`, "Heading")
          ),
      },
      {
        title: "Quote",
        icon: Quote,
        onClick: () =>
          apply((t, s, e) =>
            prefixLines(t, s, e, (line) => `> ${line}`, "Quote")
          ),
      },
      {
        title: "Code block",
        icon: SquareCode,
        onClick: () =>
          apply((t, s, e) => {
            const selected = t.slice(s, e) || "code here";
            const block = `\n\`\`\`\n${selected}\n\`\`\`\n`;
            return insert(t, s, e, block, 5);
          }),
      },
      {
        title: "Divider",
        icon: Minus,
        onClick: () => apply((t, s, e) => insert(t, s, e, `\n\n---\n\n`, 4)),
      },
    ],
    [value]
  );

  const iconClass = "w-5 h-5 text-[#475569] dark:text-gray-200";

  if (mode === "preview") {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 min-h-[500px] dark:bg-bg-primary-dark dark:border-gray-700 transition-colors">
        {value?.trim() ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              a: ({ children, href, ...props }) => {
                const safeHref = ensureHttp(href);
                const embed = isEmbedUrl(safeHref);
                return (
                  <a
                    href={safeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      embed
                        ? "inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-text-light hover:bg-gray-100 transition-colors dark:border-gray-700 dark:bg-bg-secondary-dark dark:hover:bg-bg-primary-dark dark:text-text-dark"
                        : "text-text-light underline underline-offset-4 hover:opacity-80 dark:text-text-dark"
                    }
                    {...props}
                  >
                    {children}
                    {embed ? (
                      <span className="text-xs opacity-70">(embed)</span>
                    ) : null}
                  </a>
                );
              },
              h2: ({ children }) => (
                <h2 className="text-3xl font-extrabold text-[#0F172A] dark:text-white mt-6 mb-3">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white mt-5 mb-2">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-[#475569] dark:text-gray-300 leading-7 my-3">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 my-3 text-[#475569] dark:text-gray-300">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 my-3 text-[#475569] dark:text-gray-300">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="my-1">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-[#475569] dark:text-gray-300">
                  {children}
                </blockquote>
              ),
              code: ({ inline, children }) =>
                inline ? (
                  <code className="px-1.5 py-0.5 rounded bg-gray-100 text-[#0F172A] dark:bg-bg-secondary-dark dark:text-white">
                    {children}
                  </code>
                ) : (
                  <code className="block p-4 rounded-lg bg-gray-900 text-white overflow-x-auto">
                    {children}
                  </code>
                ),
              pre: ({ children }) => <pre className="my-4">{children}</pre>,
              hr: () => (
                <div className="my-8 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                </div>
              ),
            }}
          >
            {value}
          </ReactMarkdown>
        ) : (
          <p className="text-gray-400">Nothing to preview yet...</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden dark:bg-bg-primary-dark dark:border-gray-700 transition-colors">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-2 z-10 dark:bg-bg-primary-dark dark:border-gray-700">
        <div className="flex gap-1 flex-wrap items-center">
          {toolbar.map((b) => {
            const Icon = b.icon;
            return (
              <button
                key={b.title}
                type="button"
                onClick={b.onClick}
                title={b.title}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-bg-secondary-dark transition-colors"
              >
                <Icon className={iconClass} />
              </button>
            );
          })}

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

      <div className="p-6">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            const next = e.target.value;

            // سجل الكتابة العادية في history
            const h = historyRef.current;
            if (next !== h.lastValue) {
              h.past.push(h.lastValue);
              h.future = [];
              h.lastValue = next;
            }

            onChange(next);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Write in Markdown..."
          className="w-full min-h-[500px] resize-none outline-none bg-transparent text-[#0F172A] placeholder-gray-400 dark:text-white dark:placeholder-gray-500"
        />
      </div>
    </div>
  );
}
