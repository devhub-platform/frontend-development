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
  Edit3,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useState } from "react";

const suggestions = [
  { icon: Bug, text: "Explain React error", color: "text-red-500" },
  { icon: Code, text: "Write unit tests", color: "text-green-500" },
  { icon: Zap, text: "Optimize code", color: "text-blue-500" },
  { icon: Database, text: "Database design", color: "text-purple-500" },
  { icon: TestTube, text: "Setup CI/CD", color: "text-indigo-500" },
  { icon: FileJson, text: "Performance tips", color: "text-yellow-500" },
];

export default function ChatArea({
  messages,
  selectedModel,
  onEditMessage, // هنحتاجه من الـparent
}) {
  const hasMessages = messages.length > 0;
  const [expandedIds, setExpandedIds] = useState({});

  const toggleExpand = (id) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    // Scroll داخلي واحد للشات (رأسي بس)
    <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-40">
        <div className="text-xs text-gray-500 mb-6">
          Model:{" "}
          <span className="text-primary font-semibold">{selectedModel}</span>
        </div>

        {!hasMessages ? (
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold dark:text-white mb-2">
              Ask <span className="text-primary">DevHub AI</span> anything
            </h1>
            <p className="text-gray-500 max-w-xl mb-10">
              Get help with code, debug errors, or learn new concepts
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
              {suggestions.map((item, i) => (
                <button
                  key={i}
                  className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md hover:border-primary transition"
                >
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="text-sm font-medium dark:text-gray-200">
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-6">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              const isExpanded = !!expandedIds[msg.id];
              return (
                <div
                  key={msg.id}
                  className={`flex gap-4 ${isUser ? "flex-row-reverse" : ""}`}
                >
                  {/* avatar */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isUser ? "bg-primary" : "bg-gray-700"
                    }`}
                  >
                    {isUser ? (
                      <User size={18} color="white" />
                    ) : (
                      <Bot size={18} color="white" />
                    )}
                  </div>

                  {/* bubble + actions */}
                  <div
                    className={`flex flex-col gap-1 max-w-[80%] ${
                      isUser ? "items-end" : "items-start"
                    }`}
                  >
                    {/* bubble */}
                    <div
                      className={`w-full px-4 py-3 rounded-2xl text-sm leading-relaxed break-words [overflow-wrap:anywhere] overflow-hidden ${
                        isUser
                          ? "bg-primary text-white rounded-tr-none"
                          : "bg-white dark:bg-gray-800 border dark:border-gray-700 dark:text-gray-100 rounded-tl-none"
                      } ${!isExpanded ? "line-clamp-3" : ""}`}
                    >
                      {msg.content}
                    </div>

                    {/* actions row */}
                    <div className="flex items-center gap-2 text-[11px] text-gray-400">
                      <button
                        onClick={() => handleCopy(msg.content)}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        <Clipboard size={12} />
                        <span>Copy</span>
                      </button>

                      {onEditMessage && (
                        <button
                          onClick={() => onEditMessage(msg)}
                          className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                          <Edit3 size={12} />
                          <span>Edit</span>
                        </button>
                      )}

                      <button
                        onClick={() => toggleExpand(msg.id)}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            <Minimize2 size={12} />
                            <span>Collapse</span>
                          </>
                        ) : (
                          <>
                            <Maximize2 size={12} />
                            <span>Expand</span>
                          </>
                        )}
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
