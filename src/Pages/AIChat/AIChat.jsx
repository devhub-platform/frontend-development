/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../../Components/AIChat/Sidebar";
import ChatArea from "../../Components/AIChat/ChatArea";
import InputArea from "../../Components/AIChat/InputArea";

export default function AIChat() {
  const [chats, setChats] = useState([
    { id: "1", title: "React useEffect cleanup", messages: [], pinned: false },
    { id: "2", title: "TypeScript generics help", messages: [], pinned: false },
  ]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [selectedModel, setSelectedModel] = useState("Qwen 2.5");

  // sidebar mobile drawer
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentChat = chats.find((c) => c.id === currentChatId) || null;
  const hasMessages = (currentChat?.messages?.length || 0) > 0;

  const handleNewChat = () => {
    setCurrentChatId(null);
    setIsSidebarOpen(false);
  };

  const handleSelectChat = (chat) => {
    setCurrentChatId(chat.id);
    setIsSidebarOpen(false);
  };

  const handlePinChat = (id) => {
    setChats((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))
        .sort((a, b) => Number(b.pinned) - Number(a.pinned)),
    );
  };

  const handleRenameChat = (id, newTitle) => {
    setChats((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c)),
    );
  };

  const handleDeleteChat = (id) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (currentChatId === id) setCurrentChatId(null);
  };

  const handleShareChat = (id) => {
    alert("Chat shared successfully!");
  };

  const handleSendMessage = (content) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    const newChatId = Date.now().toString();
    const userMessageId = (Date.now() + 1).toString();

    setChats((prevChats) => {
      const activeId = currentChatId || newChatId;

      let updated = prevChats;

      if (!currentChatId) {
        const newChat = {
          id: activeId,
          title: trimmed.slice(0, 40) || "New chat",
          messages: [],
          pinned: false,
        };
        updated = [newChat, ...prevChats];
      }

      const userMessage = {
        id: userMessageId,
        role: "user",
        content: trimmed,
        model: selectedModel,
      };

      return updated.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, userMessage] }
          : c,
      );
    });

    if (!currentChatId) setCurrentChatId(newChatId);

    const replyId = (Date.now() + 2).toString();
    const activeForReply = currentChatId || newChatId;

    setTimeout(() => {
      setChats((prevChats) =>
        prevChats.map((c) =>
          c.id === activeForReply
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  {
                    id: replyId,
                    role: "assistant",
                    content: `DevHub AI (${selectedModel}) is processing your request...`,
                  },
                ],
              }
            : c,
        ),
      );
    }, 900);
  };

  return (
    <div className="flex h-[90vh] bg-gray-50 dark:bg-[#0a0e1a] dark-scrollbar">
      {/* Desktop sidebar (md وما فوق) */}
      <div className="hidden md:block">
        <Sidebar
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          onRenameChat={handleRenameChat}
          onShareChat={handleShareChat}
          onPinChat={handlePinChat}
          isMobile={false}
          onCloseMobile={() => {}}
        />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col relative min-h-0 min-w-0">
        {/* زر فتح السايدبار في الموبايل */}
        <div className="md:hidden px-4 pt-3 pb-1 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg bg-gray-900 text-white flex items-center gap-2"
          >
            <Menu className="w-5 h-5" />
            <span className="text-sm">Chats</span>
          </button>
          <span className="text-xs text-gray-400">
            Model:{" "}
            <span className="text-primary font-semibold">{selectedModel}</span>
          </span>
        </div>

        <ChatArea
          messages={currentChat?.messages || []}
          selectedModel={selectedModel}
        />

        {/* Composer */}
        <div
          className={
            hasMessages
              ? "sticky bottom-0 z-40"
              : "flex-1 flex items-center justify-center pb-12"
          }
        >
          <InputArea
            onSendMessage={handleSendMessage}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            variant={hasMessages ? "bottom" : "center"}
          />
        </div>
      </div>

      {/* Mobile sidebar drawer + overlay */}
      {isSidebarOpen && (
        <>
          {/* overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
          {/* drawer */}
          <div className="fixed inset-y-0 left-0 z-50 md:hidden w-64 max-w-[80%]">
            <Sidebar
              chats={chats}
              currentChatId={currentChatId}
              onSelectChat={handleSelectChat}
              onNewChat={handleNewChat}
              onDeleteChat={handleDeleteChat}
              onRenameChat={handleRenameChat}
              onShareChat={handleShareChat}
              onPinChat={handlePinChat}
              isMobile={true}
              onCloseMobile={() => setIsSidebarOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  );
}
