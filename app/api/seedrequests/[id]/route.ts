import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import SeedRequest from "@/models/SeedRequest";
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (mongoose.connection.readyState === 0) {
      await dbConnect();
    }

    const { id } = params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid or missing ID" }, { status: 400 });
    }

    const body = await request.json();
    const { status, reason } = body;

    if (!status) {
      return NextResponse.json({ message: "Status is required" }, { status: 400 });
    }

    const updateData: { status: string; rejectReason?: string } = { status };
    if (status === "rejected" && reason) {
      updateData.rejectReason = reason;
    }

    const updatedRequest = await SeedRequest.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!updatedRequest) {
      return NextResponse.json({ message: "Seed request not found" }, { status: 404 });
    }

    return NextResponse.json(updatedRequest, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error", error: error instanceof Error ? error.message : "" }, { status: 500 });
  }
}
