import axios from "axios";

export async function getSummary(content: string) {
  const API_URL = import.meta.env.VITE_API_URL;
  const response = await axios.post(`${API_URL}/summarize`, {
    content,
  });

  return response.data.summary;
}
