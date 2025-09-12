import mongoose, { Document, ObjectId, Schema, Types } from "mongoose";

export interface IShare extends Document {
    postId: ObjectId;
    userId?: ObjectId;
    type: "internal" | "external";
    platform?: string;
    caption?: string; 
}

const shareSchema = new Schema<IShare>(
    {
        postId: {type: Types.ObjectId, ref: "Post", required: true},
        userId: { type: Types.ObjectId, ref: "User"},
        type: { type: String, enum: ["internal", "external"], required: true },
        platform: { type: String}, 
        caption: { type: String },
    },
    { timestamps: true }
);

export const Share = mongoose.model<IShare>("Share", shareSchema);