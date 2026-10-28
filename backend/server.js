import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { connectDB } from "./db.js";
import { registerGreetTool } from "./tools/greet.js";
import { registerCalculatorTool } from "./tools/calculator.js";
import { registerTaskTools } from "./tools/tasks.js";

// MCP server create karna
const server = new McpServer({
  name: "learning-server",
  version: "1.0.0",
});

// MongoDB connect karna
await connectDB();

// Alag files se tools register karna
registerGreetTool(server);
registerCalculatorTool(server);
registerTaskTools(server);

// MCP server start karna
const transport = new StdioServerTransport();
await server.connect(transport);