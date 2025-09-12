import { IUser } from "./post.type";

export interface IComment {
  _id: string;
  text: string;
  author: IUser;
  postId: string;
  parentId?: string | null;
  mentions?: string[];
  likes: string[];
  createdAt: string;
  updatedAt: string;
  replies?: IComment[];
}
