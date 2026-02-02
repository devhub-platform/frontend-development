import {
  Send,
  Plus,
  Sparkles,
  ChevronDown,
  Check,
  Upload,
  Image,
  FileText,
  Code,
  Video,
  Mic,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function InputArea({
  onSendMessage,
  selectedModel,
  onModelChange,
  variant = "bottom", // "center" | "bottom"
}) {
  const [message, setMessage] = useState("");
  const [showModels, setShowModels] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200,
      )}px`;
    }
  }, [message]);

  const models = ["Qwen 2.5", "Gemini Pro 3", "GPT-4o", "Deepseek V3", "Grok"];

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setMessage("");
    setShowAttach(false);
    setShowModels(false);
  };

  return (
    <div className={`w-full ${variant === "center" ? "max-w-3xl" : ""}`}>
      <div className="w-full bg-white/80 dark:bg-[#0a0e1a]/80 backdrop-blur-md p-2 pb-4 border-t border-gray-200 dark:border-gray-900">
        <div className="max-w-4xl mx-auto relative">
          <div className="bg-white dark:bg-[#0f1419] border dark:border-gray-700 rounded-2xl shadow-lg focus-within:ring-2 focus-within:ring-primary/20 transition-all p-3">
            {/* Row 1: message */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask DevHub AI anything..."
              className="w-full pt-2  bg-transparent dark:text-white resize-none outline-none text-sm  dark-scrollbar max-h-36"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            {/* Row 2: controls */}
            <div className="mt-3 flex items-center justify-between gap-2">
              {/* left: attach */}
              <div className="relative">
                <button
                  onClick={() => setShowAttach((v) => !v)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                >
                  <Plus
                    className={`transition-transform duration-300 ${
                      showAttach ? "rotate-45 text-primary" : ""
                    }`}
                  />
                </button>

                {showAttach && (
                  <div className="absolute bottom-full left-0 mb-3 w-56 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-2xl shadow-2xl p-2 grid grid-cols-2 gap-1 animate-in slide-in-from-bottom-2 duration-200 z-50">
                    {[
                      { icon: Upload, label: "Files", color: "text-blue-500" },
                      {
                        icon: Image,
                        label: "Photos",
                        color: "text-purple-500",
                      },
                      {
                        icon: FileText,
                        label: "Document",
                        color: "text-green-500",
                      },
                      { icon: Code, label: "Snippet", color: "text-amber-500" },
                      { icon: Video, label: "Video", color: "text-red-500" },
                      { icon: Mic, label: "Audio", color: "text-cyan-500" },
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
                      >
                        <item.icon size={20} className={item.color} />
                        <span className="text-[10px] font-medium dark:text-gray-200">
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => console.log(e.target.files?.[0])}
                />
              </div>

              {/* right: model + send */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowModels((v) => !v)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs dark:text-gray-200 border dark:border-gray-700 hover:border-primary/50 transition-all"
                  >
                    <Sparkles
                      size={12}
                      className="text-primary animate-pulse"
                    />
                    {selectedModel}
                    <ChevronDown size={12} />
                  </button>

                  {showModels && (
                    <div className="absolute bottom-full right-0 mb-3 w-52 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
                      {models.map((m) => (
                        <button
                          key={m}
                          onClick={() => {
                            onModelChange(m);
                            setShowModels(false);
                          }}
                          className="w-full flex items-center justify-between p-3 text-xs dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles size={10} className="text-primary" /> {m}
                          </div>
                          {selectedModel === m && (
                            <Check size={12} className="text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="p-2.5 bg-primary text-white rounded-full disabled:opacity-50 hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>

          <p className="mt-3 text-[12px] text-gray-800 dark:text-gray-200 text-center">
            DevHub AI can make mistakes. Review important answers, especially
            code, before using them.
          </p>
        </div>
      </div>
    </div>
  );
}
