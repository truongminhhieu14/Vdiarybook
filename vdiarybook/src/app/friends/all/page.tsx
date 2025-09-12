"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import friendApi from "@/services/friend.service";

import { useMutualFriendsBatch } from "@/hook/useMutualFriendsBatch";
import { getUserIdFromLocalStorage } from "@/utils/auth";
import { IFriend } from "@/types/friend.type";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import FriendActionMenu from "@/components/FriendActionMenu";
import SkeletonCard from "@/components/ui/skeleton-card";

export default function FriendsList() {
  const [friends, setFriends] = useState<IFriend[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const friendIds = friends.map((f) => f._id);
  const { mutualMap } = useMutualFriendsBatch(friendIds);
  const router = useRouter();

  useEffect(() => {
    setUserId(getUserIdFromLocalStorage());
  }, []);

  const fetchFriends = async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await friendApi.getAllFriend(pageNum, 10);
      const friendsList = res.data.data?.friends || [];
      const more = res.data.data?.pagination?.hasMore || false;

      if (pageNum === 1) {
        setFriends(friendsList);
      } else {
        setFriends((prev) => [...prev, ...friendsList]);
      }
      setHasMore(more);
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi khi tải danh sách bạn bè");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (userId) fetchFriends(page);
  }, [userId, page]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || loading) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setPage((prev) => prev + 1);
      }
    }, { threshold: 1 });

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, loading]);

  const handleUnFriend = async (friendId: string) => {
    try {
      await friendApi.unfriend(friendId);
      setFriends((prev) => prev.filter((f) => f._id !== friendId));
    } catch {
      toast.error("Hủy kết bạn thất bại!");
    }
  };

  if (!userId) {
    return (
      <div className="col-span-full text-center text-gray-500 py-12">
        Vui lòng đăng nhập để xem danh sách bạn bè.
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-full text-center text-red-500 py-12">
        {error}
      </div>
    );
  }

  return (
    <>
      {loading && ( <SkeletonCard count={10}/> )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {friends.length === 0 && !loading && (
          <div className="col-span-full text-center text-gray-500 py-12">
            Bạn chưa có bạn bè nào.
          </div>
        )}

        {friends.map((friend) => (
          <div
            key={friend._id}
            className="relative bg-white rounded-2xl border border-gray-200 shadow flex flex-col items-center p-6 group transition hover:shadow-lg"
          >
            <div
              className="absolute inset-0 z-0"
              onClick={() => router.push(`/profile/${friend._id}`)}
            />
            <div className="w-full h-24 relative mb-4 rounded-t-2xl overflow-hidden">
              <Image
                src={friend.background || "/assets/img/bg1.jpg"}
                alt="background"
                fill
                className="object-cover"
              />
            </div>

            <FriendActionMenu
              friend={friend}
              type="friend"
              onUnFriend={handleUnFriend}
            />

            <div className="relative mb-2 -mt-12">
              <Image
                src={friend.avatar || "/assets/img/trainers/hieu.jpg"}
                alt={friend.name}
                width={64}
                height={64}
                className="rounded-full border-4 border-white shadow-md object-cover bg-white"
              />
            </div>

            <div className="font-bold text-base text-gray-900 flex items-center gap-1 mb-1">
              {friend.name}
              {friend.verified && <span className="text-blue-500">✔️</span>}
            </div>

            <div className="flex items-center gap-1 mt-1 mb-2">
              {(mutualMap[friend._id]?.mutualFriends || [])
                .slice(0, 2)
                .map((mf, idx) => (
                  <Image
                    key={idx}
                    src={mf.avatar || "/assets/img/trainers/hieu.jpg"}
                    alt={mf.name}
                    width={20}
                    height={20}
                    className="rounded-full border-2 border-white -ml-2 first:ml-0 bg-white"
                  />
                ))}
              <span className="text-xs text-gray-500 ml-2">
                {mutualMap[friend._id]?.count || 0} mutual friends
              </span>
            </div>
          </div>
        ))}
      </div>

      {hasMore && <div ref={loadMoreRef} className="h-10 col-span-full" />}
    </>
  );
}
