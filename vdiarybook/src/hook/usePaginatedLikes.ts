import { useEffect, useRef, useState } from "react";
import likeApi from "@/services/like.service";
import { IUser } from "@/types/post.type";

const LIMIT = 10;

export default function usePaginatedLikes(postId: string) {
  const [users, setUsers] = useState<IUser[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Fetch API
  const fetchLikes = async (page: number) => {
    if (!postId || loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await likeApi.seeAllLikes(postId, page, LIMIT);
      const data = res.data.data;

      if (data.length < LIMIT) setHasMore(false);
      setUsers((prev) => [...prev, ...data]);
    } catch (error) {
      console.error("Error loading likes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when page changes
  useEffect(() => {
    fetchLikes(page);
  }, [page]);

  // IntersectionObserver
  useEffect(() => {
    if (!loadMoreRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => observerRef.current?.disconnect();
  }, [hasMore, loading]);

  const reset = () => {
    setUsers([]);
    setPage(1);
    setHasMore(true);
  };

  return {
    users,
    loading,
    hasMore,
    loadMoreRef,
    reset
  };
}
