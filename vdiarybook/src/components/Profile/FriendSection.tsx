import React, { use } from "react";
import { IFriend } from "@/types/friend.type";
import Link from "next/link";

interface FriendSectionProps {
  friends: IFriend[];
  totalCount: number;
  userId: string;
}

const FriendSection: React.FC<FriendSectionProps> = ({ friends, totalCount, userId }) => (
  <div className="bg-white rounded-lg shadow p-2 mb-4">
    <div className="flex justify-between items-center mb-2">
      <span className="font-bold">Bạn bè ({totalCount})</span>
      <Link href={`/profile/${userId}/friends`} className="text-blue-500 text-sm">Xem tất cả</Link>
    </div>
    {friends.length === 0 ? (
      <div className="text-gray-400 text-sm">Chưa có bạn bè</div>
    ) : (
      <div className="grid grid-cols-3 gap-2">
        {friends.slice(0, 9).map(friend => (
          <div key={friend._id} className="flex flex-col items-center">
            <img
              src={friend.avatar || "/assets/img/user.png"}
              alt={friend.name}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div className="font-semibold text-red-700 truncate max-w-[70px] text-center text-sm">
              {friend.name}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default FriendSection;