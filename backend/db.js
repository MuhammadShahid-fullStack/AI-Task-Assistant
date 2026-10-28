import { MongoClient } from "mongodb";

const MONGO_URI = "mongodb://127.0.0.1:27017";

const client = new MongoClient(MONGO_URI);

let db;

export async function connectDB() {
  try {
    await client.connect();

    db = client.db("mcp_task_manager");

    await db.command({ ping: 1 });

    console.error("MongoDB successfully connected!");

    return db;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
}

export function getDB() {
  if (!db) {
    throw new Error("Pehle MongoDB connect karo.");
  }

  return db;
}