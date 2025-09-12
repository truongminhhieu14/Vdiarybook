import { Types } from "mongoose";
import { Post } from "../post/post.model";
import { Share } from "./share.model";

class ShareService {
    async internalShare(userId: string, postId: string, caption?: string) {
        const post = await Post.findById(postId);
        if(!post) throw new Error("Post not found");

        const share = await Share.create({
            postId: post._id,
            userId: userId,
            type: "internal",
            caption: caption || ""
        });

        const newPost = await Post.create({
            author: new Types.ObjectId(userId),
            postedOn: new Types.ObjectId(userId),
            caption: caption || "",
            type: "share",
            originalPost: post._id,
            privacy: "public",
        })

        const populatedShare = await Post.findById(newPost._id)
            .populate("author", "name avatar")
            .populate("postedOn", "name avatar")
            .populate({
                path: "originalPost",
                populate: { path: "author", select: "name avatar" },
        });
        return {
            share, 
            post: populatedShare
        };
    }

    async externalShare(postId: string, platform: "facebook" | "x" | "vdiarybook") {
        const post = await Post.findById(postId);
        if(!post) throw new Error("Post not found");

        const postUrl = `https://your-domain.com/posts/${postId}`;

        let shareUrl = "";
        switch (platform) {
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
                break;
            case "x":
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.caption || "")}`;
                break;
            case "vdiarybook":
                shareUrl = `https://vdiarybook.com/share?url=${encodeURIComponent(postUrl)}`;
                break;
            default: 
                throw new Error("Unsupported platform");
        }
        return { shareUrl };
    }
}

export const shareService = new ShareService();