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
  imageFiles = [], // array من صور البوست
  generated_image_id = null,
  imageUrl = null, // لو حابة تبعتي URL بدل فايل
}) {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("content", content);

  if (status) formData.append("status", status);
  if (read_time != null) formData.append("read_time", String(read_time));
  if (generated_image_id != null) {
    formData.append("generated_image_id", String(generated_image_id));
  }

  // نفس اللي في API doc: tags[0] = array as JSON
  if (tags && tags.length > 0) {
    formData.append("tags[0]", JSON.stringify(tags));
  }

  if (coverImageFile) {
    formData.append("cover_image", coverImageFile);
  }

  // image_url: واحدة بس حاليًا (backend بيخزن string واحدة)
  // أولوية: أول فايل من imageFiles، لو مفيش يبقى URL string لو متاح
  if (imageFiles && imageFiles.length > 0) {
    const firstFile = imageFiles[0];
    if (firstFile) formData.append("image_url", firstFile);
  } else if (imageUrl) {
    formData.append("image_url", imageUrl);
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
