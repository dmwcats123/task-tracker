import { connectToDatabase } from "../DBConnect/route";
import { NextResponse } from "next/server";

export async function PUT(req) {
  const data = await req.json();
  const newTaskData = data.newTaskData;

  try {
    const db = await connectToDatabase();
    const collection = db.collection("tasks");
    await collection.updateOne(
      { username: data.username, "tasks._id": newTaskData._id },
      {
        $set: {
          "tasks.$": newTaskData,
        },
      }
    );

    const documents = await collection.findOne({ username: data.username });
    return new Response(JSON.stringify(documents));
  } catch (error) {
    console.error("Error: ", error);
  }
}
