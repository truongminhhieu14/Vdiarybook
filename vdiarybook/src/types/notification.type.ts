import { IPost, IUser } from "./post.type";

export interface INotification {
  _id: string;
  receiverId: string;
  senderId: IUser
  type: "comment" | "like";
  postId?: IPost;
  message?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface INotificationResponse {
  notifications: INotification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface IUnreadCountResponse {
  count: number;
} 