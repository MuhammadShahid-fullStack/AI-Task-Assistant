import { z } from "zod";

export function registerCalculatorTool(server) {
  server.registerTool(
    "add_numbers",
    {
      description: "Do numbers ko add karta hai",
      inputSchema: {
        a: z.number().describe("Pehla number"),
        b: z.number().describe("Doosra number"),
      },
    },
    async ({ a, b }) => ({
      content: [
        {
          type: "text",
          text: `Jawab: ${a + b}`,
        },
      ],
    })
  );
}