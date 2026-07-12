import axios from "axios";

const REQUEST_TIMEOUT_MS = 30000;
const MAX_ATTEMPTS = 2;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getSummary(content: string): Promise<string> {
  const API_URL = import.meta.env.VITE_API_URL;

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await axios.post(
        `${API_URL}/summarize`,
        { content },
        { timeout: REQUEST_TIMEOUT_MS }
      );

      const summary = response.data?.summary;
      if (!summary) {
        throw new Error("Empty summary returned");
      }
      return summary;
    } catch (error) {
      lastError = error;

      // Don't retry client errors (e.g. missing content) — only transient ones.
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      const retryable = status === undefined || status >= 500;
      if (!retryable || attempt === MAX_ATTEMPTS) break;

      await sleep(600 * attempt);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Failed to generate summary");
}
