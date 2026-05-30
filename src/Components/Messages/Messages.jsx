import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, ArrowLeft, Send, Paperclip } from "lucide-react";
import Pusher from "pusher-js";
import axiosInstance from "../../config/api";

// ==========================================
// الدوال المساعدة لتنسيق الوقت بستايل الواتساب
// ==========================================
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

const formatDividerDate = (isoString) => {
  if (!isoString) return "";
  const formattedString = isoString.includes(" ")
    ? isoString.replace(" ", "T")
    : isoString;
  const date = new Date(formattedString);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
  );
  const messageDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  if (messageDate.getTime() === today.getTime()) {
    return "Today";
  } else if (messageDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  } else {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
};

// ==========================================
// المكون الرئيسي للمحادثات العائمة
// ==========================================
export function Messages() {
  const [open, setOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);

  // جلب المحادثات عند تحميل المكون
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/chat/conversations");
        setConversations(response.data.data || []);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const unreadTotal = conversations.reduce(
    (acc, c) => acc + (c.unread_count || 0),
    0,
  );

  return (
    <>
      {/* Floating button - Large Screens */}
      {!open && (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setSelectedChat(null);
          }}
          className="fixed bottom-0 right-8 z-50 rounded-t-xl bg-primary w-64 h-12 shadow-xl flex items-center justify-center hover:bg-opacity-90 transition-colors lg:flex hidden"
        >
          <MessageCircle className="w-5 h-5 text-white" />
          <span className="ml-2 text-white font-semibold">Messages</span>
          {unreadTotal > 0 && (
            <span className="ml-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md">
              {unreadTotal}
            </span>
          )}
        </button>
      )}

      {/* Floating button - Mobile Screens */}
      {!open && (
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
      )}

      {/* Popup Window */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end pointer-events-none lg:p-8">
          <div className="w-full h-full lg:w-96 lg:h-[500px] pointer-events-auto">
            <MessagesPopup
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              onClose={() => setOpen(false)}
              conversations={conversations}
              loading={loading}
            />
          </div>
        </div>
      )}
    </>
  );
}

