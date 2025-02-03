require("dotenv").config(); // Load environment variables

const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is missing. Please set it in the .env file.");
  process.exit(1);
}

app.use(cors());
app.use(bodyParser.json());

app.post("/summarize", async (req, res) => {
  const { content } = req.body;
  console.log("Received content:", content);

  if (!content) {
    return res
      .status(400)
      .json({ error: "Content is required for summarization" });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Summarize the following content naturally while preserving key details. 
  Avoid generic introductions or unnecessary explanations—focus only on the essential information.
  
  Content: ${content}

  Output a well-structured summary in descriptive manner (150 words).
`,
              },
            ],
          },
        ],
      }
    );

    console.log("API Response Data:", response.data);

    const summary = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!summary) {
      throw new Error("Invalid API response structure");
    }

    res.json({ summary });
  } catch (error) {
    console.error(
      "Summarization error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Error summarizing content",
      details: error.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
