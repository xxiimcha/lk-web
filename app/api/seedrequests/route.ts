import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import SeedRequest from "@/models/SeedRequest";
import User from "@/models/User";

// Unified handler for all methods
export async function GET() { // `req` removed because it’s unused
  try {
    console.log("Connecting to MongoDB...");
    await dbConnect();
    console.log("Fetching seed requests...");

    // Fetch all seed requests
    const requests = await SeedRequest.find({});

    // Fetch user information for each request
    const requestsWithUserInfo = await Promise.all(
      requests.map(async (request) => {
        const user = await User.findById(request.userId);
        return {
          ...request.toObject(),
          user: user ? user.toObject() : null, // Include user details or null if not found
        };
      })
    );

    console.log("Seed requests with user info fetched:", requestsWithUserInfo);
    return NextResponse.json(requestsWithUserInfo, { status: 200 });
  } catch (error) {
    console.error("Error fetching seed requests:", error);
    return NextResponse.json(
      { message: "Error fetching seed requests" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    console.log("Connecting to MongoDB...");
    await dbConnect();
    console.log("Updating seed request status...");

    const { id, status } = await req.json(); // Extract `id` and `status` from the request body
    if (!id || !status) {
      return NextResponse.json(
        { message: "Invalid request: Missing id or status" },
        { status: 400 }
      );
    }

    const updatedRequest = await SeedRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return NextResponse.json(
        { message: "Seed request not found" },
        { status: 404 }
      );
    }

    console.log("Seed request updated:", updatedRequest);
    return NextResponse.json(updatedRequest, { status: 200 });
  } catch (error) {
    console.error("Error updating seed request status:", error);
    return NextResponse.json(
      { message: "Error updating seed request status" },
      { status: 500 }
    );
  }
}
