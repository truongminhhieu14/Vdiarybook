import { Router } from "express";
import { verifyToken } from "~/middleware/auth.middleware";
import { wrapAsync } from "~/utils/handler";
import {
  getNotificationsController,
  markAsReadController,
  markAllAsReadController,
  getUnreadCountController,
  deleteNotificationController,
} from "./notification.controller";

const router = Router();

router.get("/", verifyToken, wrapAsync(getNotificationsController));
router.get("/unread-count", verifyToken, wrapAsync(getUnreadCountController));
router.patch("/:notificationId/read", verifyToken, wrapAsync(markAsReadController));
router.patch("/mark-all-read", verifyToken, wrapAsync(markAllAsReadController));
router.delete("/:notificationId", verifyToken, wrapAsync(deleteNotificationController));

export default router; 