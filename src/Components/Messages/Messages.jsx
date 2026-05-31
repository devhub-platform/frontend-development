import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  X,
  ArrowLeft,
  Send,
  Paperclip,
  FileIcon,
  Download,
  Pencil,
  Trash2,
  MoreVertical,
  Circle,
} from "lucide-react";
import Pusher from "pusher-js";
import axiosInstance from "../../config/api";

// ==========================================
// الدوال المساعدة لتنسيق الوقت والتاريخ
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

  if (messageDate.getTime() === today.getTime()) return "Today";
  if (messageDate.getTime() === yesterday.getTime()) return "Yesterday";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// ==========================================
// المكون الرئيسي للمحادثات العائمة
// ==========================================
export function Messages() {
  const [open, setOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);

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
  const [peerLastSeen, setPeerLastSeen] = useState(null);

  const [editingMessage, setEditingMessage] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [isEditingSubmit, setIsEditingSubmit] = useState(false);

  // مجموعة IDs الأعضاء الأونلاين حالياً (من presence channel)
  const onlineMemberIds = useRef(new Set());

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);
  // مرجع لـ Pusher instance علشان نقدر نعمل cleanup صح
  const pusherRef = useRef(null);

  const activeChat = conversations.find((c) => c.id === selectedChat) || null;
  const conversationId = activeChat?.conversation?.id;

  const getOtherParticipant = (chat) => {
    if (!chat?.conversation?.participants) return null;
    return chat.conversation.participants.find(
      (p) => p.messageable?.name !== "Mai Waleed",
    )?.messageable;
  };

  const otherUser = getOtherParticipant(activeChat);
  const peerUserId = otherUser?.id;

  // إغلاق قائمة الخيارات عند الضغط الخارجي
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Heartbeat للتواجد أونلاين + تعليم غير أونلاين عند الخروج
  useEffect(() => {
    const sendHeartbeat = async () => {
      try {
        await axiosInstance.put("/chat/presence/online");
      } catch (e) {
        console.error(e);
      }
    };
    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 4 * 60 * 1000);

    const handleOffline = () => {
      // استخدام navigator.sendBeacon لو متاح (أسرع عند الـ unload)
      try {
        axiosInstance.put("/chat/presence/offline").catch(() => {});
      } catch (_) {}
    };
    window.addEventListener("beforeunload", handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleOffline);
    };
  }, []);

  // جلب الرسائل وحالة المستخدم عند اختيار محادثة
  useEffect(() => {
    const fetchMessagesAndPresence = async () => {
      if (!conversationId || !peerUserId) return;
      setMessagesLoading(true);
      try {
        const msgResponse = await axiosInstance.get(
          `/chat/conversations/${conversationId}/messages`,
        );
        const fetchedMessages = msgResponse.data.messages?.data || [];
        setMessages([...fetchedMessages].reverse());

        const presenceResponse = await axiosInstance.get(
          `/chat/presence/users/${peerUserId}`,
        );
        const presenceData = presenceResponse.data?.data || {};
        setIsPeerOnline(Boolean(presenceData.is_online));
        if (presenceData.last_seen_at)
          setPeerLastSeen(presenceData.last_seen_at);
      } catch (error) {
        console.error(error);
      } finally {
        setMessagesLoading(false);
      }
    };
    fetchMessagesAndPresence();
  }, [conversationId, peerUserId]);

  // ==========================================
  // 🔄 Pusher Realtime - دعم كامل للأحداث الثلاثة
  // ==========================================
  useEffect(() => {
    if (!conversationId) return;

    // تنظيف أي connection قديم قبل إنشاء واحد جديد
    if (pusherRef.current) {
      pusherRef.current.disconnect();
      pusherRef.current = null;
    }

    Pusher.logToConsole = true;

    const authToken = localStorage.getItem("userToken") || "";

    const pusher = new Pusher("8386ec29a087993e4c57", {
      cluster: "mt1",
      authEndpoint: "https://dev-hubs.tech/api/broadcasting/auth",
      auth: {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      },
    });

    pusherRef.current = pusher;

    // دالة مساعدة لفك واستخراج كائن الرسالة بشكل صحيح أياً كان شكل الـ payload
    const extractMessageData = (data) => {
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      return parsed.message?.message || parsed.message || parsed;
    };

    // ---- Channel 1: قناة المحادثة الخاصة ----
    const chatChannel = pusher.subscribe(
      `private-mc-chat-conversation.${conversationId}`,
    );

    // حدث استقبال رسالة جديدة
    chatChannel.bind("Musonza\\Chat\\Eventing\\MessageWasSent", (data) => {
      const newMsg = extractMessageData(data);
      if (!newMsg || !newMsg.id) return;

      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;

        // نجيب الـ user_id من الـ JWT token مباشرة (sub field)
        const currentUserId = (() => {
          try {
            const t = localStorage.getItem("userToken") || "";
            if (t) {
              const payload = JSON.parse(atob(t.split(".")[1]));
              return String(payload.sub || payload.id || payload.user_id || "");
            }
          } catch (_) {}
          return "";
        })();
        if (newMsg.user_id && currentUserId) {
          newMsg.is_sender = String(newMsg.user_id) === String(currentUserId);
        } else {
          newMsg.is_sender = newMsg.sender?.name === "Mai Waleed";
        }

        return [...prev, newMsg];
      });
    });

    // حدث تعديل رسالة - يدعم الاسمين القديم والجديد معاً
    const handleMessageUpdated = (data) => {
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      // بيدعم payload مباشر { id, body } أو مغلف { message: { id, body } }
      const updatedMsg = parsed.message || parsed;
      if (!updatedMsg || !updatedMsg.id) return;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === updatedMsg.id
            ? { ...m, body: updatedMsg.body, updated_at: updatedMsg.updated_at }
            : m,
        ),
      );
    };

    chatChannel.bind("MessageWasUpdated", handleMessageUpdated); // الاسم القديم
    chatChannel.bind("message.updated", handleMessageUpdated); // الاسم الجديد

    // حدث حذف رسالة - يدعم الاسمين القديم والجديد معاً
    const handleMessageDeleted = (data) => {
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      const deletedInfo = parsed.message || parsed;
      if (!deletedInfo || !deletedInfo.id) return;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === deletedInfo.id
            ? {
                ...m,
                is_deleted: true,
                body: "This message was deleted",
                deleted_at: deletedInfo.deleted_at,
              }
            : m,
        ),
      );
    };

    chatChannel.bind("MessageWasDeleted", handleMessageDeleted); // الاسم القديم
    chatChannel.bind("message.deleted", handleMessageDeleted); // الاسم الجديد

    // ---- Channel 2: Presence channel لمعرفة من هو أونلاين ----
    const presenceChannel = pusher.subscribe(
      `presence-mc-chat-presence.${conversationId}`,
    );

    presenceChannel.bind("pusher:subscription_succeeded", (members) => {
      onlineMemberIds.current.clear();
      if (members && typeof members.each === "function") {
        members.each((member) => {
          const id = Number(member.id);
          if (id) onlineMemberIds.current.add(id);
        });
      }
      // تحديث حالة الـ peer بناءً على الأعضاء الحاليين
      if (peerUserId) {
        setIsPeerOnline(onlineMemberIds.current.has(Number(peerUserId)));
      }
    });

    presenceChannel.bind("pusher:member_added", (member) => {
      const id = Number(member.id);
      if (id) onlineMemberIds.current.add(id);
      if (peerUserId && id === Number(peerUserId)) {
        setIsPeerOnline(true);
        setPeerLastSeen(new Date().toISOString());
      }
    });

    presenceChannel.bind("pusher:member_removed", (member) => {
      const id = Number(member.id);
      onlineMemberIds.current.delete(id);
      if (peerUserId && id === Number(peerUserId)) {
        setIsPeerOnline(false);
        setPeerLastSeen(new Date().toISOString());
      }
    });

    // ---- Channel 3: Status channel لأحداث online/offline العامة ----
    const statusChannel = pusher.subscribe("chat.user-status");

    statusChannel.bind("user.online", (data) => {
      const parsedData = typeof data === "string" ? JSON.parse(data) : data;
      if (!peerUserId || Number(parsedData?.id) !== Number(peerUserId)) return;
      setIsPeerOnline(true);
      if (parsedData?.last_seen_at) setPeerLastSeen(parsedData.last_seen_at);
    });

    statusChannel.bind("user.offline", (data) => {
      const parsedData = typeof data === "string" ? JSON.parse(data) : data;
      if (!peerUserId || Number(parsedData?.id) !== Number(peerUserId)) return;
      setIsPeerOnline(false);
      if (parsedData?.last_seen_at) setPeerLastSeen(parsedData.last_seen_at);
    });

    // Clean up لمنع الـ Memory Leaks وتكرار الـ Connections
    return () => {
      chatChannel.unbind_all();
      presenceChannel.unbind_all();
      statusChannel.unbind_all();
      pusher.unsubscribe(`private-mc-chat-conversation.${conversationId}`);
      pusher.unsubscribe(`presence-mc-chat-presence.${conversationId}`);
      pusher.unsubscribe("chat.user-status");
      pusher.disconnect();
      pusherRef.current = null;
    };
  }, [conversationId, peerUserId]);

  useEffect(() => {
    if (!editingMessage) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, editingMessage]);

  // ----------------------------------------------------
  // دالة الإرسال / التعديل
  // ----------------------------------------------------
  const handleSend = async () => {
    if (!message.trim() || !conversationId) return;

    const textToSend = message;
    setMessage("");

    if (editingMessage) {
      const targetMessageId = editingMessage.id;
      const editFormData = new FormData();
      editFormData.append("message", textToSend);
      setEditingMessage(null);
      setIsEditingSubmit(true);

      try {
        const response = await axiosInstance.put(
          `/messages/${targetMessageId}/conversation/${conversationId}`,
          editFormData,
        );
        if (response.data?.data) {
          const updatedMsg = response.data.data;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === targetMessageId
                ? {
                    ...m,
                    body: updatedMsg.body,
                    updated_at: updatedMsg.updated_at,
                  }
                : m,
            ),
          );
        }
      } catch (error) {
        console.error(error);
        setMessage(textToSend);
      } finally {
        setIsEditingSubmit(false);
      }
    } else {
      const formData = new FormData();
      formData.append("message", textToSend);
      formData.append("type", "text");

      try {
        const response = await axiosInstance.post(
          `/messages/conversation/${conversationId}/send`,
          formData,
        );
        if (response.data?.data) {
          const createdMsg = response.data.data;
          createdMsg.is_sender = true;
          setMessages((prev) => [...prev, createdMsg]);
        }
      } catch (error) {
        console.error(error);
        setMessage(textToSend);
      }
    }
  };

  // ----------------------------------------------------
  // دالة حذف الرسالة
  // ----------------------------------------------------
  const handleDeleteMessage = async (msgId) => {
    setActiveMenuId(null);
    setIsDeletingId(msgId);
    try {
      const response = await axiosInstance.delete(
        `/messages/${msgId}/conversation/${conversationId}`,
      );
      if (response.status === 200 || response.data) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId
              ? { ...m, is_deleted: true, body: "This message was deleted" }
              : m,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleStartEdit = (msg) => {
    setActiveMenuId(null);
    setEditingMessage(msg);
    setMessage(msg.body);
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !conversationId) return;

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);
    if (message.trim()) formData.append("message", message.trim());

    const currentText = message;
    setMessage("");

    try {
      const response = await axiosInstance.post(
        `/messages/conversation/${conversationId}/send-attachment`,
        formData,
      );
      if (response.data?.data) {
        const { attachment, text } = response.data.data;
        const updates = [];
        if (attachment) {
          attachment.is_sender = true;
          updates.push(attachment);
        }
        if (text && currentText.trim()) {
          text.is_sender = true;
          updates.push(text);
        }
        if (updates.length > 0) setMessages((prev) => [...prev, ...updates]);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error(error);
      setMessage(currentText);
    }
  };

  const isImageFile = (url, fileName) => {
    const testString = (url || fileName || "").toLowerCase();
    return (
      testString.endsWith(".png") ||
      testString.endsWith(".jpg") ||
      testString.endsWith(".jpeg") ||
      testString.endsWith(".gif") ||
      testString.endsWith(".webp")
    );
  };

  // تنسيق آخر ظهور
  const formatLastSeen = (isoString) => {
    if (!isoString) return "";
    const date = new Date(
      isoString.includes(" ") ? isoString.replace(" ", "T") : isoString,
    );
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
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
            {/* ✅ مؤشر الحالة أونلاين/أوفلاين */}
            {selectedChat != null && (
              <span className="flex items-center gap-1 text-white/80 text-[10px]">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${isPeerOnline ? "bg-green-400" : "bg-gray-400"}`}
                />
                {isPeerOnline
                  ? "Online"
                  : peerLastSeen
                    ? `Last seen ${formatLastSeen(peerLastSeen)}`
                    : "Offline"}
              </span>
            )}
          </div>
        </div>
        <button type="button" onClick={onClose} className="text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* قائمة المحادثات */}
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

      {/* منطقة الشات */}
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
                const isDeleted = Boolean(
                  msg.is_deleted || msg.body === "This message was deleted",
                );

                let showDateDivider = false;
                const currentMessageDate = msg.updated_at
                  ? msg.updated_at.split(" ")[0]
                  : "";
                if (index === 0) showDateDivider = true;
                else {
                  const previousMessageDate = messages[index - 1].updated_at
                    ? messages[index - 1].updated_at.split(" ")[0]
                    : "";
                  if (currentMessageDate !== previousMessageDate)
                    showDateDivider = true;
                }

                const fileUrl = msg.file_url || msg.data?.file_url || "";
                const fileName = msg.data?.file_name || "Attachment";
                const isAttachment =
                  msg.type === "attachment" || fileUrl !== "";

                return (
                  <React.Fragment key={msg.id || index}>
                    {showDateDivider && (
                      <div className="flex justify-center my-4">
                        <span className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-3 py-1 rounded-lg font-medium shadow-sm">
                          {formatDividerDate(msg.updated_at || msg.created_at)}
                        </span>
                      </div>
                    )}

                    <div
                      className={`flex items-center gap-1 group relative ${isMe ? "justify-end flex-row" : "justify-start"}`}
                    >
                      {isMe && !isDeleted && (
                        <div className="relative">
                          {isDeletingId === msg.id ? (
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin m-1" />
                          ) : (
                            <button
                              type="button"
                              disabled={isDeletingId !== null}
                              onClick={() =>
                                setActiveMenuId(
                                  activeMenuId === msg.id ? null : msg.id,
                                )
                              }
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                            >
                              <MoreVertical size={16} />
                            </button>
                          )}

                          {activeMenuId === msg.id && (
                            <div
                              ref={menuRef}
                              className="absolute right-0 bottom-6 z-30 w-28 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-1 animate-fade-in"
                            >
                              {!isAttachment && (
                                <button
                                  type="button"
                                  onClick={() => handleStartEdit(msg)}
                                  className="w-full px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                >
                                  <Pencil size={12} className="text-blue-500" />
                                  Edit
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="w-full px-3 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2"
                              >
                                <Trash2 size={12} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl p-2 text-sm shadow-sm relative ${
                          isDeleted
                            ? "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 italic rounded-2xl border border-gray-300 dark:border-gray-700"
                            : isMe
                              ? "bg-primary text-white rounded-br-none"
                              : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none border border-gray-100 dark:border-gray-700"
                        }`}
                      >
                        {isDeleted ? (
                          <div className="px-2 py-0.5 flex items-center gap-1.5 opacity-80">
                            <Trash2 size={12} className="opacity-60" />
                            <span>This message was deleted</span>
                          </div>
                        ) : isAttachment ? (
                          isImageFile(fileUrl, fileName) ? (
                            <div className="relative rounded-lg overflow-hidden group/img max-w-[240px]">
                              <img
                                src={fileUrl}
                                alt={fileName}
                                className="w-full h-auto max-h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => window.open(fileUrl, "_blank")}
                              />
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                download
                                className="absolute bottom-2 right-2 bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity"
                              >
                                <Download size={14} />
                              </a>
                            </div>
                          ) : (
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              download
                              className={`flex items-center gap-3 p-2 rounded-xl border ${
                                isMe
                                  ? "bg-white/10 border-white/20 text-white"
                                  : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                              } hover:opacity-95 transition-opacity`}
                            >
                              <div
                                className={`p-2 rounded-lg ${isMe ? "bg-white/20" : "bg-primary/10 text-primary"}`}
                              >
                                <FileIcon size={20} />
                              </div>
                              <div className="flex-1 min-w-0 pr-4">
                                <p className="text-xs font-medium truncate">
                                  {fileName}
                                </p>
                                <p className="text-[10px] opacity-60">
                                  Click to download
                                </p>
                              </div>
                              <Download
                                size={16}
                                className="shrink-0 opacity-70"
                              />
                            </a>
                          )
                        ) : (
                          <div className="px-2 py-0.5">
                            <p className="break-words">{msg.body}</p>
                          </div>
                        )}

                        {!isDeleted && (
                          <div className="flex items-center gap-1 justify-end mt-1 px-2 opacity-60 text-[10px] font-sans">
                            <span>
                              {formatMessageTime(
                                msg.updated_at || msg.created_at,
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* شريط حالة التعديل */}
          {editingMessage && (
            <div className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between animate-fade-in shrink-0">
              <div className="flex items-center gap-2 text-primary text-xs font-medium">
                {isEditingSubmit ? (
                  <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Pencil size={12} />
                )}
                <span className="truncate max-w-[260px]">
                  {isEditingSubmit ? (
                    "Updating message..."
                  ) : (
                    <>
                      Editing:{" "}
                      <span className="text-gray-500 dark:text-gray-400 font-normal">
                        {editingMessage.body}
                      </span>
                    </>
                  )}
                </span>
              </div>
              {!isEditingSubmit && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingMessage(null);
                    setMessage("");
                  }}
                  className="text-gray-400 hover:text-red-500 p-0.5"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}

          {/* حقل الإدخال */}
          <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center gap-3">
            <div className="flex flex-1 items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 py-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,application/pdf,application/zip,.doc,.docx"
                disabled={!!editingMessage}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-500 hover:text-primary p-1 disabled:opacity-30"
                disabled={!!editingMessage || isEditingSubmit}
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
                placeholder={
                  editingMessage ? "Edit message..." : "Type a message..."
                }
                disabled={isEditingSubmit}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 outline-none text-gray-900 dark:text-white disabled:opacity-60"
              />
            </div>
            <button
              type="button"
              onClick={handleSend}
              disabled={!message.trim() || isEditingSubmit}
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
