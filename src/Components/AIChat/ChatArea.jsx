// src/Components/AIChat/ChatArea.jsx
import {
  User,
  Bot,
  Bug,
  Code,
  Zap,
  Database,
  TestTube,
  FileJson,
  Clipboard,
  Check,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

const suggestions = [
  { icon: Bug, text: "Explain React error", color: "text-red-400", bg: "bg-red-500/10" },
  { icon: Code, text: "Write unit tests", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { icon: Zap, text: "Optimize code", color: "text-blue-400", bg: "bg-blue-500/10" },
  { icon: Database, text: "Database design", color: "text-purple-400", bg: "bg-purple-500/10" },
  { icon: TestTube, text: "Setup CI/CD", color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { icon: FileJson, text: "Performance tips", color: "text-amber-400", bg: "bg-amber-500/10" },
];

export default function ChatArea({ messages, selectedModel, onSuggestionClick }) {
  const hasMessages = messages.length > 0;
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = async (content, id) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth overflow-x-hidden">
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-10">

        {!hasMessages ? (
          <div className="flex flex-col items-center text-center pt-10">
            {/* Logo / Header */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mb-5 shadow-lg shadow-primary/30">
              <Bot size={28} color="white" />
            </div>
            <h1 className="text-3xl font-bold dark:text-white text-gray-900 mb-2 tracking-tight">
              Ask <span className="text-primary">DevHub AI</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-md mb-10 leading-relaxed">
              Your intelligent coding assistant. Get help with code, debug errors, or learn new concepts instantly.
            </p>

            {/* Model badge */}
            <div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/50 text-xs text-gray-500 dark:text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {selectedModel || "AI Model"}
            </div>

            {/* Suggestion cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-2xl">
              {suggestions.map((item, i) => (
                <button
                  key={i}
                  onClick={() => onSuggestionClick?.(item.text)}
                  className={`flex items-center gap-3 p-3.5 ${item.bg} border border-gray-200 dark:border-gray-700/50 rounded-xl hover:border-primary/50 hover:scale-[1.02] transition-all text-left group`}
                >
                  <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              const isCopied = copiedId === msg.id;

              return (
                <div key={msg.id} className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>

                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isUser
                      ? "bg-primary shadow-md shadow-primary/30"
                      : "bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600/50"
                  }`}>
                    {isUser
                      ? <User size={15} color="white" />
                      : <Bot size={15} color="white" />
                    }
                  </div>

                  {/* Content */}
                  <div className={`flex flex-col gap-2 flex-1 min-w-0 ${isUser ? "items-end" : "items-start"}`}>

                    {/* Message bubble / content */}
                    {isUser ? (
                      <div className="max-w-[85%] bg-primary text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm leading-relaxed break-words [overflow-wrap:anywhere] shadow-md shadow-primary/20">
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    ) : (
                      <div className="w-full text-sm leading-relaxed text-gray-800 dark:text-gray-100">
                        <div className="
                          prose prose-sm max-w-none dark:prose-invert
                          prose-p:leading-relaxed prose-p:my-1.5
                          prose-headings:font-semibold prose-headings:mt-5 prose-headings:mb-2
                          prose-h1:text-lg prose-h2:text-base prose-h3:text-sm
                          prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                          prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-800 prose-pre:rounded-xl prose-pre:text-gray-100 prose-pre:text-xs prose-pre:leading-relaxed prose-pre:overflow-x-auto
                          prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:not-italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
                          prose-ul:my-2 prose-li:my-0.5
                          prose-ol:my-2
                          prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
                          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                          prose-table:text-xs
                          prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:py-2
                          prose-td:py-2
                          prose-hr:border-gray-200 dark:prose-hr:border-gray-700
                        ">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      </div>
                    )}

                    {/* Attachment preview */}
                    {msg.attachment && msg.attachment.url && (
                      <div className="mt-1">
                        {msg.attachment.url.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i) ? (
                          <div className="relative group w-32 h-32 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                            <img
                              src={msg.attachment.url}
                              alt={msg.attachment.filename || "Attachment"}
                              className="w-full h-full object-cover"
                            />
                            <a
                              href={msg.attachment.url}
                              target="_blank"
                              rel="noreferrer"
                              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                              <ExternalLink className="w-5 h-5 text-white" />
                            </a>
                          </div>
                        ) : (
                          <a
                            href={msg.attachment.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-xs text-primary hover:underline bg-primary/5 border border-primary/20 rounded-lg px-3 py-1.5"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {msg.attachment.filename || "View Attachment"}
                          </a>
                        )}
                      </div>
                    )}

                    {/* Actions row */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-primary transition-colors"
                      >
                        {isCopied
                          ? <><Check size={11} className="text-emerald-400" /><span className="text-emerald-400">Copied!</span></>
                          : <><Clipboard size={11} /><span>Copy</span></>
                        }
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
