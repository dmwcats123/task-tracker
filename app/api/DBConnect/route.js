import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("Please update the MONGODB_URI variable");
}

export async function connectToDatabase() {
  try {
    let client = new MongoClient(MONGODB_URI);
    await client.connect();
    let db = client.db("task-tracker");
    return db;
  } catch (error) {
    console.error("Error: ", error);
  }
}
