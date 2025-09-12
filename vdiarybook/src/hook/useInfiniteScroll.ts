import { useEffect, useRef } from "react";

export function useInfiniteScroll({
  hasMore,
  loading,
  onLoadMore
}: {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
}) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const firtsRenderRef = useRef(true)

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || loading) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (firtsRenderRef.current) {
          firtsRenderRef.current = false;
          return;
        }
        onLoadMore();
      }
    }, { threshold: 1 });

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [hasMore, loading, onLoadMore]);

  return loadMoreRef;
}
