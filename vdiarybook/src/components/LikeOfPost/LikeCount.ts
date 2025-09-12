import likeApi from "@/services/like.service";
import { useEffect, useState } from "react";

const useLikeCount = (postId: string) => {
  const [likeCount, setLikeCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    if (!postId) return;

    const fetchLikeCount = async () => {
      try {
        setLoading(true);
        const res = await likeApi.seeAllLikes(postId);
        setLikeCount(res.data.pagination.count);
        setError(null);
      } catch (err: any) {
        setError(err?.message || "Lỗi khi tải số lượt like");
      } finally {
        setLoading(false);
      }
    };

    fetchLikeCount();
  }, [postId]);

  return { likeCount, loading, };
};

export default useLikeCount;
