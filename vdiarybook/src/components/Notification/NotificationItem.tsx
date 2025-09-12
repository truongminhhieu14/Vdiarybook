import React from "react";
import { Dot } from "lucide-react";
import { INotification } from "@/types/notification.type";

interface NotificationItemProps {
  notification: INotification;
}

export default function NotificationItem({ notification }: NotificationItemProps) {
  return (
    <li className="flex gap-3 items-start p-3 hover:bg-gray-50">
      <img
        src={notification.senderId.avatar || "/default-avatar.png"}
        alt="avatar"
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1 text-sm">
        <span className="font-medium">
          {notification.senderId.name || "Người dùng"}
        </span>{" "}
        {notification.type === "comment"
          ? "đã bình luận bài viết của bạn."
          : "đã thích bài viết của bạn."}
        <div className="text-xs text-gray-500">
          {new Date(notification.createdAt).toLocaleString("vi-VN")}
        </div>
      </div>
      {!notification.isRead && <Dot className="text-blue-500" />}
    </li>
  );
}
