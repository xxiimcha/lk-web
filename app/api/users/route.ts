import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    console.log("Connecting to MongoDB...");
    await dbConnect();
    console.log("Fetching users...");

    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    // Define a more specific type for query
    const query: { role?: string } = {};
    if (role) {
      query.role = role;
    }

    // Fetch users from the database
    const users = await User.find(query);

    console.log("Users fetched:", users);
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Error fetching users" },
      { status: 500 }
    );
  }
}
