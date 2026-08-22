import API from "./api";

export async function getProgress(resumeId) {
  const res = await API.get(`/resume/${resumeId}/progress`);
  return res.data;
}

export async function updateProgress(
  resumeId,
  itemType,
  itemName,
  completed
) {
  await API.post(
    `/resume/${resumeId}/progress`,
    null,
    {
      params: {
        item_type: itemType,
        item_name: itemName,
        completed,
      },
    }
  );
}