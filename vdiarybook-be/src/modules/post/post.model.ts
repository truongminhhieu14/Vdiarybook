import mongoose, { Document, ObjectId, Schema, Types } from "mongoose";
import { handlePostType } from "./post.middleware";

export interface LinkMeta {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  type?: "link" | "youtube";
  videoId?: string;
  embedUrl?: string;
}
export interface IPost extends Document {
  caption: string;
  images: string[];
  videos: string[];
  links: LinkMeta[];
  author: ObjectId;
  postedOn: ObjectId;
  hashtags: ObjectId[];
  mentions: Types.ObjectId[];
  likes: ObjectId[];
  privacy: "public" | "friends" | "private";
  type: "text" | "image" | "video" | "link" | "mixed" | "share";
  originalPost: ObjectId
}
const linkMetaSchema = new Schema<LinkMeta>(
  {
    url: { type: String, required: true },
    title: { type: String },
    description: { type: String },
    image: { type: String },
    type: {type: String, enum: ["link", "youtube"], default: "link"},
    videoId: {type: String},
    embedUrl: {type: String}
  },
  { _id: false }
);
const postSchema = new Schema<IPost>(
  {
    caption: { type: String, default: "" },
    images: [{ type: String, default: [] }],
    videos: [{ type: String, default: [] }],
    links: [linkMetaSchema],
    author: { type: Types.ObjectId, required: true, ref: "User" },
    postedOn: { type: Types.ObjectId, required: true, ref: "User"},
    hashtags: [{ type: Types.ObjectId, ref: "Hashtag" }],
    mentions: [{ type: Types.ObjectId, ref: "User" }],
    likes: [{ type: Types.ObjectId, ref: "User" }],
    privacy: {
      type: String,
      enum: ["public", "friends", "private"],
      default: "public",
    },
    type: {
      type: String,
      enum: ["text", "image", "video", "link", "mixed", "share"],
      default: "text",
    },
    originalPost: { type: Types.ObjectId, ref: "Post" },
  },
  { timestamps: true, collection: "posts" }
);
postSchema.pre("save", function (next) {
  handlePostType(this as IPost);
  next();
});

export const Post = mongoose.model<IPost>("Post", postSchema);
