import { IPost, IUser } from "./post.type";

export interface SharePayLoad {
    postId: string;
    type: "internal" | "external";
    caption?: string;
}

export interface ShareResponse {
    _id: string;
    postId: IPost
    userId: IUser
    type: "internal" | "external";
    caption?: string;
}