import mongoose from "mongoose";

const friendSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["follow", "friend_request"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "following"],
      default: "pending",
    },
  },
  { timestamps: true }
);

friendSchema.index({requester: 1, recipient: 1, type: 1}, {unique: true})

export const FriendModel = mongoose.model("Friend", friendSchema);
