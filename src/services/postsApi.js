// src/services/postsApi.js
import axiosInstance from "../config/api";

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers.Accept = "application/json";
  return config;
});

export async function createPost({
  title,
  content,
  status = "published",
  read_time,
  tags = [],
  coverImageFile = null,
  imageFiles = [],
  generated_image_id = null,
  imageUrl = null,
}) {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("content", content);

  if (status) formData.append("status", status);
  if (read_time != null) formData.append("read_time", String(read_time));
  if (generated_image_id != null) {
    formData.append("generated_image_id", String(generated_image_id));
  }

  if (tags && tags.length > 0) {
    formData.append("tags[0]", JSON.stringify(tags));
  }

  if (coverImageFile) {
    formData.append("cover_image", coverImageFile);
  }

  if (imageFiles && imageFiles.length > 0) {
    imageFiles.forEach((file) => {
      formData.append("image_url[]", file);
    });
  } else if (imageUrl) {
    formData.append("image_url[]", imageUrl);
  }

  try {
    const res = await axiosInstance.post("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });

    return res.data;
  } catch (err) {
    const status = err.response?.status;
    const data = err.response?.data || {};
    const message =
      data.message ||
      data.error ||
      `Failed to create post (status ${status || "unknown"})`;
    console.error("createPost error:", err);
    throw { ...err, friendlyMessage: message };
  }
}

// 🔴 الـ End Point الجديدة بتاعة الـ AI Content Generation
export async function generateAIContent({
  prompt,
  length = "short",
  generate_title = true,
}) {
  try {
    const res = await axiosInstance.post("/posts/ai/generate-content", {
      prompt,
      length,
      generate_title,
    });
    return res.data; // بيرجع الـ object اللي فيه success, content, titles
  } catch (err) {
    const data = err.response?.data || {};
    const message =
      data.message || data.error || "Failed to generate AI content.";
    console.error("generateAIContent error:", err);
    throw { ...err, friendlyMessage: message };
  }
}
