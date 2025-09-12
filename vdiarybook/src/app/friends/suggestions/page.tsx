"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";
import friendApi from "@/services/friend.service";
import { IFriend } from "@/types/friend.type";
import { useMutualFriendsBatch } from "@/hook/useMutualFriendsBatch";
import { getUserIdFromLocalStorage } from "@/utils/auth";
import { useRouter } from "next/navigation";
import FriendActionMenu from "@/components/FriendActionMenu";
import SkeletonCard from "@/components/ui/skeleton-card";

export default function SuggestionsList() {
  const [suggestions, setSuggestions] = useState<IFriend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const suggestionIds = suggestions.map((s) => s._id);
  const { mutualMap, loading: loadingMutual } = useMutualFriendsBatch(suggestionIds);
  const [userId, setUserId] = useState<string | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    setUserId(getUserIdFromLocalStorage());
  }, []);
  const fetchSuggestions = async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await friendApi.getSuggestions(pageNum, 10);
      const newSuggestions = res.data.data || [];
      const hasMore = res.data.pagination?.hasMore || false;

      if (pageNum === 1) {
          setSuggestions(newSuggestions);
        } else {
          setSuggestions(prev => [...prev, ...newSuggestions]);
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
      if(userId) fetchSuggestions(page);   
    },[userId, page]);

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
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [hasMore, loading]);

  const handleAddFriend = async (friendId: string) => {
    try {
      await friendApi.addFriend(friendId);
      setSuggestions(suggestions.filter((s) => s._id !== friendId));
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi khi thêm bạn");
    }
  };

  return (
    <>
    {loading && ( <SkeletonCard count={10}/> )}

     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {suggestions.length === 0 && (
        <div className="col-span-full text-center text-gray-500 py-12">
          Không có gợi ý kết bạn nào.
        </div>
      )}
      {suggestions.map((sug) => (
        <div
          key={sug._id}
          className="relative bg-white rounded-2xl border border-gray-200 shadow flex flex-col items-center p-6 group transition hover:shadow-lg"
        >
            <div
              className="absolute inset-0 z-0"
              onClick={() => router.push(`/profile/${sug._id}`)}
            />
          <FriendActionMenu
            friend={sug}
            type="suggestion"
            onAddFriend={handleAddFriend}
          />
          <div className="w-full h-24 relative mb-4 rounded-t-2xl overflow-hidden">
            <Image
              src={sug.background || "/assets/img/bg1.jpg"}
              alt="background"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative -mt-12 mb-2">
            <Image
              src={sug.avatar || "/assets/img/trainers/hieu.jpg"}
              alt={sug.name}
              width={64}
              height={64}
              className="rounded-full border-4 border-white shadow-md object-cover bg-white"
            />
          </div>
          <div className="font-semibold text-gray-900 flex items-center gap-1">
            {sug.name}
            {sug.verified && (
              <FaCheckCircle
                className="text-blue-500 text-sm ml-1"
                title="Verified"
              />
            )}
          </div>

          <div className="flex items-center gap-1 mt-1 mb-2">
            {(mutualMap[sug._id]?.mutualFriends || [])
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
              {mutualMap[sug._id]?.count} mutual friends
            </span>
          </div>
        </div>
      ))}
    </div>
    {hasMore && <div ref={loadMoreRef} className="h-10" />}
    </>
  );
}
