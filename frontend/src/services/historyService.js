import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

export const getResumeHistory = async (userId) => {
  const res = await axios.get(`${BASE_URL}/resume/history/${userId}`);
  return res.data;
};