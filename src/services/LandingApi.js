// src/services/LandingApi.js
import axiosInstance from "../config/api";

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/* ==========================
   Topics APIs
========================== */

export const getAllPlatformTopics = async () => {
  const res = await axiosInstance.get("/topics", getHeaders());
  return res.data;
};

export const addUserTopics = async (topicIds) => {
  const res = await axiosInstance.post(
    "/topics/add",
    {
      topic_ids: topicIds,
    },
    getHeaders(),
  );
  return res.data;
};

export const removeUserTopic = async (topicId) => {
  const res = await axiosInstance.post(
    "/topics/remove",
    {
      topic_ids: [topicId],
    },
    getHeaders(),
  );
  return res.data;
};

export const clearAllUserTopics = async () => {
  const res = await axiosInstance.get("/topics/clear", getHeaders());
  return res.data;
};

export const getMyFollowedTopics = async () => {
  const res = await axiosInstance.get("/topics/my-topics", getHeaders());
  return res.data;
};

/* ==========================
   Follow Suggestions
========================== */

export const getFollowSuggestions = async () => {
  const res = await axiosInstance.get("/followers/suggestions", getHeaders());
  return res.data;
};
