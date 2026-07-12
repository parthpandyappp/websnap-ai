require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Replicate = require("replicate");

const app = express();
const PORT = process.env.PORT || 4000;

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

if (!REPLICATE_API_TOKEN) {
  console.error("REPLICATE_API_TOKEN is missing.");
  process.exit(1);
}

const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
});

// Primary model is Anthropic Claude 3.5 Haiku on Replicate: fast, cheap and
// purpose-built for short summarization with a 200K context window. It is far
// more reliable than the Gemini passthrough, which returns intermittent 5xx
// errors from Google's side. Both are overridable via env.
const PRIMARY_MODEL = process.env.SUMMARY_MODEL || "anthropic/claude-3.5-haiku";
const FALLBACK_MODEL =
  process.env.SUMMARY_FALLBACK_MODEL || "meta/meta-llama-3-8b-instruct";

// Cap how much article text we forward. Keeps latency (and Lambda timeout risk)
// down and stays well within the model context window. ~48k chars ≈ 12k tokens.
const MAX_CONTENT_CHARS = 48000;
const MAX_TOKENS = 512;
const MAX_ATTEMPTS = 3;

const SYSTEM_PROMPT =
  "You are a concise summarization assistant. You produce clear, structured " +
  "summaries of web articles, preserving key facts, names and numbers. " +
  "You never add generic introductions or meta commentary.";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Replicate language models stream their output as an array of string chunks,
// but some return a plain string or an object. Normalize all of these.
function normalizeOutput(output) {
  if (Array.isArray(output)) return output.join("");
  if (typeof output === "string") return output;
  if (output == null) return "";
  return String(output);
}

function statusOf(error) {
  return error?.response?.status ?? error?.status;
}

// A failure is worth retrying only if it looks transient: a 429 (throttling),
// an upstream 5xx, or a network blip. A 4xx (bad input, auth, unknown model)
// will never succeed on retry.
function isRetryable(error) {
  const status = statusOf(error);
  if (typeof status === "number") return status >= 500 || status === 429;
  // No HTTP status usually means a network/timeout error — retry those.
  return true;
}

// How long to wait before the next attempt. For 429s, respect the server's
// requested delay (Replicate throttles hard when no payment method is on the
// account); for everything else use exponential backoff.
function backoffMs(error, attempt) {
  if (statusOf(error) === 429) {
    const header = Number(error?.response?.headers?.get?.("retry-after"));
    const fromBody = Number(/retry_after"?\s*:\s*(\d+)/.exec(error?.message)?.[1]);
    const seconds = header || fromBody || 2;
    return Math.min(seconds, 8) * 1000 + 250; // cap so we stay under the 29s Lambda timeout
  }
  return 400 * 2 ** (attempt - 1); // 400ms, 800ms, ...
}

async function runModel(model, prompt) {
  const input = {
    prompt,
    system_prompt: SYSTEM_PROMPT,
    max_tokens: MAX_TOKENS,
  };
  const output = await replicate.run(model, { input });
  const summary = normalizeOutput(output).trim();
  if (!summary) {
    throw new Error(`Empty response from Replicate model ${model}`);
  }
  return summary;
}

// Try the primary model with exponential backoff, then fall back to a second
// model. This absorbs the transient upstream 5xx failures that were surfacing
// to users as hard errors.
async function summarizeWithRetry(prompt) {
  let lastError;

  for (const model of [PRIMARY_MODEL, FALLBACK_MODEL]) {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        return { summary: await runModel(model, prompt), model };
      } catch (error) {
        lastError = error;
        console.error(
          `Summarization attempt ${attempt}/${MAX_ATTEMPTS} failed for ${model}:`,
          error?.message || error
        );
        if (!isRetryable(error) || attempt === MAX_ATTEMPTS) break;
        await sleep(backoffMs(error, attempt));
      }
    }
  }

  throw lastError || new Error("Summarization failed");
}

app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));

app.get("/health", (_req, res) => res.json({ ok: true, model: PRIMARY_MODEL }));

app.post("/summarize", async (req, res) => {
  const { content } = req.body;

  if (!content || typeof content !== "string" || !content.trim()) {
    return res.status(400).json({
      error: "Content is required for summarization",
    });
  }

  const trimmed = content.slice(0, MAX_CONTENT_CHARS);

  const prompt = `Summarize the following content naturally while preserving key details.
Avoid generic introductions. Focus only on essential information.

Content:
${trimmed}

Provide a structured summary (~150 words).`;

  try {
    const { summary, model } = await summarizeWithRetry(prompt);
    res.json({ summary, model });
  } catch (error) {
    console.error("Summarization error:", error);
    res.status(502).json({
      error: "Error summarizing content",
      details: error?.message || String(error),
    });
  }
});

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

module.exports = app;
