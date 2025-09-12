import { useContext, useEffect, useRef, useState } from "react";
import { Bell, Dot } from "lucide-react";
import { cn } from "@/lib/utils";
import notificationApi from "@/services/notification.service";
import { INotification } from "@/types/notification.type";
import { AppContext } from "@/context/app.context";
import { useInfiniteScroll } from "@/hook/useInfiniteScroll";
import NotificationItem from "./NotificationItem";

function isToday(dateString: string) {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const notificationRef = useRef<HTMLDivElement>(null);

  const { socket, user } = useContext(AppContext);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const filtered =
    filter === "all" ? notifications : notifications.filter((n) => !n.isRead);

  const todayNotifications = filtered.filter((n) => isToday(n.createdAt));
  const previousNotifications = filtered.filter((n) => !isToday(n.createdAt));

  const fetchNotifications = async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await notificationApi.getNotifications(pageNum, 10);
      const newData = res.data?.data.notifications || [];
      const more = res.data?.data?.pagination?.hasMore || false;

      if (pageNum === 1) {
        setNotifications(newData);
      } else {
        setNotifications((prev) => [...prev, ...newData]);
      }
      setHasMore(more);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && user) {
      setPage(1);
      fetchNotifications(1);
    }
  }, [open, user]);

  useEffect(() => {
    if (!socket || !user) return;

    const handleNewNotification = (notification: INotification) => {
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on("new-notification", handleNewNotification);

    return () => {
      socket.off("new-notification", handleNewNotification);
    };
  }, [socket, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const loadMoreRef = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: () => setPage((prev) => prev + 1),
  });

  useEffect(() => {
    if (page > 1 && open) {
      fetchNotifications(page);
    }
  }, [page, open]);

  return (
    <div className="relative inline-block text-left" ref={notificationRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200"
      >
        <Bell className="w-5 h-5 text-gray-500" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[360px] bg-white shadow-lg rounded-xl z-50">
          <div className="p-3 border-b font-semibold text-lg">Thông báo</div>
          <div className="flex gap-2 px-3 py-2 border-b">
            <button
              className={cn(
                "text-sm",
                filter === "all" && "font-semibold text-blue-600"
              )}
              onClick={() => setFilter("all")}
            >
              Tất cả
            </button>
            <button
              className={cn(
                "text-sm",
                filter === "unread" && "font-semibold text-blue-600"
              )}
              onClick={() => setFilter("unread")}
            >
              Chưa đọc
            </button>
          </div>
          <ul className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="grid grid-cols-1 gap-3 p-3">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="flex gap-3 items-center animate-pulse"
                  >
                    <div className="w-10 h-10 bg-gray-300 rounded-full" />
                    <div className="flex-1">
                      <div className="h-3 bg-gray-300 rounded w-1/2 mb-2" />
                      <div className="h-2 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <li className="text-center text-sm text-gray-500 py-6">
                Không có thông báo nào
              </li>
            ) : (
              <>
                {todayNotifications.length > 0 && (
                  <>
                    <li className="px-3 py-1 font-semibold text-gray-700 bg-gray-100 sticky top-0">
                      Hôm nay
                    </li>
                    {todayNotifications.map((n) => (
                      <NotificationItem key={n._id} notification={n} />
                    ))}
                  </>
                )}

                {previousNotifications.length > 0 && (
                  <>
                    <li className="px-3 py-1 font-semibold text-gray-700 bg-gray-100 sticky top-0 mt-2">
                      Trước đó
                    </li>
                    {previousNotifications.map((n) => (
                      <NotificationItem key={n._id} notification={n} />
                    ))}
                  </>
                )}
              </>
            )}
            {hasMore && <div ref={loadMoreRef} className="h-10" />}
          </ul>
        </div>
      )}
    </div>
  );
}
