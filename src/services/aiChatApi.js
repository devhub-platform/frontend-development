// src/services/aiChatApi.js
import axios from "axios";

const API_BASE = "https://api.dev-hubs.tech/api/v1/ai-chat";

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
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

// 1) جلب المودلز
export async function fetchModels() {
  const res = await api.get("/models");
  // { default: "id", models: [ {id,title,best_for,vision,fallback?} ] }
  return res.data;
}

// 2) إرسال رسالة
export async function sendMessage({
  message,
  model,
  sessionId,
  attachmentIds,
}) {
  const payload = {
    message,
  };

  if (model) payload.model = model;
  if (sessionId) payload.session_id = sessionId;
  if (attachmentIds && attachmentIds.length > 0) {
    payload.attachments = attachmentIds;
  }

  try {
    const res = await api.post("/send", payload);
    // مثال:
    // {
    //   "session_id": 8,
    //   "ai_message": "...",
    //   "model_used": "openai/gpt-oss-120b",
    //   "processing_time_ms": ...,
    //   "success": true
    // }
    const raw = res.data || {};

    let text = "";
    if (typeof raw.ai_message === "string") text = raw.ai_message;
    else if (typeof raw.response === "string") text = raw.response;
    else if (typeof raw.message === "string") text = raw.message;
    else text = "No response from AI.";

    return {
      session_id: raw.session_id || sessionId || null,
      text,
      model_used: raw.model_used || model || null,
      success: raw.success ?? true,
      raw,
    };
  } catch (err) {
    const status = err.response?.status;
    const data = err.response?.data || {};
    const text =
      data.message ||
      data.error ||
      `Request failed with status ${status || "unknown"}`;

    return {
      session_id: sessionId || null,
      text,
      model_used: model || null,
      success: false,
      raw: data,
      error: true,
      status,
    };
  }
}

// 3) رفع ملف (attachment)
export async function uploadAttachment(file) {
  const form = new FormData();
  form.append("file", file);

  const token = localStorage.getItem("userToken");
  const res = await axios.post(
    "http://devhub.eu-north-1.elasticbeanstalk.com/api/v1/ai-chat/attachments/upload",
    form,
    {
      headers: {
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
        "Content-Type": "multipart/form-data",
      },
    },
  );

  // { attachment_id, url, filename, mime_type, type, status }
  return res.data;
}

// 4) كل السيشنات
export async function fetchSessions() {
  const res = await api.get("/sessions");
  // { sessions: [ { id, title, model, model_title, message_count, created_at, updated_at, pinned, active } ], ... }
  return res.data.sessions || [];
}

// 5) تفاصيل سيشن + الرسايل
export async function fetchSessionDetail(sessionId) {
  const res = await api.get(`/sessions/${sessionId}`);
  // { session: {...}, messages: [...] }
  return res.data;
}

// 6) إنشاء سيشن جديدة
export async function createSession({ title, model }) {
  const res = await api.post("/sessions/create", { title, model });
  // { id, title, model, created_at }
  return res.data;
}

// 7) حذف سيشن
export async function deleteSession(sessionId) {
  await api.delete(`/sessions/${sessionId}`);
}

// 8) pin / unpin
export async function pinSession(sessionId) {
  await api.post(`/sessions/${sessionId}/pin`);
}

export async function unpinSession(sessionId) {
  await api.post(`/sessions/${sessionId}/unpin`);
}

// 9) تحديث العنوان
export async function updateSessionTitle(sessionId, title) {
  const res = await api.put(`/sessions/${sessionId}/title`, { title });
  return res.data;
}
