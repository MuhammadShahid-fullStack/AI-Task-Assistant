
import "dotenv/config";
import { connectMcpClient } from "./mcp-client.js";
import { taskToolDescriptions } from "./gemini-tools.js";

const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent";

let mcpClientPromise = null;

async function getMcpClient() {
  if (!mcpClientPromise) {
    mcpClientPromise = connectMcpClient().catch((error) => {
      mcpClientPromise = null;
      throw error;
    });
  }

  return mcpClientPromise;
}

export async function closeTaskAssistant() {
  if (!mcpClientPromise) return;

  const pendingClient = mcpClientPromise;
  mcpClientPromise = null;

  try {
    const client = await pendingClient;
    await client.close();
  } catch (error) {
    console.error("MCP client close error:", error.message);
  }
}


async function askGemini(contents) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(".env mein GEMINI_API_KEY nahi mili.");
  }

  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents,
          tools: [
            {
              functionDeclarations: taskToolDescriptions,
            },
          ],
        }),
        signal: AbortSignal.timeout(60000),
      });

      const data = await response.json();

      if (!response.ok) {
        const error = new Error(
          data.error?.message || `Gemini API error: ${response.status}`
        );

        // Temporary server/rate-limit errors par retry karein.
        if (
          [408, 429, 500, 502, 503, 504].includes(response.status) &&
          attempt < maxRetries
        ) {
          console.log(
            `Gemini temporary error (${response.status}). Retry ${attempt + 1}/${maxRetries}...`
          );

          await new Promise((resolve) =>
            setTimeout(resolve, attempt * 2000)
          );

          continue;
        }

        throw error;
      }

      return data.candidates?.[0]?.content;
    } catch (error) {
      const networkError =
        error.name === "TimeoutError" ||
        error.cause?.code === "UND_ERR_CONNECT_TIMEOUT" ||
        error.cause?.code === "ECONNRESET" ||
        error.cause?.code === "ECONNREFUSED" ||
        error.cause?.code === "EHOSTUNREACH" ||
        error.cause?.code === "ENETUNREACH" ||
        error.message === "fetch failed";

      if (!networkError || attempt === maxRetries) {
        throw error;
      }

      console.log(
        `Gemini network issue. ${attempt + 1}/${maxRetries} attempt dobara ho rahi hai...`
      );

      await new Promise((resolve) =>
        setTimeout(resolve, attempt * 2000)
      );
    }
  }

  throw new Error("Gemini se response nahi mila. Dobara try karein.");
}


export async function runTaskAssistant(prompt) {
  const client = await getMcpClient();

  const contents = [
    {
      role: "user",
      parts: [
        {
          text:
            "You are a task management assistant. Understand the user's request. " +
            "Use create_task to create tasks and list_tasks to list tasks. " +
            "For update or delete requests, first call list_tasks to find the matching task and its actual _id. " +
            "Never invent task IDs. If multiple tasks match, ask the user which one. " +
            "Use update_task_status only with pending, in_progress, or completed. " +
            "Use delete_task only when the user clearly requests deletion. " +
            "Never claim success unless the MCP tool confirms it. " +
            "Reply in the user's language.\n\nUser request: " +
            prompt,
        },
      ],
    },
  ];

  for (let attempt = 0; attempt < 8; attempt++) {
    const modelContent = await askGemini(contents);

    if (!modelContent?.parts?.length) {
      throw new Error("Gemini se valid response nahi mila.");
    }

    const functionCalls = modelContent.parts.filter(
      (part) => part.functionCall
    );

    if (functionCalls.length === 0) {
      return modelContent.parts
        .map((part) => part.text || "")
        .filter(Boolean)
        .join("\n");
    }

    contents.push(modelContent);

    const functionResponses = [];

    for (const part of functionCalls) {
      const { name, args = {} } = part.functionCall;

      const allowedTools = [
        "create_task",
        "list_tasks",
        "update_task_status",
        "delete_task",
      ];

      if (!allowedTools.includes(name)) {
        throw new Error(`Yeh tool allowed nahi hai: ${name}`);
      }

      const result = await client.callTool({
        name,
        arguments: args,
      });

      functionResponses.push({
        functionResponse: {
          name,
          response: {
            result: {
              content: result.content || [],
              isError: result.isError || false,
            },
          },
        },
      });
    }

    contents.push({
      role: "user",
      parts: functionResponses,
    });
  }

  throw new Error("Gemini ne bohat zyada tool calls ki hain.");
}