// ==========================================
// مكون النافذة الداخلية للمحادثات والرسائل
// ==========================================
function MessagesPopup({
  selectedChat,
  setSelectedChat,
  onClose,
  conversations,
  loading: conversationsLoading,
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [isPeerOnline, setIsPeerOnline] = useState(false);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const activeChat = conversations.find((c) => c.id === selectedChat) || null;
  const conversationId = activeChat?.conversation?.id;

  // فحص واستخراج بيانات الطرف الآخر ديناميكياً بدون رقم تعريفي ثابت
  const getOtherParticipant = (chat) => {
    if (!chat?.conversation?.participants) return null;
    return chat.conversation.participants.find(
      (p) => p.messageable?.name !== "Mai Waleed",
    )?.messageable;
  };

  const otherUser = getOtherParticipant(activeChat);
  const peerUserId = otherUser?.id;

  // ----------------------------------------------------
  // 1. نظام الـ Heartbeat (الحفاظ على حالة المستخدم Online)
  // ----------------------------------------------------
  useEffect(() => {
    const sendHeartbeat = async () => {
      try {
        await axiosInstance.put("/chat/presence/online");
      } catch (error) {
        console.error("Heartbeat failed:", error);
      }
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 4 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // ----------------------------------------------------
  // 2. جلب الرسائل وحالة الـ Presence البدئية عند فتح الشات
  // ----------------------------------------------------
  useEffect(() => {
    const fetchMessagesAndPresence = async () => {
      if (!conversationId || !peerUserId) return;
      setMessagesLoading(true);
      try {
        // أ. جلب الرسائل من السيرفر
        const msgResponse = await axiosInstance.get(
          `/chat/conversations/${conversationId}/messages`,
        );
        const fetchedMessages = msgResponse.data.messages?.data || [];
        setMessages([...fetchedMessages].reverse());

        // ب. جلب حالة المستخدم الآخر الحالية
        const presenceResponse = await axiosInstance.get(
          `/chat/presence/users/${peerUserId}`,
        );
        setIsPeerOnline(Boolean(presenceResponse.data?.data?.is_online));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setMessagesLoading(false);
      }
    };

    fetchMessagesAndPresence();
  }, [conversationId, peerUserId]);

  // ----------------------------------------------------
  // 3. ربط الـ Sockets الفعلي (Pusher) للـ Realtime
  // ----------------------------------------------------
  useEffect(() => {
    if (!conversationId) return;

    const pusher = new Pusher("8386ec29a087993e4c57", {
      cluster: "mt1",
      authEndpoint: "https://dev-hubs.tech/api/broadcasting/auth",
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      },
    });

    const chatChannel = pusher.subscribe(
      `private-mc-chat-conversation.${conversationId}`,
    );

    chatChannel.bind("Musonza\\Chat\\Eventing\\MessageWasSent", (data) => {
      const parsedData = typeof data === "string" ? JSON.parse(data) : data;
      const newIncomingMessage = parsedData.message || parsedData;

      setMessages((prev) => {
        if (prev.some((m) => m.id === newIncomingMessage.id)) return prev;
        return [...prev, newIncomingMessage];
      });
    });

    const statusChannel = pusher.subscribe("chat.user-status");

    statusChannel.bind("user.online", (data) => {
      if (Number(data?.id) === peerUserId) {
        setIsPeerOnline(true);
      }
    });

    statusChannel.bind("user.offline", (data) => {
      if (Number(data?.id) === peerUserId) {
        setIsPeerOnline(false);
      }
    });

    return () => {
      chatChannel.unbind_all();
      statusChannel.unbind_all();
      pusher.unsubscribe(`private-mc-chat-conversation.${conversationId}`);
      pusher.unsubscribe("chat.user-status");
    };
  }, [conversationId, peerUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ----------------------------------------------------
  // 4. دالة إرسال الرسائل النصية للـ API كـ form-data
  // ----------------------------------------------------
  const handleSend = async () => {
    if (!message.trim() || !conversationId) return;

    const textToSend = message;
    setMessage("");

    const formData = new FormData();
    formData.append("message", textToSend);
    formData.append("type", "text");

    try {
      const response = await axiosInstance.post(
        `/messages/conversation/${conversationId}/send`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // دمج الرسالة الجديدة في الـ UI فوراً لتجربة سريعة وسلسة
      if (response.data?.data) {
        const createdMsg = response.data.data;
        createdMsg.is_sender = true; 
        setMessages((prev) => [...prev, createdMsg]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessage(textToSend);
    }
  };

  // دالة إرسال المرفقات (الملفات)
  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !conversationId) return;

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axiosInstance.post(
        `/messages/conversation/${conversationId}/send-attachment`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send attachment:", error);
    }
  };

  return (
    <div className="w-full h-full bg-white dark:bg-gray-900 lg:rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-primary shrink-0">
        <div className="flex items-center gap-2">
          {selectedChat != null && (
            <button
              type="button"
              onClick={() => setSelectedChat(null)}
              className="text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex flex-col">
            <span className="text-white font-semibold text-sm">
              {selectedChat != null && otherUser ? otherUser.name : "Messages"}
            </span>
            {selectedChat != null && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-2 h-2 rounded-full ${isPeerOnline ? "bg-emerald-400 animate-pulse" : "bg-gray-400"}`}
                ></span>
                <span className="text-[10px] text-white/80 font-medium">
                  {isPeerOnline ? "online" : "offline"}
                </span>
              </div>
            )}
          </div>
        </div>
        <button type="button" onClick={onClose} className="text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* القائمة الجانبية للمحادثات */}
      {selectedChat == null && (
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
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
              const u = getOtherParticipant(chat);
              return (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className="w-full flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                >
                  <img
                    src={
                      u?.avatar_url ||
                      `https://ui-avatars.com/api/?name=${u?.name || "User"}&background=random`
                    }
                    className="w-11 h-11 rounded-full object-cover shrink-0"
                    alt=""
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {u?.name}
                      </p>
                      {chat.unread_count > 0 && (
                        <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full">
                          {chat.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {chat.conversation?.last_message?.body ||
                        "No messages yet"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}

      {/* واجهة الشات الحقيقي بستايل الواتساب */}
      {selectedChat != null && activeChat && (
        <div className="flex-1 flex flex-col min-h-0 bg-gray-50 dark:bg-gray-950">
          <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
            {messagesLoading ? (
              <div className="text-center py-4 text-sm text-gray-500">
                Loading messages...
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe = Boolean(msg.is_sender);

                let showDateDivider = false;
                const currentMessageDate = msg.updated_at
                  ? msg.updated_at.split(" ")[0]
                  : "";

                if (index === 0) {
                  showDateDivider = true;
                } else {
                  const previousMessageDate = messages[index - 1].updated_at
                    ? messages[index - 1].updated_at.split(" ")[0]
                    : "";
                  if (currentMessageDate !== previousMessageDate) {
                    showDateDivider = true;
                  }
                }

                return (
                  <React.Fragment key={msg.id || index}>
                    {/* الفاصل الزمني في المنتصف */}
                    {showDateDivider && (
                      <div className="flex justify-center my-4">
                        <span className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-3 py-1 rounded-lg font-medium shadow-sm">
                          {formatDividerDate(msg.updated_at)}
                        </span>
                      </div>
                    )}

                    {/* فقاعة الرسالة */}
                    <div
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${isMe ? "bg-primary text-white rounded-br-none" : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none border border-gray-100 dark:border-gray-700"}`}
                      >
                        {msg.type === "attachment" || msg.file_url ? (
                          <a
                            href={msg.file_url || msg.data?.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-500 underline inline-flex items-center gap-1"
                          >
                            📎 {msg.body || "Attachment"}
                          </a>
                        ) : (
                          <p className="break-words">{msg.body}</p>
                        )}
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
            <div ref={messagesEndRef} />
          </div>

          {/* منطقة حقل الإدخال والإرسال */}
          <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center gap-3">
            <div className="flex flex-1 items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 py-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-500 hover:text-primary p-1"
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
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 outline-none text-gray-900 dark:text-white"
              />
            </div>
            <button
              type="button"
              onClick={handleSend}
              disabled={!message.trim()}
              className="bg-primary text-white p-1.5 rounded-full disabled:opacity-50 transition-transform hover:scale-105"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}