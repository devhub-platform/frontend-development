/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Send,
  Loader2,
  Bot,
  User,
  RotateCcw,
  MessageSquare,
  X,
} from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import remarkGfm from "remark-gfm";
import { sendAIChatMessage } from "../../services/qaApi";
import toast from "react-hot-toast";

export function QuestionAIChat({ questionId }) {
  const [isOpen, setIsOpen] = useState(false); // ستيت للتحكم في فتح وقفل الشات
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const chatEndRef = useRef(null);
  const STORAGE_KEY = `devhub_ai_chat_q_${questionId}`;

  // لقط الـ Session والتاريخ القديم عند فتح المكون
  useEffect(() => {
    const savedChat = localStorage.getItem(STORAGE_KEY);
    if (savedChat) {
      try {
        const { savedSessionId, savedMessages } = JSON.parse(savedChat);
        setSessionId(savedSessionId);
        setMessages(savedMessages || []);
      } catch (e) {
        console.error("Error loading cached AI Chat", e);
      }
    } else {
      setMessages([
        {
          sender: "ai",
          text: "Hello! I am your DevHub AI Assistant. Ask me to summarize this question, analyze the solutions, or write a clean POC snippet based on the discussion!",
        },
      ]);
    }
  }, [questionId, STORAGE_KEY]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMessage = inputValue.trim();
    const updatedMessages = [
      ...messages,
      { sender: "user", text: userMessage },
    ];

    setMessages(updatedMessages);
    setInputValue("");
    setLoading(true);

    try {
      const res = await sendAIChatMessage(questionId, userMessage, sessionId);
      if (res?.success) {
        const aiResponse = { sender: "ai", text: res.content };
        const finalMessages = [...updatedMessages, aiResponse];

        setMessages(finalMessages);
        setSessionId(res.session_id);

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            savedSessionId: res.session_id,
            savedMessages: finalMessages,
          }),
        );
      }
    } catch (err) {
      toast.error("Failed to fetch response from DevHub AI.");
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = (e) => {
    e.stopPropagation();
    localStorage.removeItem(STORAGE_KEY);
    setSessionId(null);
    setMessages([
      {
        sender: "ai",
        text: "Session reset. How can I help you analyze this discussion from scratch?",
      },
    ]);
    toast.success("Chat history cleared.");
  };

  return (
    <div className="fixed bottom-6 right-6 z-100 font-sans">
      {/* 🔴 أولاً: زر الأيقونة العائمة (يظهر فقط عندما يكون الشات مغلقاً) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer relative group "
        >
          <Sparkles className="w-6 h-6 text-amber-300 fill-current" />
          <span className="absolute right-full mr-3 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-bold shadow-md">
            Ask DevHub AI ✨
          </span>
        </button>
      )}

      {/* 🔴 ثانياً: شندوق الشات المنبثق (يفتح بقفل وانسيابية شيك جداً) */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-96 h-125 bg-white dark:bg-bg-primary-dark rounded-3xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 bg-slate-50 dark:bg-bg-secondary-dark border-b dark:border-gray-700 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-primary dark:text-text-dark font-black text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-500 fill-current" />
              <span>DevHub AI Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 1 && (
                <button
                  type="button"
                  onClick={handleResetChat}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/5 transition-all cursor-pointer"
                  title="Reset Chat"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
              {/* زرار القفل الـ X */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Container Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 dark-scrollbar bg-slate-50/30 dark:bg-[#0b0f19]/20">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs ${msg.sender === "user" ? "bg-primary text-white" : "bg-amber-500 text-white shadow-sm"}`}
                >
                  {msg.sender === "user" ? (
                    <User className="w-3.5 h-3.5" />
                  ) : (
                    <Bot className="w-3.5 h-3.5" />
                  )}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-primary text-white rounded-tr-none font-medium"
                      : "bg-white dark:bg-bg-secondary-dark border border-gray-150 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none shadow-xs"
                  }`}
                >
                  {msg.sender === "user" ? (
                    msg.text
                  ) : (
                    /* 🔴 تم تعديل ريندر الـ AI عشان يقرأ المارك داون وينسق الجمل ويخفي الرموز تماماً لليوزر */
                    <div
                      className="prose prose-xs max-w-none dark:prose-invert text-inherit leading-relaxed"
                      data-color-mode="light"
                    >
                      <MDEditor.Markdown
                        source={msg.text}
                        previewOptions={{ remarkPlugins: [remarkGfm] }}
                        style={{
                          backgroundColor: "transparent",
                          color: "inherit",
                          fontSize: "13px",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loader */}
            {loading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white dark:bg-bg-secondary-dark border border-gray-150 dark:border-gray-700 rounded-2xl rounded-tl-none p-3 shadow-xs text-xs text-gray-400 font-medium flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 text-primary" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form bar input */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t dark:border-gray-700 bg-white dark:bg-bg-primary-dark flex gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask AI about this question..."
              disabled={loading}
              className="flex-1 bg-slate-50 dark:bg-bg-secondary-dark border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-primary transition-colors text-gray-900 dark:text-white disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="p-2 bg-primary text-white rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
