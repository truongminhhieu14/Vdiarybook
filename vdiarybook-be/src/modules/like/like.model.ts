import mongoose, { Document, ObjectId, Schema, Types } from "mongoose";

export interface ILike extends Document {
    userId: ObjectId;
    postId: ObjectId;
    type: "like" | "love" | "haha" | "wow" | "sad" | "angry";
}

const likeSchema = new Schema<ILike>(
    {
        userId: {type: Types.ObjectId, required: true, ref: 'User'},
        postId: {type: Types.ObjectId, required: true, ref: 'Post'},
        type: {
            type: String,
            enum: ["like", "love", "haha", "wow", "sad", "angry"],
            required: true, 
            default: "like"
        }
    },
    {timestamps: true}
);

likeSchema.index({ userId: 1, postId: 1}, {unique: true})

export const Like = mongoose.model<ILike>('Like', likeSchema)