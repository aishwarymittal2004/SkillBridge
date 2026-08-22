import API from "./api";

export const getResumeHistory = async (userId) => {
  const res = await API.get(`/resume/history/${userId}`);
  return res.data;
};