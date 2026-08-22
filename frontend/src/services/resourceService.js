import API from "./api";

export const getResources = async (resumeId) => {
  const res = await API.get(`/resume/${resumeId}/resources`);
  return res.data;
};