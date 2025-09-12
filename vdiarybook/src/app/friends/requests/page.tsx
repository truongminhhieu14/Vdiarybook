"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";
import friendApi from "@/services/friend.service";
import { IFriendRequest } from "@/types/friend-request.type";
import { getUserIdFromLocalStorage } from "@/utils/auth";
import { useRouter } from "next/navigation";
import FriendActionMenu from "@/components/FriendActionMenu";
import SkeletonCard from "@/components/ui/skeleton-card";



export default function FriendRequestsList() {
  const [requests, setRequests] = useState<IFriendRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  const router = useRouter();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
    
  useEffect(() => {
    setUserId(getUserIdFromLocalStorage());
  }, []);
  const fetchFriendRequests = async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await friendApi.getFriendRequests(pageNum, 10);
      const requestList = res.data.data?.requests || [];
      const hasMore = res.data.data?.pagination?.hasMore || false;

      if (pageNum === 1) {
        setRequests(requestList);
      } else {
        setRequests((prev) => [...prev, ...requestList]);
      }
      setHasMore(hasMore);
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi khi tải danh sách bạn bè");
    } finally {
      setTimeout(() => {
          setLoading(false)
        }, 1000)
    }
  };

  useEffect(() => {
      if(userId) fetchFriendRequests(page);
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
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [hasMore, loading]);

  const handleAccept = async (recipientId: string) => {
    try {
      const res = await friendApi.acceptFriendRequest(recipientId);
      if (res.data.data) {
        setRequests((prev) => prev.filter((req) => req.requester._id !== recipientId));
      } else {
        alert("Không thể chấp nhận lời mời.");
      }
    } catch (error) {
      console.error("Không thể chấp nhận lời mời kết bạn", error);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const res = await friendApi.rejectFriendRequest(requestId);
      
      if (res.data && res.data.data) {
        setRequests((prev) => prev.filter((req) => req._id !== requestId));
      } else {
        alert("Không thể từ chối lời mời.");
      }
    } catch (error: any) {
      if (error?.response?.status === 400) {
        setRequests((prev) => prev.filter((req) => req._id !== requestId));
      } else {
        console.error("Không thể từ chối lời mời kết bạn", error?.response?.data || error);
        alert(error?.response?.data?.message || "Không thể từ chối lời mời.");
      }
    }
  };

  return (
   <>
      {loading && ( <SkeletonCard count={10}/> )}

      {/* Danh sách lời mời */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {!loading && requests.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-12">
            Không có lời mời kết bạn nào.
          </div>
        )}
        {requests.map((req) => {
          const user = req.requester;
          if (!user) return null;

          return (
            <div
              key={req._id}
              className="relative bg-white rounded-2xl border border-gray-200 shadow flex flex-col items-center p-6 group transition hover:shadow-lg"
            >
              <div
              className="absolute inset-0 z-0"
              onClick={() => router.push(`/profile/${user._id}`)}
            />
              <FriendActionMenu
                friend={{
                  _id: user._id,
                  name: user.name,
                  avatar: user.avatar,
                  background: user.background || "",
                  verified: user.verified || false,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                }}
                type="request"
                onAccept={() => handleAccept(user._id)}
                onDenied={() => handleReject(req._id)}
              />
              <div className="w-full h-24 relative mb-4 rounded-t-2xl overflow-hidden">
                <Image
                  src={user.background || "/assets/img/bg1.jpg"}
                  alt="background"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="relative -mt-12 mb-2">
                <Image
                  src={user.avatar || "/assets/img/trainers/hieu.jpg"}
                  alt={user.name}
                  width={64}
                  height={64}
                  className="rounded-full border-4 border-white shadow-md object-cover bg-white"
                />
              </div>

              <div className="font-semibold text-gray-900 flex items-center gap-1">
                {user.name}
                {user.verified && (
                  <FaCheckCircle
                    className="text-blue-500 text-sm ml-1"
                    title="Verified"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && !loading && <div ref={loadMoreRef} className="h-10" />}
    </>
  );
}
