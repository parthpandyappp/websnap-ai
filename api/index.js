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

app.use(cors());
app.use(bodyParser.json());

app.post("/summarize", async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({
      error: "Content is required for summarization",
    });
  }

  try {
    // 🔥 Using Gemini via Replicate (you can swap model later)
    const input = {
      prompt: `Summarize the following content naturally while preserving key details. 
Avoid generic introductions. Focus only on essential information.

Content:
${content}

Provide a structured summary (~150 words).`,
    };

    const output = await replicate.run("google/gemini-2.5-flash", { input });

    // Replicate returns array or string depending on model
    const summary = Array.isArray(output) ? output.join("") : output;

    if (!summary) {
      throw new Error("Empty response from Replicate");
    }

    res.json({ summary });
  } catch (error) {
    console.error("Summarization error:", error);
    res.status(500).json({
      error: "Error summarizing content",
      details: error.message,
    });
  }
});

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

module.exports = app;
