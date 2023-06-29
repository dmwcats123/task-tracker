import { connectToDatabase } from "../DBConnect/route";

export async function POST(req) {
  const username = await req.json();
  try {
    const db = await connectToDatabase();
    const collection = db.collection("tasks");
    const documents = await collection.findOne({ username: username });
    return new Response(JSON.stringify(documents));
  } catch (error) {
    console.error("Error: ", error);
  }
}
