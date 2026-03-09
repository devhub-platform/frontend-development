// src/Components/AIChat/Sidebar.jsx
import {
  Plus,
  Trash2,
  Edit3,
  Share2,
  Pin,
  PinOff,
  MoreHorizontal,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";

export default function Sidebar({
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat,
  onShareChat,
  onPinChat,
  isMobile = false,
  onCloseMobile,
}) {
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [titleDraft, setTitleDraft] = useState("");

  const handleStartEdit = (chat) => {
    setEditingId(chat.id);
    setTitleDraft(chat.title || "");
  };

  const handleSaveEdit = (chat) => {
    const trimmed = titleDraft.trim();
    if (!trimmed || trimmed === chat.title) {
      setEditingId(null);
      return;
    }
    onRenameChat?.(chat.id, trimmed);
    setEditingId(null);
  };

  const handleNewChatClick = async () => {
    const id = await onNewChat?.();
    if (isMobile && onCloseMobile) onCloseMobile();
    return id;
  };

  const handleSelectChatClick = (chat) => {
    onSelectChat?.(chat);
    if (isMobile && onCloseMobile) onCloseMobile();
  };

  const handleToggleMenu = (e, chatId) => {
    e.stopPropagation();
    setMenuOpenId((prev) => (prev === chatId ? null : chatId));
  };

  // Close dropdown when clicking outside
  const handleOutsideClick = () => {
    if (menuOpenId) setMenuOpenId(null);
  };

  const pinnedChats = chats.filter((c) => c.pinned);
  const unpinnedChats = chats.filter((c) => !c.pinned);

  const ChatItem = ({ chat }) => {
    const isActive = chat.id === currentChatId;
    const isEditing = editingId === chat.id;
    const menuOpen = menuOpenId === chat.id;

    return (
      <div className="relative" onClick={() => menuOpen && setMenuOpenId(null)}>
        <button
          type="button"
          onClick={() => handleSelectChatClick(chat)}
          className={`w-full flex items-center gap-2.5 text-left rounded-xl transition-all px-3 py-2.5 group ${
            isActive
              ? "bg-primary/10 border border-primary/30 shadow-sm"
              : "hover:bg-gray-100 dark:hover:bg-gray-800/60 border border-transparent"
          }`}
        >
          {/* Active indicator dot */}
          <div
            className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all ${
              isActive
                ? "bg-primary shadow-sm shadow-primary/50"
                : "bg-transparent"
            }`}
          />

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onBlur={() => handleSaveEdit(chat)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSaveEdit(chat);
                  }
                  if (e.key === "Escape") setEditingId(null);
                }}
                autoFocus
                onClick={(e) => e.stopPropagation()}
                className="w-full text-xs font-medium bg-transparent border border-primary/40 rounded px-1 py-0.5 outline-none dark:text-gray-100"
              />
            ) : (
              <>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs font-medium truncate transition-colors ${
                      isActive
                        ? "text-primary"
                        : "text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white"
                    }`}
                  >
                    {chat.title || "New chat"}
                  </span>
                  {chat.pinned && (
                    <Pin className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate mt-0.5">
                  {chat.model_title || chat.model || "Unknown model"}
                </p>
              </>
            )}
          </div>

          {/* Menu button - only visible on hover or active */}
          <span
            onClick={(e) => handleToggleMenu(e, chat.id)}
            className={`p-1 rounded-lg transition-all text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-200 ${
              isActive || menuOpen
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </span>
        </button>

        {/* Dropdown menu */}
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpenId(null)}
            />
            <div className="absolute right-2 top-10 z-20 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/80 rounded-xl shadow-xl py-1 text-xs overflow-hidden">
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  handleStartEdit(chat);
                  setMenuOpenId(null);
                }}
                className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer text-gray-700 dark:text-gray-300 transition-colors"
              >
                <Edit3 className="w-3 h-3" />
                <span>Rename</span>
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  onShareChat?.(chat);
                  setMenuOpenId(null);
                }}
                className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer text-gray-700 dark:text-gray-300 transition-colors"
              >
                <Share2 className="w-3 h-3" />
                <span>Share</span>
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  onPinChat?.(chat.id);
                  setMenuOpenId(null);
                }}
                className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer text-gray-700 dark:text-gray-300 transition-colors"
              >
                {chat.pinned ? (
                  <>
                    <PinOff className="w-3 h-3" />
                    <span>Unpin</span>
                  </>
                ) : (
                  <>
                    <Pin className="w-3 h-3" />
                    <span>Pin</span>
                  </>
                )}
              </div>

              <div className="h-px bg-gray-100 dark:bg-gray-700/60 my-1 mx-2" />

              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  onDeleteChat?.(chat.id);
                  setMenuOpenId(null);
                }}
                className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`h-full bg-white dark:bg-[#080d1a] border-r border-gray-200 dark:border-gray-800/60 flex flex-col ${
        isMobile ? "w-full" : "w-64"
      }`}
      onClick={handleOutsideClick}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-800/60">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm">
              Chats
            </h2>
          </div>
          <button
            type="button"
            onClick={handleNewChatClick}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg bg-primary text-white hover:bg-primary/90 active:scale-95 transition-all shadow-sm shadow-primary/20"
          >
            <Plus className="w-3 h-3" />
            <span>New</span>
          </button>
        </div>

        <div className="text-[10px] text-gray-400 dark:text-gray-500">
          {chats.length} conversation{chats.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-2 py-2 space-y-0.5">
        {/* Pinned section */}
        {pinnedChats.length > 0 && (
          <div className="mb-3">
            <div className="px-2 py-1.5 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Pin className="w-2.5 h-2.5" />
              Pinned
            </div>
            <div className="space-y-0.5">
              {pinnedChats.map((chat) => (
                <ChatItem key={chat.id} chat={chat} />
              ))}
            </div>
          </div>
        )}

        {/* Recent section */}
        {unpinnedChats.length > 0 && (
          <div>
            {pinnedChats.length > 0 && (
              <div className="px-2 py-1.5 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Recent
              </div>
            )}
            <div className="space-y-0.5">
              {unpinnedChats.map((chat) => (
                <ChatItem key={chat.id} chat={chat} />
              ))}
            </div>
          </div>
        )}

        {chats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <MessageSquare className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-xs text-gray-400 dark:text-gray-500">
              No chats yet.
            </p>
            <p className="text-[11px] text-gray-300 dark:text-gray-600">
              Start a new conversation.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
