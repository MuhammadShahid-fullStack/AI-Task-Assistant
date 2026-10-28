
export const taskToolDescriptions = [
  {
    name: "create_task",
    description:
      "MongoDB mein naya task banayein. Task ka title aur optional description dein.",
    parameters: {
      type: "OBJECT",
      properties: {
        title: {
          type: "STRING",
          description: "Task ka title",
        },
        description: {
          type: "STRING",
          description: "Task ki details",
        },
      },
      required: ["title"],
    },
  },
  {
    name: "list_tasks",
    description:
      "MongoDB se tamam tasks hasil karein. Kisi task ko update ya delete karne se pehle is tool se uski actual _id aur title dekhein.",
    parameters: {
      type: "OBJECT",
      properties: {},
    },
  },
  {
    name: "update_task_status",
    description:
      "Existing task ka status update karein. taskId ke liye list_tasks se mili actual MongoDB _id use karein.",
    parameters: {
      type: "OBJECT",
      properties: {
        taskId: {
          type: "STRING",
          description: "Task ki actual MongoDB _id",
        },
        status: {
          type: "STRING",
          enum: ["pending", "in_progress", "completed"],
          description: "Task ka naya status",
        },
      },
      required: ["taskId", "status"],
    },
  },
  {
    name: "delete_task",
    description:
      "Existing task ko permanently delete karein. Pehle list_tasks se title aur actual _id confirm karein. Sirf user ki clear delete request par call karein.",
    parameters: {
      type: "OBJECT",
      properties: {
        taskId: {
          type: "STRING",
          description: "Delete hone wale task ki actual MongoDB _id",
        },
      },
      required: ["taskId"],
    },
  },
];
