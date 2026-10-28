
import "dotenv/config";
import express from "express";
import cors from "cors";

import {
  runTaskAssistant,
  closeTaskAssistant,
} from "./ai/task-assistant.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "AI Task Assistant API is running.",
  });
});

// AI chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body ?? {};

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a message.",
      });
    }

    const answer = await runTaskAssistant(message.trim());

    res.json({
      success: true,
      reply: answer,
    });
  } catch (error) {
    console.error("Chat API error:", error.message);

    res.status(500).json({
      success: false,
      message: "Assistant request failed. Please try again.",
    });
  }
});

const httpServer = app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});

let shuttingDown = false;

async function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log("\nAPI server band ho raha hai...");

  httpServer.close(async () => {
    await closeTaskAssistant();
    console.log("MCP connection band ho gaya.");
    process.exit(0);
  });

  // Agar HTTP shutdown atak jaye to process ko exit karne dein.
  setTimeout(() => {
    console.error("Graceful shutdown timeout.");
    process.exit(1);
  }, 10000).unref();
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
