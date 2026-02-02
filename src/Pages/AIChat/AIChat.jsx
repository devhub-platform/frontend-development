/* eslint-disable no-unused-vars */
import { useState } from "react";
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

  const currentChat = chats.find((c) => c.id === currentChatId) || null;

  const handleNewChat = () => {
    setCurrentChatId(null);
  };

  const handleSelectChat = (chat) => {
    setCurrentChatId(chat.id);
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

    setChats((prevChats) => {
      let activeId = currentChatId;
      let updatedChats = [...prevChats];

      if (!activeId) {
        activeId = Date.now().toString();
        const newChat = {
          id: activeId,
          title: trimmed.slice(0, 40) || "New chat",
          messages: [],
          pinned: false,
        };
        updatedChats = [newChat, ...updatedChats];
        setCurrentChatId(activeId);
      }

      const userMessage = {
        id: Date.now().toString(),
        role: "user",
        content: trimmed,
        model: selectedModel,
      };

      return updatedChats.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, userMessage] }
          : c,
      );
    });

    const replyId = Date.now().toString();
    setTimeout(() => {
      setChats((prevChats) =>
        prevChats.map((c) =>
          c.id === (currentChatId || c.id)
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
    <div className="flex h-[90vh] bg-gray-50 dark:bg-[#0a0e1a]">
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        onShareChat={handleShareChat}
        onPinChat={handlePinChat}
      />

      <div className="flex-1 flex flex-col relative">
        <ChatArea
          messages={currentChat?.messages || []}
          selectedModel={selectedModel}
        />
        <InputArea
          onSendMessage={handleSendMessage}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />
      </div>
    </div>
  );
}
