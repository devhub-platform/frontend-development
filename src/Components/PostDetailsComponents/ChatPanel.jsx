import { X, Sparkles, Send } from "lucide-react"; // غيرت MessageCircle لـ Send كشكل أفضل
import { motion, AnimatePresence } from "motion/react";
import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";

export function ChatPanel({ isOpen, onClose }) {
  const postId = 101;
  const { userData } = useContext(UserContext);
  const token = localStorage.getItem("userToken");

  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      text: "Hi! I can help you understand this article better. How Can I Help You?",
      sender: "assistant",
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
    };

    // 1. أضف رسالة اليوزر للشاشة فوراً
    setMessages((prev) => [...prev, userMsg]);
    const messageToSend = inputValue;
    setInputValue(""); // فضي الـ input
    setIsLoading(true);

    try {
      const response = await axios.post(
        `http://devhub.eu-north-1.elasticbeanstalk.com/api/v1/posts/${postId}/ai-chat`,
        { message: messageToSend }, // الـ attribute المطلوب
        {
          headers: {
            Authorization: `Bearer ${token}`, // تأكد أن التوكن مبعوت صح
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        const aiMsg = {
          id: response.data.session_id || Date.now() + 1,
          text: response.data.content, // الـ content اللي راجع من الـ API
          sender: "assistant",
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: "err",
          text: "Sorry, something went wrong. Please try again.",
          sender: "assistant",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Desktop */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="hidden lg:flex flex-col w-105 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-lg sticky top-17 h-[calc(100vh-80px)]"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 mx-2">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-text-light dark:text-text-dark" />
            <span className="font-medium dark:text-white">AI Assistant</span>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full shrink-0"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${
                  m.sender === "user"
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-2xl text-xs animate-pulse dark:text-gray-400">
                AI is thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask anything..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-full text-gray-900 outline-0 border-2 border-transparent dark:text-gray-100 focus-within:border-gray-300 dark:focus-within:border-gray-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className={`py-3 px-4 rounded-full transition-all flex items-center justify-center ${
              isLoading
                ? "bg-gray-400"
                : "bg-primary hover:bg-text-light dark:hover:bg-blue-800 text-white shadow-md"
            }`}
          >
            <Send className="w-5 h-5"/>
          </button>
        </div>
      </motion.div>

      {/* Mobile logic here - same structure */}
    </>
  );
}
