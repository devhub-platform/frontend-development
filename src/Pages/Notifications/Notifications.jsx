/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import { Coffee } from "lucide-react";
import { NotificationFeed } from "../../Components/Notification/NotificationFeed";
import { NotificationCard } from "../../Components/Notification/NotificationCard";
import notificationsApi from "../../services/notificationsApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in duration-700">
    <div className="relative mb-6">
      <div className="absolute inset-0 bg-primary blur-[60px] opacity-20 animate-pulse" />
      <div className="relative w-24 h-24 bg-white dark:bg-primary rounded-3xl flex items-center justify-center border border-white dark:border-neutral-900">
        <Coffee size={40} className="text-primary dark:text-white" />
      </div>
    </div>
    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
      Everything is quiet
    </h3>
    <p className="text-slate-500 dark:text-neutral-400 max-w-xs mx-auto text-sm font-medium leading-relaxed">
      You're all caught up for today. Enjoy your coffee!
    </p>
  </div>
);

// 🎯 دالة الـ Mapping الحادة والمصححة لمنع تداخل الـ Answer مع الـ Accepted
const mapApiNotificationToUi = (item) => {
  const type = item.type || "";

  let simpleType = "comment";
  let badgeLabel = "COMMENT";
  let actor = {};
  let targetUrl = "/home";

  if (
    type.includes("MentionInCommentNotification") ||
    type.includes("Mention")
  ) {
    simpleType = "mention";
    badgeLabel = "MENTION";

    actor = item.mentioned_by || item.from || item.author || {};

    if (item.post?.id) {
      targetUrl = `/post/${item.post.id}`;
    } else if (item.question?.id) {
      targetUrl = `/questions/${item.question.id}`;
    }
  } else if (type.includes("ReactNotification") || type.includes("Reaction")) {
    simpleType = "reaction";

    badgeLabel = item.reaction_type === "love" ? "REACTION ❤️" : "REACTION 👍";

    actor = item.from || item.author || {};

    if (item.post?.id) {
      targetUrl = `/post/${item.post.id}`;
    } else if (item.question?.id) {
      targetUrl = `/questions/${item.question.id}`;
    }
  } else if (type.includes("FollowNotification") || type.includes("Follower")) {
    simpleType = "follow";
    badgeLabel = "FOLLOW";

    actor = item.follower || item.from || item.author || {};

    if (actor.id) {
      targetUrl = `/users/${actor.id}`;
    }
  } else if (type.includes("QuestionCreatedNotification")) {
    simpleType = "question";
    badgeLabel = "QUESTION";

    actor = item.asker || item.from || item.author || {};

    if (item.question?.id) {
      targetUrl = `/questions/${item.question.id}`;
    }
  } else if (type.includes("AnswerAcceptedNotification")) {
    simpleType = "accepted-answer";
    badgeLabel = "ACCEPTED";

    actor = item.answerer || item.from || item.author || {};

    if (item.question?.id) {
      targetUrl = `/questions/${item.question.id}`;
    }
  }

  // 🔴 2- تعديل شرط الـ Answer ليعتمد على الـ NewAnswerNotification فقط لمنع التداخل
  else if (type.includes("NewAnswerNotification")) {
    simpleType = "answer";
    badgeLabel = "ANSWER";

    actor = item.answerer || item.from || item.author || {};

    if (item.question?.id) {
      targetUrl = `/questions/${item.question.id}`;
    }
  } else if (
    type.includes("PostCreatedNotification") ||
    type.includes("Post")
  ) {
    simpleType = "post-created";
    badgeLabel = "NEW POST";

    actor = item.author || item.user || item.from || {};

    if (item.post?.id) {
      targetUrl = `/post/${item.post.id}`;
    }
  } else {
    simpleType = "comment";
    badgeLabel = "COMMENT";

    actor = item.commenter || item.from || item.author || {};

    if (item.post?.id) {
      targetUrl = item.comment?.id
        ? `/post/${item.post.id}?comment=${item.comment.id}`
        : `/post/${item.post.id}`;
    }
  }

  const cleanAction = item.message
    ? item.message
        .replace(/\*\*Title:\*\*/g, "")
        .replace(/\r?\n|\r/g, " ")
        .trim()
    : "triggered an update on your feed";

  const displayName = actor.name || actor.username || "DevHub User";

  const finalAvatar =
    actor.avatar_url ||
    actor.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName,
    )}&background=random`;

  return {
    id: item.id,
    type,
    simpleType,
    badgeLabel,
    username: displayName,
    action: cleanAction,
    content:
      item.comment?.body ||
      item.post?.title ||
      item.question?.title ||
      item.reaction_type ||
      "",
    timestamp: item.created_at,
    avatar: finalAvatar,
    isRead: !!item.read_at,
    targetUrl,
  };
};

const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      const { list } = await notificationsApi.getAllNotifications();
      const mapped = list.map(mapApiNotificationToUi);
      setNotifications(mapped);
    } catch (err) {
      console.error(err);
      setError("Failed to load notifications. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // 🔴 1- تعديل دالة الـ handleCardNavigation لتعمل كـ Read قبل التوجيه تلقائياً
  const handleCardNavigation = async (notification) => {
    if (!notification.isRead) {
      try {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n,
          ),
        );

        await notificationsApi.markNotificationAsRead(notification.id);
      } catch (err) {
        console.error(err);
      }
    }

    navigate(notification.targetUrl);
  };

  const handleMarkAsRead = async (id) => {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      await notificationsApi.markNotificationAsRead(id);
      toast.success("Marked as read");
    } catch (err) {
      console.error(err);

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: false } : n)),
      );

      toast.error("Failed to mark notification");
    }
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification dismissed");
  };

  const handleMarkAllAsRead = async () => {
    try {
      setActionLoading(true);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      await notificationsApi.markAllNotificationsAsRead();
      toast.success("All caught up! 🌟");
    } catch (err) {
      console.error(err);
      fetchNotifications();
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("This will permanently clear your inbox. Ready?")) {
      return;
    }
    try {
      setActionLoading(true);
      await notificationsApi.clearAllNotifications();
      setNotifications([]);
    } catch (err) {
      console.error(err);
      fetchNotifications();
    } finally {
      setActionLoading(false);
    }
  };

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") return notifications;

    const key = activeFilter;
    if (key === "comments")
      return notifications.filter((n) => n.simpleType === "comment");
    if (key === "reactions")
      return notifications.filter((n) => n.simpleType === "reaction");
    if (key === "mentions")
      return notifications.filter((n) => n.simpleType === "mention");
    if (key === "follows")
      return notifications.filter((n) => n.simpleType === "follow");
    if (key === "posts")
      return notifications.filter((n) => n.simpleType === "post-created");
    if (key === "questions")
      return notifications.filter((n) => n.simpleType === "question");
    if (key === "answers")
      return notifications.filter((n) => n.simpleType === "answer");

    if (key === "accepted") {
      return notifications.filter((n) => n.simpleType === "accepted-answer");
    }

    return notifications;
  }, [notifications, activeFilter]);

  const filters = useMemo(
    () => [
      { key: "all", label: "All Feed", count: notifications.length },
      {
        key: "comments",
        label: "Comments",
        count: notifications.filter((n) => n.simpleType === "comment").length,
      },
      {
        key: "reactions",
        label: "Reactions",
        count: notifications.filter((n) => n.simpleType === "reaction").length,
      },
      {
        key: "mentions",
        label: "Mentions",
        count: notifications.filter((n) => n.simpleType === "mention").length,
      },
      {
        key: "follows",
        label: "Follows",
        count: notifications.filter((n) => n.simpleType === "follow").length,
      },
      {
        key: "posts",
        label: "Posts",
        count: notifications.filter((n) => n.simpleType === "post-created")
          .length,
      },
      {
        key: "questions",
        label: "Questions",
        count: notifications.filter((n) => n.simpleType === "question").length,
      },
      {
        key: "answers",
        label: "Answers",
        count: notifications.filter((n) => n.simpleType === "answer").length,
      },
      {
        key: "accepted",
        label: "Accepted",
        count: notifications.filter((n) => n.simpleType === "accepted-answer")
          .length,
      },
    ],
    [notifications],
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-white dark:bg-bg-primary-dark transition-colors duration-700">
      <NotificationFeed
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        unreadCount={unreadCount}
        totalCount={notifications.length}
        filters={filters}
        handleMarkAllAsRead={handleMarkAllAsRead}
        handleClearAll={handleClearAll}
        loading={loading || actionLoading}
        error={error}
      >
        {filteredNotifications.length > 0 ? (
          <div className="space-y-1 animate-in slide-in-from-bottom-4 fade-in duration-700">
            {filteredNotifications.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onCardClick={() => handleCardNavigation(n)}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : !loading && !error ? (
          <EmptyState />
        ) : null}
      </NotificationFeed>
    </div>
  );
};

export default Notifications;
