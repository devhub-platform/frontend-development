// src/pages/AIChat/AIChat.jsx
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Menu, X, PanelLeftClose, PanelLeft } from "lucide-react";
import Sidebar from "../../Components/AIChat/Sidebar";
import ChatArea from "../../Components/AIChat/ChatArea";
import InputArea from "../../Components/AIChat/InputArea";
import {
  fetchModels,
  fetchSessions,
  fetchSessionDetail,
  createSession,
  deleteSession,
  pinSession,
  unpinSession,
  updateSessionTitle,
  sendMessage,
} from "../../services/aiChatApi";

export default function AIChat() {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [models, setModels] = useState([]);
  const [defaultModelId, setDefaultModelId] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  // Sidebar: open on desktop by default, closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pendingAttachment, setPendingAttachment] = useState(null);

  const currentChat = chats.find((c) => c.id === currentChatId) || null;
  const hasMessages = (currentChat?.messages?.length || 0) > 0;

  const sortChats = (list) =>
    [...list].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      const aTime = new Date(a.updated_at || a.created_at || 0).getTime();
      const bTime = new Date(b.updated_at || b.created_at || 0).getTime();
      return bTime - aTime;
    });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const modelsRes = await fetchModels();
        setDefaultModelId(modelsRes.default || null);
        setModels(modelsRes.models || []);
        if (!selectedModel && modelsRes.default) {
          setSelectedModel(modelsRes.default);
        }

        const sessions = await fetchSessions();
        const mapped = sessions.map((s) => ({
          id: s.id,
          title: s.title,
          model: s.model,
          model_title: s.model_title || s.model,
          pinned: s.pinned || false,
          message_count: s.message_count || 0,
          created_at: s.created_at,
          updated_at: s.updated_at,
          last_message: "",
          messages: [],
        }));
        setChats(sortChats(mapped));

        const savedId = localStorage.getItem("aiChat_currentSessionId");
        if (savedId) {
          const exists = mapped.find((s) => String(s.id) === String(savedId));
          if (exists) {
            setCurrentChatId(exists.id);
            setSelectedModel(
              exists.model || modelsRes.default || selectedModel,
            );
            const detail = await fetchSessionDetail(exists.id);
            const fullMessages = detail.messages || [];
            setChats((prev) =>
              sortChats(
                prev.map((c) =>
                  c.id === exists.id
                    ? {
                        ...c,
                        messages: fullMessages,
                        message_count: fullMessages.length,
                        updated_at: detail.session?.updated_at || c.updated_at,
                      }
                    : c,
                ),
              ),
            );
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (currentChatId) {
      localStorage.setItem("aiChat_currentSessionId", currentChatId);
    } else {
      localStorage.removeItem("aiChat_currentSessionId");
    }
  }, [currentChatId]);

  const handleNewChat = async () => {
    const useModel = selectedModel || defaultModelId;
    const res = await createSession({ title: "New chat", model: useModel });
    const newSession = {
      id: res.id,
      title: res.title,
      model: res.model,
      model_title: models.find((m) => m.id === res.model)?.title || res.model,
      pinned: false,
      messages: [],
      message_count: 0,
      last_message: "",
      created_at: res.created_at || new Date().toISOString(),
      updated_at: res.created_at || new Date().toISOString(),
    };
    setChats((prev) => sortChats([newSession, ...prev]));
    setCurrentChatId(res.id);
    return res.id;
  };

  const handleSelectChat = async (chat) => {
    setCurrentChatId(chat.id);
    setSelectedModel(chat.model || selectedModel || defaultModelId);

    if (!chat.messages || chat.messages.length === 0) {
      try {
        const detail = await fetchSessionDetail(chat.id);
        const fullMessages = detail.messages || [];
        setChats((prev) =>
          sortChats(
            prev.map((c) =>
              c.id === chat.id
                ? {
                    ...c,
                    messages: fullMessages,
                    message_count: fullMessages.length,
                    updated_at: detail.session?.updated_at || c.updated_at,
                  }
                : c,
            ),
          ),
        );
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handlePinChat = async (id, pinned) => {
    try {
      if (pinned) await unpinSession(id);
      else await pinSession(id);
      setChats((prev) =>
        sortChats(
          prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)),
        ),
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleRenameChat = async (id, newTitle) => {
    try {
      await updateSessionTitle(id, newTitle);
      setChats((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c)),
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteChat = async (id) => {
    try {
      await deleteSession(id);
      setChats((prev) => prev.filter((c) => c.id !== id));
      if (currentChatId === id) setCurrentChatId(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleShareChat = () => {
    alert("Chat shared successfully! (UI only)");
  };

  const handleSendMessage = async (content) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    try {
      setSending(true);

      let activeId = currentChatId;
      if (!activeId) {
        activeId = await handleNewChat();
      }

      const chat = chats.find((c) => c.id === activeId);
      const modelToUse = chat?.model || selectedModel || defaultModelId;

      const userMessageId = Date.now().toString();
      const userMsg = { id: userMessageId, role: "user", content: trimmed };

      let attachmentIds = [];
      if (pendingAttachment) {
        userMsg.attachment = {
          id: pendingAttachment.attachment_id ?? pendingAttachment.id ?? null,
          url: pendingAttachment.url ?? "",
          filename:
            pendingAttachment.filename ??
            pendingAttachment.name ??
            "Attachment",
          type: pendingAttachment.mime_type ?? pendingAttachment.type ?? "",
        };
        if (pendingAttachment.attachment_id || pendingAttachment.id) {
          attachmentIds.push(
            pendingAttachment.attachment_id ?? pendingAttachment.id,
          );
        }
      }

      setChats((prevChats) =>
        sortChats(
          prevChats.map((c) =>
            c.id === activeId
              ? {
                  ...c,
                  messages: [...(c.messages || []), userMsg],
                  message_count: (c.message_count || 0) + 1,
                  last_message: userMsg.content,
                  updated_at: new Date().toISOString(),
                }
              : c,
          ),
        ),
      );
      setCurrentChatId(activeId);

      const newTitle = trimmed.slice(0, 40);
      if (!chat || !chat.title || chat.title === "New chat") {
        try {
          await updateSessionTitle(activeId, newTitle);
        } catch (e) {
          console.error(e);
        }
        setChats((prev) =>
          prev.map((c) => (c.id === activeId ? { ...c, title: newTitle } : c)),
        );
      }

      const res = await sendMessage({
        message: trimmed,
        sessionId: activeId,
        model: modelToUse,
        attachmentIds,
      });

      const aiText = res.text || "No response";
      const aiMsgId = (Date.now() + 1).toString();

      setChats((prevChats) =>
        sortChats(
          prevChats.map((c) =>
            c.id === res.session_id || c.id === activeId
              ? {
                  ...c,
                  model: c.model || res.model_used || modelToUse,
                  messages: [
                    ...(c.messages || []),
                    { id: aiMsgId, role: "assistant", content: aiText },
                  ],
                  message_count: (c.message_count || 0) + 1,
                  last_message: aiText.slice(0, 100),
                  updated_at: new Date().toISOString(),
                }
              : c,
          ),
        ),
      );

      setPendingAttachment(null);
    } catch (e) {
      console.error(e);
      alert("Error sending message");
    } finally {
      setSending(false);
    }
  };

  const currentModelMeta =
    models.find((m) => m.id === selectedModel) ||
    models.find((m) => m.id === defaultModelId) ||
    null;

  const canUseAttachment = !!currentModelMeta?.vision;

  return (
    <div className="flex h-[90vh] dark:bg-[#0a0e1a] overflow-hidden">
      {/* ─── Desktop sidebar (collapsible) ─── */}
      <div
        className={`hidden md:flex flex-col transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0"
        } overflow-hidden shrink-0`}
      >
        <Sidebar
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          onRenameChat={handleRenameChat}
          onShareChat={handleShareChat}
          onPinChat={(id) => {
            const chat = chats.find((c) => c.id === id);
            handlePinChat(id, chat?.pinned);
          }}
          isMobile={false}
          onCloseMobile={() => {}}
        />
      </div>

      {/* ─── Main chat area ─── */}
      <div className="flex-1 flex flex-col relative min-h-0 min-w-0">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 pt-3 pb-2 border-b border-gray-200/60 dark:border-gray-800/50 bg-white/80 dark:bg-[#0a0e1a]/80 backdrop-blur-sm shrink-0">
          {/* Toggle sidebar button */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-all hover:text-gray-800 dark:hover:text-gray-200"
            title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="w-5 h-5" />
            ) : (
              <PanelLeft className="w-5 h-5" />
            )}
          </button>

          {/* Chat title / breadcrumb */}
          <div className="flex-1 min-w-0">
            {currentChat ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                  {currentChat.title || "New chat"}
                </span>
                {currentModelMeta && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium border border-primary/20">
                    {currentModelMeta.title}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                DevHub AI
              </span>
            )}
          </div>
        </div>

        {/* Chat messages */}
        <div className="overflow-y-auto no-scrollbar overflow-x-hidden min-h-0">
          <ChatArea
            messages={currentChat?.messages || []}
            selectedModel={
              currentModelMeta?.title || selectedModel || defaultModelId
            }
          />
        </div>

        {/* Input area */}
        <div className="shrink-0 flex justify-center px-4 py-3 border-t border-gray-200/60 dark:border-gray-800/50 bg-white/80 dark:bg-[#0a0e1a]/80 backdrop-blur-sm">
          <InputArea
            onSendMessage={handleSendMessage}
            selectedModelId={selectedModel || defaultModelId}
            onModelChange={setSelectedModel}
            models={models}
            variant={hasMessages ? "bottom" : "center"}
            sending={sending}
            attachment={pendingAttachment}
            onAttachmentChange={setPendingAttachment}
            canUseAttachment={canUseAttachment}
          />
        </div>
      </div>

      {/* ─── Mobile sidebar overlay ─── */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 md:hidden w-72 max-w-[85%] shadow-2xl">
            <Sidebar
              chats={chats}
              currentChatId={currentChatId}
              onSelectChat={handleSelectChat}
              onNewChat={handleNewChat}
              onDeleteChat={handleDeleteChat}
              onRenameChat={handleRenameChat}
              onShareChat={handleShareChat}
              onPinChat={(id) => {
                const chat = chats.find((c) => c.id === id);
                handlePinChat(id, chat?.pinned);
              }}
              isMobile={true}
              onCloseMobile={() => setSidebarOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  );
}
