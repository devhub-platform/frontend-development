// src/services/notificationsApi.js
import axiosInstance from "../config/api";

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers.Accept = "application/json";
  if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

/**
 * helper عام لجلب notifications من أي endpoint
 */
async function fetchNotificationList(url) {
  // axiosInstance تلقائياً بيحط الـ baseURL اللي هو فيه /api/v1
  const res = await axiosInstance.get(url);
  const payload = res.data || {};
  const data = Array.isArray(payload.data) ? payload.data : [];
  const meta = payload.meta || { total: data.length, unread_count: 0 };

  return { data, meta };
}

/**
 * 1) كل أنواع النوتيفيكيشن (من كذا endpoint)
 */
async function getAllNotifications() {
  const endpoints = [
    "/notifications/comments",
    "/notifications/new-followers",
    "/notifications/post-created",
    "/notifications/mention",
    "/notifications/questions",
    "/notifications/answers",
  ];

  // نستخدم Promise.all عشان يبقوا parallel
  const responses = await Promise.all(
    endpoints.map((url) =>
      fetchNotificationList(url).catch((err) => {
        console.error(`Error loading ${url}:`, err);
        return { data: [], meta: { total: 0, unread_count: 0 } };
      }),
    ),
  );

  // نجمع كل الـ data في array واحدة
  const mergedData = responses.flatMap((res) => res.data || []);

  const total = mergedData.length;
  const unread_count = mergedData.filter((n) => !n.read_at).length;

  return {
    list: mergedData,
    meta: {
      total,
      unread_count,
    },
  };
}

/**
 * 2) notifications للـ followers بس
 */
async function getFollowerNotifications() {
  return fetchNotificationList("/notifications/new-followers");
}

/**
 * 3) mark single notification as read
 */
async function markNotificationAsRead(id) {
  const res = await axiosInstance.post(`/notifications/${id}/mark-as-read`);
  return res.data;
}

/**
 * 4) mark all notifications as read
 */
async function markAllNotificationsAsRead() {
  const res = await axiosInstance.post("/notifications/mark-as-read");
  return res.data;
}

/**
 * 5) clear all notifications
 */
async function clearAllNotifications() {
  const res = await axiosInstance.delete("/notifications/clear");
  return res.data;
}

/**
 * 6) clear follower notifications فقط
 */
async function clearFollowerNotifications() {
  const res = await axiosInstance.delete("/notifications/followers/clear");
  return res.data;
}

const notificationsApi = {
  getAllNotifications,
  getFollowerNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearAllNotifications,
  clearFollowerNotifications,
};

export default notificationsApi;
