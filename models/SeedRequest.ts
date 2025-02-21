import mongoose, { Schema, model, models } from "mongoose";

const SeedRequestSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  seedType: { type: String, required: true },
  description: { type: String, required: true },
  imagePath: { type: String, default: null },
  status: {
    type: String,
    enum: ["approved", "pending", "rejected", "released"],
    default: "pending",
  },
  rejectReason: { type: String, default: null }, // New field for rejection reason
  createdAt: { type: Date, default: Date.now },
});

const SeedRequest = models.SeedRequest || model("SeedRequest", SeedRequestSchema);

export default SeedRequest;
