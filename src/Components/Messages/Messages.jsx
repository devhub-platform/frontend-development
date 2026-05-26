// FloatingMessages.jsx
import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, ArrowLeft, Send, Paperclip } from "lucide-react";
import axiosInstance from "../../config/api";

export function Messages() {
  const [open, setOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);

  // عمل Fetch للمحادثات عند فتح الـ Popup أو تحميل المكون
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/chat/conversations");
        // الـ data راجعة كـ array جوة الريسبونس الرئيسي
        setConversations(response.data.data || []);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // حساب إجمالي الرسائل غير المقروءة (إذا كان الـ API يوفر حقل unread، هنا استخدمنا 0 كـ default)
  const unreadTotal = conversations.reduce(
    (acc, c) => acc + (c.unread_count || 0),
    0,
  );

  return (
    <>
      {/* Floating button - Bottom bar for large screens */}
      {!open && (
        <>
          {/* Large screens: Bottom Right Bar */}
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              setSelectedChat(null);
            }}
            className="fixed bottom-0 right-8 z-50 rounded-t-xl bg-primary w-64 h-12 shadow-xl flex items-center justify-center hover:bg-opacity-90 transition-colors lg:flex hidden"
          >
            <div className="flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
              <span className="ml-2 text-white font-semibold">Messages</span>
            </div>
            {unreadTotal > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                {unreadTotal}
              </span>
            )}
          </button>

          {/* Small/Medium screens: Floating circle button */}
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              setSelectedChat(null);
            }}
            className="fixed bottom-4 right-4 z-50 bg-primary w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:bg-opacity-90 transition-colors lg:hidden"
          >
            <MessageCircle className="w-6 h-6 text-white" />
            {unreadTotal > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {unreadTotal}
              </span>
            )}
          </button>
        </>
      )}

      {/* Popup – Large screens bottom sheet */}
      {open && (
        <>
          {/* Large screens: Positioned Right */}
          <div className="fixed inset-0 z-50 lg:flex hidden items-end justify-end pointer-events-none">
            <div className="mr-8 relative pointer-events-auto">
              <div
                className="origin-bottom-right"
                style={{ animation: "fadeInScale 0.25s ease-out" }}
              >
                <MessagesPopup
                  selectedChat={selectedChat}
                  setSelectedChat={setSelectedChat}
                  onClose={() => setOpen(false)}
                  isLargeScreen={true}
                  conversations={conversations}
                  loading={loading}
                />
              </div>
            </div>
          </div>

          {/* Small/Medium screens: Fullscreen */}
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 z-50 lg:hidden">
              <MessagesPopup
                selectedChat={selectedChat}
                setSelectedChat={setSelectedChat}
                onClose={() => setOpen(false)}
                isLargeScreen={false}
                conversations={conversations}
                loading={loading}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

function MessagesPopup({
  selectedChat,
  setSelectedChat,
  onClose,
  isLargeScreen,
  conversations,
  loading: conversationsLoading,
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null); // ريفرنس للـ Scroll التلقائي

  // استخراج المحادثة النشطة بناءً على الـ id الخارجي
  const activeChat =
    selectedChat != null
      ? conversations.find((c) => c.id === selectedChat) || null
      : null;

  // استخراج الـ ID الحقيقي للـ conversation لتمريره للـ API
  const conversationId = activeChat?.conversation?.id;

  // 1. جلب الرسائل عند تغيير الـ conversationId
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) return;
      setMessagesLoading(true);
      try {
        const response = await axiosInstance.get(
          `/chat/conversations/${conversationId}/messages`,
        );
        // الـ API بيرجع الرسايل من الأحدث للأقدم، بنعكسها للعرض الطبيعي للشات
        const fetchedMessages = response.data.messages.data || [];
        setMessages([...fetchedMessages].reverse());
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setMessagesLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId]);

  // 2. عمل Scroll تلقائي لأسفل المحادثة عند تحميل رسائل جديدة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // دالة مساعدة للحصول على بيانات الطرف الآخر في المحادثة
  const getOtherParticipant = (chat) => {
    if (!chat?.conversation?.participants) return null;
    // استبدلي الرقم 5 بمعرف الحساب الحالي (Auth ID) إذا كان ديناميكياً
    return (
      chat.conversation.participants.find((p) => p.messageable_id !== 5)
        ?.messageable || chat.conversation.participants[0]?.messageable
    );
  };

  const handleSend = () => {
    if (!message.trim()) return;
    // هنا كول الـ API الخاص بإرسال الرسائل لاحقاً
    console.log(
      "Sending message to conversation ID:",
      conversationId,
      "Text:",
      message,
    );

    // بشكل مؤقت: نقدر نضيف الرسالة محلياً للشات لحد ما تربطي الـ POST API
    const newLocalMsg = {
      id: Date.now(),
      body: message,
      is_sender: true,
      created_at: "Just now",
    };
    setMessages((prev) => [...prev, newLocalMsg]);
    setMessage("");
  };

  const handleAttachClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    console.log("selected files:", files);
  };

  // 1. دالة لتنسيق الساعة فقط داخل فقاعة الرسالة (مثال: 09:32 PM)
  const formatMessageTime = (isoString) => {
    if (!isoString) return "";
    const formattedString = isoString.includes(" ")
      ? isoString.replace(" ", "T")
      : isoString;
    const date = new Date(formattedString);
    if (isNaN(date.getTime())) return "";

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // 2. دالة لتنسيق الفاصل الزمني في منتصف الشات (Today, Yesterday, Date)
const formatDividerDate = (isoString) => {
  if (!isoString) return "";
  const formattedString = isoString.includes(" ") ? isoString.replace(" ", "T") : isoString;
  const date = new Date(formattedString);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (messageDate.getTime() === today.getTime()) {
    return "Today";
  } else if (messageDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  } else {
    // تنسيق التاريخ بالشكل المطلوب DD-MM-YYYY
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
};

  return (
    <div
      className={`
        ${isLargeScreen ? "w-96 h-[500px] rounded-t-2xl shadow-2xl border border-gray-200 dark:border-gray-700" : "w-full h-full"}
        bg-white dark:bg-gray-900 overflow-hidden flex flex-col
        ${isLargeScreen ? "origin-bottom-right" : ""}
      `}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-primary shrink-0">
        <div className="flex items-center gap-2">
          {selectedChat != null && (
            <button
              type="button"
              onClick={() => setSelectedChat(null)}
              className="text-white hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <span className="text-white font-semibold">
            {selectedChat != null && activeChat
              ? getOtherParticipant(activeChat)?.name || "Chat"
              : "Messages"}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-white hover:opacity-80 transition-opacity"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat list */}
      {selectedChat == null && (
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-1">
            {conversationsLoading ? (
              <div className="text-center py-4 text-sm text-gray-500">
                Loading chats...
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-4 text-sm text-gray-500">
                No conversations found.
              </div>
            ) : (
              conversations.map((chat) => {
                const otherUser = getOtherParticipant(chat);
                const lastMsg = chat.conversation?.last_message;

                return (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => setSelectedChat(chat.id)}
                    className="w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={
                          otherUser?.avatar_url ||
                          `https://ui-avatars.com/api/?name=${otherUser?.name || "User"}&background=random`
                        }
                        alt={otherUser?.name}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${otherUser?.name || "User"}&background=random`;
                        }}
                      />
                      {chat.unread_count > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                          {chat.unread_count}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {otherUser?.name || "Unknown User"}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {lastMsg?.body || "No messages yet"}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Conversation Window (تحديث الربط الفعلي هنا) */}
      {selectedChat != null && activeChat && (
        <div className="flex-1 flex flex-col min-h-0 bg-gray-50 dark:bg-gray-950">
          <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
            {messagesLoading ? (
              <div className="text-center py-4 text-sm text-gray-500">
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-4 text-sm text-gray-500">
                No messages yet. Say hello!
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe = msg.is_sender;

                // حساب هل نحتاج عرض فاصل التاريخ (اليوم) في النص أم لا
                let showDateDivider = false;
                const currentMessageDate = msg.updated_at
                  ? msg.updated_at.split(" ")[0]
                  : ""; // بيطلع الجزء ده "2026-05-25"

                if (index === 0) {
                  // أول رسالة دايماً بنعرض فوقيها التاريخ
                  showDateDivider = true;
                } else {
                  // مقارنة تاريخ الرسالة الحالية بتاريخ الرسالة السابقة
                  const previousMessageDate = messages[index - 1].updated_at
                    ? messages[index - 1].updated_at.split(" ")[0]
                    : "";
                  if (currentMessageDate !== previousMessageDate) {
                    showDateDivider = true;
                  }
                }

                return (
                  <React.Fragment key={msg.id}>
                    {/* فاصل التاريخ مثل الواتساب (Today / Yesterday / 12-5-2026) */}
                    {showDateDivider && (
                      <div className="flex justify-center my-4 animate-fadeIn">
                        <span className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-3 py-1 rounded-lg shadow-sm font-medium">
                          {formatDividerDate(msg.updated_at)}
                        </span>
                      </div>
                    )}

                    {/* فقاعة الرسالة وبداخلها التوقيت بالساعة فقط */}
                    <div
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`
                max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm
                ${
                  isMe
                    ? "bg-primary text-white rounded-br-none"
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none border border-gray-100 dark:border-gray-700"
                }
              `}
                      >
                        <p className="break-words">{msg.body}</p>

                        {/* الساعة والدقيقة فقط بالأسفل */}
                        <p
                          className={`text-[10px] mt-1 opacity-60 font-sans ${isMe ? "text-right" : "text-left"}`}
                        >
                          {formatMessageTime(msg.updated_at)}
                        </p>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })
            )}
            {/* عنصر الـ Auto Scroll التلقائي */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Field */}
          <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center gap-3">
            <div className="flex flex-1 items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 py-1">
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={handleAttachClick}
                className="text-gray-500 hover:text-primary transition-colors p-1"
              >
                <Paperclip size={20} />
              </button>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 text-gray-900 dark:text-white outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleSend}
              disabled={!message.trim()}
              className="bg-primary text-white p-1.5 rounded-full disabled:opacity-50 hover:scale-105 transition-transform"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}