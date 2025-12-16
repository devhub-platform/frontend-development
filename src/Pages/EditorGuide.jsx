/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import {
  BookOpen,
  Sparkles,
  Link2,
  Image as ImageIcon,
  Quote,
  List,
  Heading,
  Tags,
  Shield,
  ArrowLeft,
  ExternalLink,
  Keyboard,
  Bold,
  Italic,
  Strikethrough,
  Underline,
  Code2,
  Minus,
} from "lucide-react";

function SectionTitle({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="p-2 rounded-lg bg-gray-100 dark:bg-bg-primary-dark">
        <Icon className="w-5 h-5 text-text-light dark:text-text-dark" />
      </div>
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] dark:text-white">
          {title}
        </h2>
        {desc && (
          <p className="mt-1 text-[#475569] dark:text-gray-300 leading-7">
            {desc}
          </p>
        )}
      </div>
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-lg p-4 sm:p-6 dark:bg-bg-primary-dark dark:border-gray-700">
      {children}
    </div>
  );
}

function CodeBlock({ children }) {
  return (
    <pre className="rounded-xl bg-[#0b1220] text-white p-4 overflow-x-auto border border-white/10">
      <code className="text-sm leading-6">{children}</code>
    </pre>
  );
}

function MiniTag({ children }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-[#475569] dark:bg-bg-secondary-dark dark:text-gray-200">
      {children}
    </span>
  );
}

function Shortcut({ combo, desc }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <div className="text-[#475569] dark:text-gray-300 leading-7">{desc}</div>
      <div className="shrink-0 flex gap-1 flex-wrap justify-end">
        {combo.split("+").map((k) => (
          <kbd
            key={k}
            className="px-2 py-1 rounded-lg border border-gray-200 bg-gray-50 text-[#0F172A] text-[11px] sm:text-xs font-bold dark:border-gray-700 dark:bg-bg-secondary-dark dark:text-white"
          >
            {k.trim()}
          </kbd>
        ))}
      </div>
    </div>
  );
}

