"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import friendApi from "@/services/friend.service";
import { useMutualFriendsBatch } from "@/hook/useMutualFriendsBatch";
import { getUserIdFromLocalStorage } from "@/utils/auth";
import { IFollowing } from "@/types/friend.type";
import { useRouter } from "next/navigation";
import FriendActionMenu from "@/components/FriendActionMenu";
import SkeletonCard from "@/components/ui/skeleton-card";

export default function FollowingList() {
  const [following, setFollowing] = useState<IFollowing[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const followingIds = following.map((f) => f.recipient._id);
  const { mutualMap, loading: loadingMutual  } = useMutualFriendsBatch(followingIds);

  const [userId, setUserId] = useState<string | null>(null);
  
    useEffect(() => {
      setUserId(getUserIdFromLocalStorage());
    }, []);
  const fetchFollowing = async (pageNum: number) => {
    try {
        setLoading(true);
        const res = await friendApi.getFollowing(pageNum, 10);
        const followingList = res.data.data?.following || [];
        const hasMore = res.data.data?.pagination?.hasMore || false;

        if (pageNum === 1) {
          setFollowing(followingList);
        } else {
          setFollowing(prev => [...prev, ...followingList]);
        }
        setHasMore(hasMore);
      } catch (err: any) {
        setError(err.response?.data?.message || "Lỗi khi tải danh sách bạn bè");
      }finally {
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      }
    };

    useEffect(() => {
      if(userId) fetchFollowing(page);
      console.log("page", page)
    }, [userId, page]);

    const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };
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


  const handleUnfollow = async (userId: string) => {
    try {
      await friendApi.unfollow(userId);
      setFollowing(following.filter((f) => f.recipient._id !== userId));
    } catch (error) {
      alert("Unfollow failed!");
    }
  };

  return (
    <>
    {loading && ( <SkeletonCard count={10}/> )}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {following.length === 0 && (
        <div className="col-span-full text-center text-gray-500 py-12">
          Bạn chưa theo dõi ai.
        </div>
      )}
      {following.map((f) => {
        const user = f.recipient;
        if (!user || !user._id) return null;

        return (
          <div
            key={user._id}
            onClick={()=> router.push(`/profile/${user._id}`)}
            className="relative bg-white rounded-2xl border border-gray-200 shadow flex flex-col items-center p-6 group transition hover:shadow-lg"
          >
            <div className="w-full h-24 relative mb-4 rounded-t-2xl overflow-hidden">
              <Image
                src={user.background || "/assets/img/banner.png"}
                alt="background"
                fill
                className="object-cover"
              />
            </div>

            <FriendActionMenu
              friend={{
                _id: user._id,
                name: user.name,
                avatar: user.avatar || "/assets/img/trainers/hieu.jpg",
                background: user.background || "/assets/img/bg1.jpg",
                verified: user.verified || false,
                createdAt: new Date(),
                updatedAt: new Date(),
              }}
              type="following"
              onUnFriend={handleUnfollow}
            />
            <div className="relative w-20 h-20 mb-2 -mt-12">
              <Image
                src={user.avatar || "/assets/img/trainers/hieu.jpg"}
                alt={user.name}
                width={80}
                height={80}
                className="rounded-full border-4 border-white shadow-md object-cover bg-white"
              />
            </div>

            <div className="font-bold text-base text-gray-900 flex items-center gap-1 mb-1">
              {user.name}
              {user.verified && <span className="text-blue-500">✔️</span>}
            </div>

            <div className="flex items-center gap-1 mt-1 mb-2">
              {(mutualMap[user._id]?.mutualFriends || [])
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
                {mutualMap[user._id]?.count} mutual friends
              </span>
            </div>
          </div>
        );
      })}
    </div>
   
    </>
  );
}
