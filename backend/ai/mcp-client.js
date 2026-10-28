import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export async function connectMcpClient() {
  const client = new Client({
    name: "gemini-task-client",
    version: "1.0.0",
  });

  const transport = new StdioClientTransport({
    command: "node",
    args: ["server.js"],
    stderr: "inherit",
  });

  await client.connect(transport);

  return client;
}