import axios from "axios";

const API = "http://127.0.0.1:8000";

export const getResources = async (resumeId) => {
  const res = await axios.get(`${API}/resume/${resumeId}/resources`);
  return res.data;
};