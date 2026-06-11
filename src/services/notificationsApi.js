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
 * 1) جلب كل أنواع النوتيفيكيشن من الـ Endpoint الموحدة للباك إند
 */
async function getAllNotifications() {
  try {
    const res = await axiosInstance.get("/notifications/all");

    return {
      list: Array.isArray(res.data?.data) ? res.data.data : [],
      meta: res.data?.meta || {
        total: 0,
        unread_count: 0,
      },
    };
  } catch (err) {
    console.error("Error loading notifications:", err);

    return {
      list: [],
      meta: {
        total: 0,
        unread_count: 0,
      },
    };
  }
}

async function getFollowerNotifications() {
  const res = await axiosInstance.get("/notifications/new-followers");
  const payload = res.data || {};
  const data = Array.isArray(payload.data) ? payload.data : [];
  const meta = payload.meta || { total: data.length, unread_count: 0 };
  return { data, meta };
}

async function markNotificationAsRead(id) {
  const res = await axiosInstance.post(`/notifications/${id}/mark-as-read`);
  return res.data;
}

async function markAllNotificationsAsRead() {
  const res = await axiosInstance.post("/notifications/mark-as-read");
  return res.data;
}

async function clearAllNotifications() {
  const res = await axiosInstance.delete("/notifications/clear");
  return res.data;
}

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
