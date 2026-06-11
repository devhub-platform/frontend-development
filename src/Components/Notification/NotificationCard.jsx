/* eslint-disable no-unused-vars */
import React from "react";
import {
  MessageCircle,
  Heart,
  AtSign,
  Trash2,
  Clock,
  FileText,
  HelpCircle,
  CheckCircle2,
  CheckSquare,
  UserPlus,
  Award,
} from "lucide-react";

export function NotificationCard({
  notification,
  onCardClick,
  onMarkAsRead,
  onDelete,
}) {
  const getIconConfig = () => {
    const simpleType = notification.simpleType;

    switch (simpleType) {
      case "comment":
        return {
          icon: <MessageCircle size={14} />,
          color: "bg-primary",
        };

      case "mention":
        return {
          icon: <AtSign size={14} />,
          color: "bg-purple-500",
        };

      case "reaction":
        return {
          icon: <Heart size={14} />,
          color: "bg-pink-500",
        };

      case "follow":
        return {
          icon: <UserPlus size={14} />,
          color: "bg-emerald-500",
        };

      case "post-created":
        return {
          icon: <FileText size={14} />,
          color: "bg-blue-500",
        };

      case "question":
        return {
          icon: <HelpCircle size={14} />,
          color: "bg-amber-500",
        };

      case "answer":
        return {
          icon: <CheckCircle2 size={14} />,
          color: "bg-indigo-500",
        };

      case "accepted-answer":
        return {
          icon: <Award size={14} />,
          color: "bg-green-600",
        };

      default:
        return {
          icon: <MessageCircle size={14} />,
          color: "bg-slate-500",
        };
    }
  };

  const config = getIconConfig();

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (Number.isNaN(diff)) return "";
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      onClick={onCardClick}
      className={`group relative mx-2 my-3 rounded-2xl transition-all duration-300 cursor-pointer border
        ${
          !notification.isRead
            ? "bg-blue-50/70 dark:bg-primary/5 shadow-md border-l-4 border-l-primary border-t-slate-100 border-r-slate-100 border-b-slate-100 dark:border-y-neutral-800 dark:border-r-neutral-800"
            : "bg-white/40 dark:bg-transparent border-transparent hover:border-slate-200 dark:hover:border-neutral-700 opacity-75"
        }`}
    >
      <div className="p-4 flex gap-4 items-start">
        {/* Avatar Section */}
        <div className="relative shrink-0">
          <div
            className={`p-0.5 rounded-full ring-2 ${!notification.isRead ? "ring-primary/60" : "ring-transparent"}`}
          >
            <img
              src={notification.avatar}
              alt={notification.username}
              className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-bg-secondary-dark shadow-sm"
            />
          </div>
          <div
            className={`absolute -bottom-1 -right-1 p-1.5 rounded-full text-white shadow-lg ${config.color} border-2 border-white dark:border-bg-secondary-dark`}
          >
            {config.icon}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 pr-24">
          <div className="flex items-center gap-2 mb-1">
            <h4
              className={`truncate ${!notification.isRead ? "font-black text-slate-950 dark:text-white" : "font-bold text-slate-700 dark:text-neutral-400"}`}
            >
              {notification.username}
            </h4>
            <span className="text-[9px] px-2 py-0.5 rounded-lg font-black uppercase tracking-wider bg-primary/10 text-primary dark:bg-primary/20 dark:text-text-dark">
              {notification.badgeLabel}
            </span>
          </div>

          <p
            className={`text-sm leading-snug ${!notification.isRead ? "text-slate-900 font-bold dark:text-neutral-100" : "text-slate-500 dark:text-neutral-400"}`}
          >
            {notification.action}
          </p>

          {notification.content && (
            <div className="relative pl-3 border-l-2 border-primary/30 dark:border-primary/20 my-2 bg-white/80 dark:bg-white/5 p-2 rounded-r-lg">
              <p className="text-xs text-slate-500 dark:text-neutral-400 line-clamp-2 italic">
                “{notification.content}”
              </p>
            </div>
          )}

          <div className="flex items-center gap-1.5 mt-2 text-[10px] font-semibold text-slate-400 dark:text-neutral-500 uppercase tracking-tight">
            <Clock size={12} className="text-primary/60" />
            {formatTimestamp(notification.timestamp)}
          </div>
        </div>

        {/* Control Buttons Panel */}
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {!notification.isRead && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl transition-all duration-200 cursor-pointer border border-emerald-200/50 dark:border-emerald-500/20 shadow-sm"
              title="Mark as Read"
            >
              <CheckSquare size={16} className="stroke-[2.5]" />
            </button>
          )}
          <button
            onClick={() => onDelete(notification.id)}
            className="p-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-200 cursor-pointer border border-red-200/50 dark:border-red-500/20 shadow-sm"
            title="Dismiss Update"
          >
            <Trash2 size={16} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Unread Glow Dot Indicator */}
        {!notification.isRead && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 group-hover:opacity-0 transition-opacity duration-200">
            <div className="w-3.5 h-3.5 bg-primary rounded-full animate-pulse shadow-[0_0_16px_#003890]" />
          </div>
        )}
      </div>
    </div>
  );
}
