import { INotificationResponse, IUnreadCountResponse } from "@/types/notification.type";
import { AxiosResponse } from "axios";
import http from "./api.service"

const notificationApi = {
    getNotifications: async (page = 1, limit = 10): Promise<AxiosResponse<{data: INotificationResponse}>> => {
        return await http.get(`/notifications`, {
            params: { page, limit },
        });
    },

    getUnreadCount: async (): Promise<AxiosResponse<IUnreadCountResponse>> => {
        return await http.get(`/notifications/unread-count`);
    },

    markAsRead: async (notificationId: string): Promise<AxiosResponse<{ message: string }>> => {
        return await http.patch(`/notifications/${notificationId}/read`, {});
    },

    markAllAsRead: async (): Promise<AxiosResponse<{ message: string }>> => {
        return await http.patch(`/notifications/mark-all-read`, {});
    },

    deleteNotification: async (notificationId: string): Promise<AxiosResponse<{ message: string }>> => {
        return await http.delete(`/notifications/${notificationId}`);
    }
}

export default notificationApi;
