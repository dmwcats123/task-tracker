import { connectToDatabase } from "../DBConnect/route";
import { NextResponse } from "next/server";

export async function POST(req) {
  const data = await req.json();

  try {
    const db = await connectToDatabase();
    const collection = db.collection("tasks");
    await collection.updateOne(
      { username: data.username },
      {
        $pull: {
          tasks: { _id: data.taskID },
        },
      }
    );

    const documents = await collection.findOne({ username: data.username });
    return new Response(JSON.stringify(documents));
  } catch (error) {
    console.error("Error: ", error);
  }
}
