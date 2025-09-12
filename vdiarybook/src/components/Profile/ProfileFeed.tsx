import { useState } from "react";
import CreatePostModal from "@/components/Post/CreatePostModal";

interface ProfileFeedProps {
  profileUserId: string;
}

export default function ProfileFeed({profileUserId}: ProfileFeedProps) {
  const [openCreatePost, setOpenCreatePost] = useState(false);

  return (
    <div className="max-w-xl bg-white rounded-xl shadow p-4 border border-gray-200">
      <div className="flex items-center mb-2">
        <span className="font-bold text-gray-700 mr-2">Nhật ký</span>
        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs ml-2">Waiting post</span>
        <span className="ml-2 text-gray-400">|</span>
        <span className="ml-2 text-blue-500 cursor-pointer">Đóng góp</span>
        <span className="ml-2 text-blue-500 cursor-pointer">Bộ lọc</span>
      </div>
      <div className="mb-2">
        <button
          className="w-full border rounded px-3 py-2 text-sm text-left text-gray-500 hover:bg-gray-50"
          onClick={() => setOpenCreatePost(true)}
        >
          Hiếu, share your moments, memories của bạn nhé!
        </button>
      </div>
      <div className="flex space-x-2 mb-2">
        <button className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">Khoảnh khắc</button>
        <button className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-xs">Thông điệp</button>
        <button className="bg-pink-100 text-pink-600 px-2 py-1 rounded text-xs">Lời chúc đẹp</button>
        <button className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">Ai Gallery Store</button>
      </div>
      <div className="border-t pt-2">
        <div className="mb-2">
          <div className="font-semibold">Hiếu</div>
          <div className="text-gray-700 text-sm">Chào mọi người! Đây là nhật ký đầu tiên của mình.</div>
          <div className="text-xs text-gray-400">7:07 am</div>
        </div>
      </div>
      <CreatePostModal open={openCreatePost} onClose={() => setOpenCreatePost(false)} postedOn={profileUserId}/>
    </div>
  );
}