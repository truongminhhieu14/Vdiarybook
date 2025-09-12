import { AuthRequest } from "~/middleware/auth.middleware";
import { Response } from "express";
import { notificationService } from "./notification.service";
import { httpStatus } from "~/constants/httpStatus";

export const getNotificationsController = async (req: AuthRequest, res: Response) => {
  const userId = req.userId as string;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await notificationService.getNotificationsByUserId(userId, page, limit);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Lấy danh sách thông báo thành công",
    data: result,
  });
};

export const markAsReadController = async (req: AuthRequest, res: Response) => {
  const userId = req.userId as string;
  const { notificationId } = req.params;

  const notification = await notificationService.markAsRead(notificationId, userId);

  if (!notification) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: "Không tìm thấy thông báo",
    });
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "Đã đánh dấu thông báo là đã đọc",
    data: notification,
  });
};

export const markAllAsReadController = async (req: AuthRequest, res: Response) => {
  const userId = req.userId as string;

  await notificationService.markAllAsRead(userId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Đã đánh dấu tất cả thông báo là đã đọc",
  });
};

export const getUnreadCountController = async (req: AuthRequest, res: Response) => {
  const userId = req.userId as string;

  const count = await notificationService.getUnreadCount(userId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Lấy số lượng thông báo chưa đọc thành công",
    data: { count },
  });
};

export const deleteNotificationController = async (req: AuthRequest, res: Response) => {
  const userId = req.userId as string;
  const { notificationId } = req.params;

  const notification = await notificationService.deleteNotification(notificationId, userId);

  if (!notification) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: "Không tìm thấy thông báo",
    });
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "Đã xóa thông báo thành công",
  });
}; 