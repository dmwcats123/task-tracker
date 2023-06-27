import { connectToDatabase } from "../DBConnect/route";
import { NextResponse } from "next/server";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("Please update the MONGODB_URI variable");
}

export async function POST(req, res) {
  try {
    const body = await req.text();
    const data = JSON.parse(body);

    const username = data.username;
    const password = data.password;
    const registering = data.registering;

    const db = await connectToDatabase();
    console.log(db);
    const collection = db.collection("users");
    console.log(collection);
    const user = await collection.findOne({ username: username });

    if (registering === false) {
      console.log(user);
      if (user) {
        return NextResponse.json(
          { message: "Successful login" },
          {
            status: "200",
          }
        );
      } else {
        return NextResponse.json(
          { message: "User not found" },
          {
            status: "404",
          }
        );
      }
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}
