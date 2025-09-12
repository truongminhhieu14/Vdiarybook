"use client";

import { useEffect, useRef, useState } from "react";
import likeApi from "@/services/like.service";
import Image from "next/image";
import useDisableBodyScroll from "@/hook/useDisableBodyScroll";
import { useClickOutside } from "@/hook/useClickOutside";

interface LikeUser {
  _id: string;
  name: string;
  avatar: string;
}

interface ReactionGroup {
  reactionType: string;
  count: number;
  users: LikeUser[];
}

interface Props {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function LikeListModal({ postId, isOpen, onClose }: Props) {
  const [likeUsers, setLikeUsers] = useState<LikeUser[]>([]);
  const [reactionGroups, setReactionGroups] = useState<ReactionGroup[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readyToObserve, setReadyToObserve] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null!);
  const LIMIT = 10;

  const fetchReactions = async () => {
    try {
      setLoading(true);
      const res = await likeApi.getReactionOfPost(postId);      
      setReactionGroups(res.data.data)
    } catch (error) {
      setError("no")
    } finally {
      setLoading(false);
    }
  }
  const fetchLikes = async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await likeApi.seeAllLikes(postId, pageNum, LIMIT);
      const newLikes: LikeUser[] = res.data.data;
      const hasMore = newLikes.length === LIMIT;

      if (pageNum === 1) {
        setLikeUsers(newLikes);
      } else {
        setLikeUsers((prev) => {
          const ids = new Set(prev.map((u) => u._id));
          const filtered = newLikes.filter((u) => !ids.has(u._id));
          return [...prev, ...filtered];
        });
      }

      setHasMore(hasMore);
    } catch (err: any) {
      setError("Không thể tải danh sách đã thích");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && postId) {
      setLikeUsers([]);
      setPage(1);
      setHasMore(true);
      setReadyToObserve(false);
      fetchReactions()
      fetchLikes(1).then(() => {
        setReadyToObserve(true);
      });
    }
  }, [isOpen, postId]);

  useEffect(() => {
    if (page === 1 || !readyToObserve) return;
    fetchLikes(page);
  }, [page]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || loading || !readyToObserve) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1, rootMargin: "0px 0px 100px 0px" }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [hasMore, loading, readyToObserve]);

  useDisableBodyScroll(isOpen);
  useClickOutside(modalRef, onClose);
  if (!isOpen) return null;
  const allUsers = reactionGroups.flatMap((g) => g.users);
  const usersToShow =
    activeTab === "all"
      ? allUsers
      : reactionGroups.find((g) => g.reactionType === activeTab)?.users || [];


  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div
        ref={modalRef}
        className="bg-white w-[420px] max-h-[80vh] rounded-xl relative flex flex-col"
      >

        <div className="sticky top-0 z-10 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Danh sách cảm xúc</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ×
          </button>
        </div>

        <div className="flex border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "all"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600"
            }`}
          >
            Tất cả
          </button>
          {reactionGroups.map((g) => (
            <button
              key={g.reactionType}
              onClick={() => setActiveTab(g.reactionType)}
              className={`px-4 py-2 text-sm font-medium flex items-center gap-1 ${
                activeTab === g.reactionType
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-600"
              }`}
            >
              <span>
                {g.reactionType === "like" && "👍"}
                {g.reactionType === "haha" && "😆"}
                {g.reactionType === "love" && "❤️"}
                {g.reactionType === "sad" && "😢"}
                {g.reactionType === "wow" && "😮"}
                {g.reactionType === "angry" && "😡"}
              </span>
              {g.count}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto px-4 py-4 space-y-4 flex-1">
          {usersToShow.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={user.avatar || "/assets/img/user.png"}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span>{user.name}</span>
              </div>
              <button className="px-3 py-1 bg-gray-100 rounded-md text-sm hover:bg-gray-200">
                Nhắn tin
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
