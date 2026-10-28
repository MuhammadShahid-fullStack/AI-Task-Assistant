import { z } from "zod";
import { ObjectId } from "mongodb";
import { getDB } from "../db.js";

export function registerTaskTools(server) {
  // 1. Task create karna
  server.registerTool(
    "create_task",
    {
      description: "MongoDB mein naya task create karta hai",
      inputSchema: {
        title: z.string().min(1).describe("Task ka title"),
        description: z.string().optional().describe("Task ki details"),
      },
    },
    async ({ title, description }) => {
      const db = getDB();

      const task = {
        title,
        description: description || "",
        status: "pending",
        createdAt: new Date(),
      };

      const result = await db.collection("tasks").insertOne(task);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              message: "Task successfully create ho gaya!",
              task: {
                ...task,
                _id: result.insertedId.toString(),
              },
            }),
          },
        ],
      };
    }
  );

  // 2. Saare tasks dekhna
  server.registerTool(
    "list_tasks",
    {
      description: "MongoDB se saare tasks fetch karta hai",
      inputSchema: {},
    },
    async () => {
      const db = getDB();

      const tasks = await db
        .collection("tasks")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      const formattedTasks = tasks.map((task) => ({
        ...task,
        _id: task._id.toString(),
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(formattedTasks, null, 2),
          },
        ],
      };
    }
  );

  // 3. Task ka status update karna
  server.registerTool(
    "update_task_status",
    {
      description: "Task ka status update karta hai",
      inputSchema: {
        taskId: z.string().describe("MongoDB task ID"),
        status: z
          .enum(["pending", "in_progress", "completed"])
          .describe("Naya status"),
      },
    },
    async ({ taskId, status }) => {
      if (!ObjectId.isValid(taskId)) {
        return {
          content: [{ type: "text", text: "Task ID valid nahi hai." }],
          isError: true,
        };
      }

      const db = getDB();

      const result = await db.collection("tasks").updateOne(
        { _id: new ObjectId(taskId) },
        { $set: { status } }
      );

      if (result.matchedCount === 0) {
        return {
          content: [{ type: "text", text: "Task nahi mila." }],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `Task status "${status}" mein update ho gaya.`,
          },
        ],
      };
    }
  );

  // 4. Task delete karna
  server.registerTool(
    "delete_task",
    {
      description: "MongoDB se task delete karta hai",
      inputSchema: {
        taskId: z.string().describe("Delete karne wale task ki ID"),
      },
    },
    async ({ taskId }) => {
      if (!ObjectId.isValid(taskId)) {
        return {
          content: [{ type: "text", text: "Task ID valid nahi hai." }],
          isError: true,
        };
      }

      const db = getDB();

      const result = await db.collection("tasks").deleteOne({
        _id: new ObjectId(taskId),
      });

      if (result.deletedCount === 0) {
        return {
          content: [{ type: "text", text: "Task nahi mila." }],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "Task successfully delete ho gaya.",
          },
        ],
      };
    }
  );
}