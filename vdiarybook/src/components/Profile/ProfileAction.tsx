import { FaUserFriends } from "react-icons/fa";
import { BsChatDots } from "react-icons/bs";

interface Profile {
  followerCount: number;
  friendCount: number;
  followingCount: number;
}

interface ProfileActionProps {
  profile: Profile;
  relationship: "me" | "friend" | "not_friend" | "requested" | "following";
  userId: string;
}

export default function ProfileAction({ profile, relationship, userId }: ProfileActionProps) {

  const mascots = [
    "https://file.apetavers.com/api/files/users/67906b02e6458dd8d069a150/c4904a41-090e-4d8b-8b9e-e94f722093dc--150.png",
    "https://file.apetavers.com/api/files/users/67c54dce313fcf70599a9e66/6f14ce8a-4fee-4bd7-89ec-7d17375bd0b5--150.png",
    "https://file.apetavers.com/api/files/users/67906b02e6458dd8d069a150/d4ff5d6c-f6f1-410f-9849-673a1633ecc4--150.png"
  ];

  return (
    <div className="flex flex-col items-center mt-20 mb-4 w-full">
      <div className="flex space-x-2 mb-2 justify-start seft-start">
      </div>
      <div className="flex justify-end gap-6 w-auto mb-2">
        {mascots.map((src, idx) => (
          <img key={idx} src={src} alt="mascot" className="w-12 h-12 object-contain" />
        ))}
      </div>
      <div className="flex space-x-8 mb-2 text-center">
        <div>
          <div className="font-bold text-lg">{profile.followerCount}</div>
          <div className="text-gray-500 text-sm">Follower</div>
        </div>
        <div>
          <div className="font-bold text-lg">{profile.friendCount}</div>
          <div className="text-gray-500 text-sm">Friend</div>
        </div>
        <div>
          <div className="font-bold text-lg">{profile.followingCount}</div>
          <div className="text-gray-500 text-sm">Following</div>
        </div>
      </div>
      <div className="flex justify-end gap-2 w-full mb-2">
        {relationship === "friend" && (
          <>
            <button className="flex items-center gap-2 border border-blue-500 text-blue-600 bg-white font-semibold px-5 py-2 rounded-lg shadow-sm hover:bg-blue-50 transition">
              <FaUserFriends className="w-5 h-5" />
              Bạn bè
            </button>
            <button className="flex items-center gap-2 bg-blue-500 text-white font-semibold px-5 py-2 rounded-lg shadow-sm hover:bg-blue-600 transition">
              <BsChatDots className="w-5 h-5" />
              Trò chuyện
            </button>
          </>
        )}
        {relationship === "not_friend" && (
          <>
            <button className="flex items-center gap-2 bg-blue-500 text-white font-semibold px-5 py-2 rounded-lg shadow-sm hover:bg-blue-600 transition">
              <FaUserFriends className="w-5 h-5" />
              Kết bạn
            </button>
            <button className="flex items-center gap-2 border border-blue-500 text-blue-600 bg-white font-semibold px-5 py-2 rounded-lg shadow-sm hover:bg-blue-50 transition">
              <span className="text-lg">👁️</span>
              Theo dõi
            </button>
          </>
        )}
        {relationship === "requested" && (
          <button className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg font-semibold bg-white shadow-sm cursor-default" disabled>
            Đã gửi lời mời
          </button>
        )}
        {relationship === "following" && (
          <button className="border border-blue-100 text-blue-600 px-5 py-2 rounded-lg font-semibold bg-white shadow-sm cursor-default" disabled>
            Đang theo dõi
          </button>
        )}
      </div>
      <div className="hidden rounded md:flex gap-1 items-stretch flex-nowrap p-0 m-0 profile-feed-items min-w-max w-full overflow-auto justify-normal">
        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium bg-white hover:bg-gray-100 transition flex items-center">
          <span className="mr-2">🌐</span>Diary line
        </button>
        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium bg-white hover:bg-gray-100 transition flex items-center">
          <span className="mr-2">🌐</span>Website
        </button>
        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium bg-white hover:bg-gray-100 transition flex items-center">
          <span className="mr-2">👋</span>Introduce
        </button>
        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium bg-white hover:bg-gray-100 transition flex items-center">
          <span className="mr-2">👋</span>Friend
        </button>
        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium bg-white hover:bg-gray-100 transition flex items-center">
          <span className="mr-2">🎮</span>Giải trí
        </button>
        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium bg-white hover:bg-gray-100 transition flex items-center">
          <span className="mr-2">🚗</span>Driver
        </button>
        <button className="ml-auto border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium bg-white flex items-center justify-center">
          <span className="text-xl">…</span>
        </button>
      </div>
    </div>
  );
}