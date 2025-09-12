import mongoose, { Document, model, ObjectId, Schema } from "mongoose";

export interface INotification extends Document {
    receiverId : ObjectId;
    senderId: ObjectId;
    type: "comment" | "like";
    postId?: ObjectId;
    isRead: boolean;
    message?: string;
}

const notificationSchema = new Schema<INotification>(
    {
        receiverId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        senderId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        type: {type: String, enum: ["comment", "like"], required: true},
        postId: {type: mongoose.Schema.Types.ObjectId, ref: "Post"},
        isRead: {type: Boolean, default: false},
        message: {type: String},
    },
    {timestamps: true}
)

export const Notification = mongoose.model<INotification>("Notification", notificationSchema)