export default function EditorGuide() {
  return (
    <div className="min-h-screen bg-white dark:bg-bg-secondary-dark transition-colors">
      {/* Hero */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex items-center justify-between gap-6 flex-wrap">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-[#475569] dark:border-gray-700 dark:bg-bg-primary-dark dark:text-gray-300">
                <BookOpen className="w-4 h-4 text-text-light dark:text-text-dark" />
                DevHub Editor Guide
              </div>

              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] dark:text-white leading-tight">
                Write & format posts using Markdown
              </h1>

              <p className="mt-3 text-[#475569] dark:text-gray-300 max-w-2xl leading-7">
                DevHub uses a Markdown editor with a preview mode. Use the
                toolbar or keyboard shortcuts to format text fast.
              </p>

              <div className="mt-5 flex items-center gap-3 flex-wrap">
                <Link
                  to="/write"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                  style={{ fontWeight: 700 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Write
                </Link>

                <a
                  href="https://www.markdownguide.org/basic-syntax/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 text-[#0F172A] hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-bg-primary-dark transition-colors"
                  style={{ fontWeight: 700 }}
                >
                  Markdown reference
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </a>

                <MiniTag>Markdown + Preview</MiniTag>
                <MiniTag>Links open in new tab</MiniTag>
                <MiniTag>Auto https://</MiniTag>
              </div>
            </div>

            {/* highlight */}
            <div className="w-full lg:w-[380px]">
              <div className="rounded-2xl p-5 sm:p-6 bg-linear-to-br from-[rgba(0,56,144,0.14)] to-[rgba(0,56,144,0.02)] border border-[rgba(0,56,144,0.25)] dark:from-[rgba(81,162,255,0.16)] dark:to-[rgba(81,162,255,0.03)] dark:border-[rgba(81,162,255,0.25)]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-text-light dark:text-text-dark" />
                  <h3 className="text-lg font-extrabold text-[#0F172A] dark:text-white">
                    Best practice
                  </h3>
                </div>
                <p className="mt-2 text-[#475569] dark:text-gray-300 leading-7">
                  Use headings (## / ###) and lists to make your post easier to
                  read. Preview before publishing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Things to know */}
          <Card>
            <SectionTitle
              icon={Shield}
              title="Things to know"
              desc="Quick rules & behaviors in DevHub editor."
            />
            <ul className="space-y-3 text-[#475569] dark:text-gray-300 leading-7">
              <li>
                The post body is Markdown (plain text). Preview renders it into
                a nice format.
              </li>
              <li>
                Links in preview always open in a <strong>new tab</strong>.
              </li>
              <li>
                If you type a URL without <code>https://</code>, DevHub preview
                will automatically treat it as <code>https://</code>.
              </li>
              <li>
                Some domains (like YouTube/GitHub) show as an “embed-style link”
                card in preview.
              </li>
              <li>
                Underline is HTML: <code>{"<u>text</u>"}</code> (optional
                feature).
              </li>
            </ul>
          </Card>

          {/* Keyboard shortcuts */}
          <Card>
            <SectionTitle
              icon={Keyboard}
              title="Keyboard shortcuts"
              desc="These work inside the editor textarea."
            />

            <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 text-[#0F172A] font-extrabold dark:bg-bg-secondary-dark dark:text-white">
                Shortcuts
              </div>

              <div className="px-4">
                <Shortcut combo="Ctrl + Z" desc="Undo last change" />
                <Shortcut combo="Ctrl + Shift + Z" desc="Redo (alternative)" />
                <Shortcut combo="Ctrl + Y" desc="Redo" />
                <Shortcut combo="Ctrl + B" desc="Toggle Bold (**text**)" />
                <Shortcut combo="Ctrl + I" desc="Toggle Italic (_text_)" />
                <Shortcut
                  combo="Ctrl + K"
                  desc="Insert Link [text](https://...)"
                />
              </div>
            </div>

            <p className="mt-3 text-[#475569] dark:text-gray-300 leading-7">
              On Mac, shortcuts usually use <strong>Cmd</strong> instead of
              Ctrl.
            </p>
          </Card>

          {/* Formatting basics */}
          <Card>
            <SectionTitle
              icon={Heading}
              title="Formatting basics"
              desc="Most used Markdown syntax in DevHub."
            />

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Bold className="w-4 h-4 text-text-light dark:text-text-dark" />
                  <p className="font-extrabold text-[#0F172A] dark:text-white">
                    Bold / Italic
                  </p>
                </div>
                <CodeBlock>{`**bold**
_italic_`}</CodeBlock>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Strikethrough className="w-4 h-4 text-text-light dark:text-text-dark" />
                  <p className="font-extrabold text-[#0F172A] dark:text-white">
                    Strikethrough
                  </p>
                </div>
                <CodeBlock>{`~~strike~~`}</CodeBlock>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Underline className="w-4 h-4 text-text-light dark:text-text-dark" />
                  <p className="font-extrabold text-[#0F172A] dark:text-white">
                    Underline (HTML)
                  </p>
                </div>
                <CodeBlock>{`<u>underline</u>`}</CodeBlock>
                <p className="mt-2 text-[#475569] dark:text-gray-300 leading-7">
                  Underline is not part of standard Markdown, so DevHub supports
                  it via inline HTML.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Minus className="w-4 h-4 text-text-light dark:text-text-dark" />
                  <p className="font-extrabold text-[#0F172A] dark:text-white">
                    Divider
                  </p>
                </div>
                <CodeBlock>{`---`}</CodeBlock>
              </div>
            </div>
          </Card>

          {/* Lists + Quotes */}
          <Card>
            <SectionTitle
              icon={List}
              title="Lists & quotes"
              desc="Great for steps, summaries, and key points."
            />

            <div className="space-y-4">
              <div>
                <p className="font-extrabold text-[#0F172A] dark:text-white mb-2">
                  Bullet list
                </p>
                <CodeBlock>{`- Item one
- Item two
  - Nested item`}</CodeBlock>
              </div>

              <div>
                <p className="font-extrabold text-[#0F172A] dark:text-white mb-2">
                  Numbered list
                </p>
                <CodeBlock>{`1. First step
2. Second step
3. Third step`}</CodeBlock>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Quote className="w-4 h-4 text-text-light dark:text-text-dark" />
                  <p className="font-extrabold text-[#0F172A] dark:text-white">
                    Quote
                  </p>
                </div>
                <CodeBlock>{`> This is a quote
> It can span multiple lines`}</CodeBlock>
              </div>
            </div>
          </Card>

          {/* Links */}
          <Card>
            <SectionTitle
              icon={Link2}
              title="Links"
              desc="Links are always external in Preview (open in a new tab)."
            />

            <div className="space-y-4">
              <div>
                <p className="font-extrabold text-[#0F172A] dark:text-white mb-2">
                  Standard link
                </p>
                <CodeBlock>{`[DevHub](https://example.com)`}</CodeBlock>
              </div>

              <div>
                <p className="font-extrabold text-[#0F172A] dark:text-white mb-2">
                  URL without protocol
                </p>
                <CodeBlock>{`[Google](google.com)`}</CodeBlock>
                <p className="mt-2 text-[#475569] dark:text-gray-300 leading-7">
                  Preview will automatically treat <code>google.com</code> as{" "}
                  <code>https://google.com</code>.
                </p>
              </div>

              <div>
                <p className="font-extrabold text-[#0F172A] dark:text-white mb-2">
                  Embed-style links
                </p>
                <p className="text-[#475569] dark:text-gray-300 leading-7">
                  Links from certain platforms (YouTube/GitHub/etc.) appear as a
                  “card style link” in preview. Full rich embeds
                  (title/image/description) can be added later with backend
                  OpenGraph support.
                </p>
              </div>
            </div>
          </Card>

          {/* Images + code */}
          <Card>
            <SectionTitle
              icon={ImageIcon}
              title="Images & code"
              desc="Perfect for developer posts."
            />

            <div className="space-y-4">
              <div>
                <p className="font-extrabold text-[#0F172A] dark:text-white mb-2">
                  Image
                </p>
                <CodeBlock>{`![Alt text](https://your-image-url.com/image.png)`}</CodeBlock>
                <p className="mt-2 text-[#475569] dark:text-gray-300 leading-7">
                  Always write a good alt text for accessibility.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Code2 className="w-4 h-4 text-text-light dark:text-text-dark" />
                  <p className="font-extrabold text-[#0F172A] dark:text-white">
                    Code block
                  </p>
                </div>
                <CodeBlock>{`\`\`\`js
function hello() {
  console.log("Hello DevHub");
}
\`\`\``}</CodeBlock>
              </div>

              <div>
                <p className="font-extrabold text-[#0F172A] dark:text-white mb-2">
                  Inline code
                </p>
                <CodeBlock>{`Use \`npm install\` to install packages.`}</CodeBlock>
              </div>
            </div>
          </Card>

          {/* Metadata */}
          <Card>
            <SectionTitle
              icon={Tags}
              title="Post fields in DevHub"
              desc="These are handled by DevHub UI, not inside Markdown."
            />
            <ul className="space-y-2 text-[#475569] dark:text-gray-300 leading-7">
              <li>
                <strong>Title</strong>: your post headline.
              </li>
              <li>
                <strong>Tags</strong>: choose up to 4 tags to improve
                discoverability.
              </li>
              <li>
                <strong>Cover Image</strong>: upload or generate (demo now,
                backend later).
              </li>
              <li>
                <strong>Visibility</strong>: public / private / draft.
              </li>
            </ul>
          </Card>
        </div>

        {/* Footer Callout */}
        <div className="mt-8 sm:mt-10 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-lg dark:bg-bg-primary-dark dark:border-gray-700">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-bg-secondary-dark">
              <Sparkles className="w-5 h-5 text-text-light dark:text-text-dark" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#0F172A] dark:text-white">
                You’re ready to publish
              </h3>
              <p className="mt-1 text-[#475569] dark:text-gray-300 leading-7">
                Write your content, preview it, then save as draft or publish
                when backend is connected. Your draft will also stay saved
                locally if you enabled localStorage autosave.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
