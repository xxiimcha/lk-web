import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import SeedRequest from "@/models/SeedRequest";

export function PUT(request: NextRequest, context: { params: { id: string } }) {
  if (mongoose.connection.readyState === 0) {
    return dbConnect()
      .then(() => handleUpdate(request, context))
      .catch((error) =>
        NextResponse.json({ message: "Database connection failed", error: error.message }, { status: 500 })
      );
  }
  return handleUpdate(request, context);
}

function handleUpdate(request: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return Promise.resolve(NextResponse.json({ message: "Invalid or missing ID" }, { status: 400 }));
  }

  return request
    .json()
    .then((body) => {
      const { status, reason } = body;

      if (!status) {
        return NextResponse.json({ message: "Status is required" }, { status: 400 });
      }

      const updateData: { status: string; rejectReason?: string } = { status };
      if (status === "rejected" && reason) {
        updateData.rejectReason = reason;
      }

      return SeedRequest.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    })
    .then((updatedRequest) => {
      if (!updatedRequest) {
        return NextResponse.json({ message: "Seed request not found" }, { status: 404 });
      }
      return NextResponse.json(updatedRequest, { status: 200 });
    })
    .catch((error) =>
      NextResponse.json(
        { message: "Internal Server Error", error: error.message || "Unknown error" },
        { status: 500 }
      )
    );
}
