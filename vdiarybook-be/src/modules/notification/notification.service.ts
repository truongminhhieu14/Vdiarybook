import { Notification } from "./notification.model";
import { Types } from "mongoose";

export class NotificationService {
  async createNotification(data: {
    receiverId: string;
    senderId: string;
    type: "comment" | "like";
    postId?: string;
    message?: string;
  }) {
    return await Notification.create({
      receiverId: new Types.ObjectId(data.receiverId),
      senderId: new Types.ObjectId(data.senderId),
      type: data.type,
      postId: data.postId ? new Types.ObjectId(data.postId) : undefined,
      message: data.message,
      isRead: false,
    });
  }

  async getNotificationsByUserId(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const notifications = await Notification.find({ receiverId: userId })
      .populate('senderId', 'name avatar')
      .populate('postId', 'content images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments({ receiverId: userId });
    const hasMore = skip + notifications.length < total;

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        hasMore,
      },
    };
  }

  async markAsRead(notificationId: string, userId: string) {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, receiverId: userId },
      { isRead: true },
      { new: true }
    );
  }

  async markAllAsRead(userId: string) {
    return await Notification.updateMany(
      { receiverId: userId, isRead: false },
      { isRead: true }
    );
  }

  async getUnreadCount(userId: string) {
    return await Notification.countDocuments({
      receiverId: userId,
      isRead: false,
    });
  }

  async deleteNotification(notificationId: string, userId: string) {
    return await Notification.findOneAndDelete({
      _id: notificationId,
      receiverId: userId,
    });
  }
}

export const notificationService = new NotificationService(); 