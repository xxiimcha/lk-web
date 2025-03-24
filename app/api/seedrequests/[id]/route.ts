import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import SeedRequest from "@/models/SeedRequest";

export async function PUT(
  request: NextRequest,
  { params } : { params: Promise<{ id: string }> }
) {
  try {
    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await dbConnect();
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Missing ID in request" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, reason } = body;

    if (!status) {
      return NextResponse.json(
        { message: "Missing status in request body" },
        { status: 400 }
      );
    }

    const updateData: { status: string; rejectReason?: string } = { status };
    if (status === "rejected" && reason) {
      updateData.rejectReason = reason;
    }

    const updatedRequest = await SeedRequest.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedRequest) {
      return NextResponse.json(
        { message: "Seed request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedRequest, { status: 200 });
  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred";

    if (error instanceof Error) { // ✅ Type check for Error object
      errorMessage = error.message;
    }

    return NextResponse.json(
      { message: "Internal server error", error: errorMessage }, 
      { status: 500 }
    );
  }
}
