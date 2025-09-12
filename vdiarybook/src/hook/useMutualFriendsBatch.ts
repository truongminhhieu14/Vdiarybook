import { useEffect, useState } from "react";
import { getMutualFriends } from "../services/friend.service"
import { IFriend } from "@/types/friend.type";

export function useMutualFriendsBatch(targetIds: string[]) {
  const [mutualMap, setMutualMap] = useState<{ [key: string]: { count: number; mutualFriends: IFriend[] } }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!targetIds || targetIds.length === 0) {
      setMutualMap({});
      return;
    }
    setLoading(true);
      getMutualFriends(targetIds)
      .then(res => {
        const data = res.data.data;
        if (data && typeof data.count === "number" && Array.isArray(targetIds) && targetIds.length === 1) {
          setMutualMap({ [targetIds[0]]: data });
        } else if (
          data &&
          typeof data === "object" &&
          !("count" in data)
        ) {
          setMutualMap(data);
        } else {
          setMutualMap({});
        }
      })
      .catch(() => setError("Không thể tải bạn chung"))
      .finally(() => setLoading(false));
  }, [JSON.stringify(targetIds)]);

  return { mutualMap, loading, error };
}