import { z } from "zod";

export function registerGreetTool(server) {
  server.registerTool(
    "greet_user",
    {
      description: "User ko greeting message deta hai",
      inputSchema: {
        name: z.string().describe("User ka naam"),
      },
    },
    async ({ name }) => ({
      content: [
        {
          type: "text",
          text: `Assalam-o-Alaikum ${name}! Mera MCP tool kaam kar raha hai.`,
        },
      ],
    })
  );
}