"use client";
import React, { useEffect, useState } from "react";
import { IFollowing, IFriend } from "@/types/friend.type";
import friendApi from "@/services/friend.service";
import ProfileAction from "@/components/Profile/ProfileAction";
import ProfileBanner from "@/components/Profile/ProfileBanner";
import authApi from "@/services/auth.service";
import { IProfile } from "@/types/auth.type";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Profile/Sidebar";
import RightSideBar from "@/components/Profile/RightSideBar";
import { useInfiniteScroll } from "@/hook/useInfiniteScroll";

export default function FriendsPage() {
  const [friends, setFriends] = useState<IFriend[]>([]);
  const [suggestion, setSuggestion] = useState<IFriend[]>([]);
  const [following, setFollowing] = useState<IFollowing[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "invite" | "following">("all");
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [friendCount, setFriendCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [suggestionCount, setSuggestionCount] = useState<number>(0);
  const [relationship, setRelationship] = useState<
    "me" | "friend" | "not_friend" | "requested" | "following"
  >("not_friend");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const router = useRouter();
  const { userId } = useParams();

  const fetchFriends = async (pageNum: number) => {
  if (loading) return;
  setLoading(true);
  try {
    const res = await friendApi.getAllFriendById(userId as string, pageNum, 10);
    const friendList = res.data.data?.friends || [];
    const totalCount = res.data.data?.pagination?.count || 0;

    setFriendCount(totalCount);

    setFriends((prev) => {
      const merged = [...prev, ...friendList];
      const unique = Array.from(new Map(merged.map(f => [f._id, f])).values());
      return unique;
    });

    setHasMore(pageNum * 10 < totalCount);
    setPage(pageNum);
  } catch (err: any) {
    setError(err.message || "Đã xảy ra lỗi khi tải bạn bè");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const [resSuggestions, resProfile, resFollowers, resFollowing] =
          await Promise.all([
            friendApi.getSuggestions(),
            authApi.getProfileById(userId as string),
            friendApi.getAllFollowerById(userId as string),
            friendApi.getAllFolowingById(userId as string),
          ]);

        const suggestionList = resSuggestions.data.data || [];
        setSuggestion(suggestionList);
        setSuggestionCount(
          resSuggestions.data.pagination?.count || suggestionList.length || 0
        );

        setProfile(resProfile.data.user);
        setRelationship(resProfile.data.relationship);
        setFollowerCount(resFollowers.data.data?.pagination?.count || 0);

        setFollowing(resFollowing.data.data?.following || []);
        setFollowingCount(resFollowing.data.data?.pagination?.count || 0);
        fetchFriends(1);
      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi");
      }
    };

    fetchInit();
  }, [userId]);

  const onLoadMore = () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFriends(nextPage);
  };

  const loadMoreRef = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore,
  });

  const filteredFriends = friends.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative bg-gray-100 h-screen">
      {/* Sidebar fixed left */}
      <div className="hidden lg:block fixed top-[64px] left-0 h-full bg-white border-r z-20">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* Main content center */}
      <main className="lg:ml-[240px] lg:mr-[260px] h-full overflow-y-auto px-4 py-2">
        <div className="bg-white max-w-4xl mx-auto">
          {profile && (
            <>
              <ProfileBanner profile={profile} />
              <ProfileAction
                profile={{
                  followerCount,
                  friendCount,
                  followingCount,
                }}
                relationship={relationship}
                userId={profile?._id}
              />
            </>
          )}

          <div className="bg-white rounded-xl shadow p-4 mt-6 w-full">
            <div className="flex items-center text-2xl font-bold mb-2">
              <span className="mr-2">👥</span>Bạn bè
            </div>

            {/* Tabs */}
            <div className="flex items-center border-b mb-4 space-x-4">
              {[
                { key: "all", label: "Tất cả bạn bè", count: friendCount },
                { key: "following", label: "Đang theo dõi", count: followingCount },
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  className={`px-4 py-2 font-semibold border-b-2 focus:outline-none ${
                    activeTab === key
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-600"
                  }`}
                  onClick={() => setActiveTab(key as any)}
                >
                  {label} <span className="text-red-500">{count}</span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <input
                className="w-full border rounded px-10 py-2"
                placeholder="Nhập tên bạn bè, nhóm, trang, VDB ID, ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>

            {/* Friend cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeTab === "all" &&
                filteredFriends.map((friend) => (
                  <FriendCard
                    key={friend._id}
                    user={friend}
                    label="Bạn"
                    actionLabel="Trò chuyện"
                    onClick={() => router.push(`/profile/${friend._id}`)}
                  />
                ))}

              {activeTab === "invite" &&
                suggestion.map((sug) => (
                  <FriendCard
                    key={sug._id}
                    user={sug}
                    label="Kết bạn"
                    actionLabel="Ẩn"
                    primary
                    onClick={() => router.push(`/profile/${sug._id}`)}
                  />
                ))}

              {activeTab === "following" &&
                following.map((fol) => (
                  <FriendCard
                    key={fol._id}
                    user={fol.recipient}
                    label="Đang theo dõi"
                    actionLabel="Bỏ theo dõi"
                    onClick={() => router.push(`/profile/${fol.recipient._id}`)}
                  />
                ))}
            </div>

            {/* sentinel cho infinite scroll */}
            {activeTab === "all" && <div ref={loadMoreRef} className="h-10" />}
            {loading && <p className="text-center">Đang tải...</p>}
          </div>
        </div>
      </main>

      {/* Right Sidebar fixed */}
      <div className="hidden lg:block fixed top-0 right-0 h-full bg-white border-l z-20">
        <RightSideBar />
      </div>
    </div>
  );
}

// Subcomponent
function FriendCard({
  user,
  label,
  actionLabel,
  primary = false,
  onClick,
}: {
  user: any;
  label: string;
  actionLabel: string;
  primary?: boolean;
  onClick: () => void;
}) {
  return (
    <div className="bg-white border rounded-lg p-3 flex items-center shadow gap-3">
      <img
        src={user.avatar || "/assets/img/user.png"}
        className="w-14 h-14 rounded-full object-cover border"
        alt={user.name}
      />
      <div className="flex-1">
        <div
          className="font-bold text-lg flex items-center cursor-pointer"
          onClick={onClick}
        >
          {user.name}
          {user.verified && <span className="ml-1 text-blue-500">✔</span>}
        </div>
        <div className="text-xs text-gray-500">0 Bạn chung</div>
        <div className="flex gap-2 mt-2">
          <button
            className={`${
              primary
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            } px-3 py-1 rounded text-sm`}
          >
            {label}
          </button>
          <button
            className={`${
              primary
                ? "bg-gray-200 text-gray-700"
                : "bg-red-100 text-red-700"
            } px-3 py-1 rounded text-sm`}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
