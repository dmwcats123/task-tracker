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

    const { username, password, registering } = data;

    const db = await connectToDatabase();
    const collection = db.collection("users");
    const user = await collection.findOne({ username: username });

    if (registering === false) {
      if (user) {
        if (password === user.password) {
          return NextResponse.json(
            { message: "Successful login" },
            {
              status: "200",
            }
          );
        } else {
          return NextResponse.json(
            { message: "Incorrect Password" },
            {
              status: "404",
            }
          );
        }
      } else {
        return NextResponse.json(
          { message: "User not found" },
          {
            status: "404",
          }
        );
      }
    } else {
      if (!user) {
        collection.insertOne({
          username: username,
          password: password,
        });
        const taskCollection = db.collection("tasks");
        taskCollection.insertOne({
          id: Math.random().toString(36).substring(7),
          username: username,
          tasks: [],
        });
        return NextResponse.json(
          { message: "Successful registration" },
          {
            status: "200",
          }
        );
      } else {
        return NextResponse.json(
          { message: "User already exists" },
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

async function registerUser(username, password, usersCollection) {}
