"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProfileBanner from "@/components/Profile/ProfileBanner";
import ProfileAction from "@/components/Profile/ProfileAction";
import ProfileFeed from "@/components/Profile/ProfileFeed";
import ProfileTableOfContents from "@/components/Profile/ProfileTableOfContents";
import Sidebar from "@/components/Profile/Sidebar";
import RightSideBar from "@/components/Profile/RightSideBar";
import { IProfile } from "@/types/auth.type";
import authApi from "@/services/auth.service";
import friendApi from "@/services/friend.service";
import FriendSection from "@/components/Profile/FriendSection";
import ProfilePosts from "@/components/Post/ProfilePosts";
import { IPost } from "@/types/post.type";
import { IFriend } from "@/types/friend.type";

export default function FriendProfilePage() {
  const { userId } = useParams();
  const [friends, setFriends] = useState<IFriend[]>([]);
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [friendCount, setFriendCount] = useState<number>(0);
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [relationship, setRelationship] = useState<
    "me" | "friend" | "not_friend" | "requested" | "following"
  >("not_friend");
  const [newPost, setNewPost] = useState<IPost | null>(null);

  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await authApi.getProfileById(userId as string);
        setProfile(res.data.user);
        setRelationship(res.data.relationship);
      } catch (err: any) {
        setError("Không tìm thấy thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    const fetchFriendCount = async () => {
      try {
        const res = await friendApi.getAllFriendById(userId as string);
        setFriends(res.data.data?.friends || []);
        setFriendCount(res.data.data.pagination.count || 0);
      } catch (e) {
        setFriends([]);
        setFriendCount(0);
      }
    };

    const fetchFollowerCount = async () => {
      try {
        const res = await friendApi.getAllFollowerById(userId as string);
        setFollowerCount(res.data.data.pagination.count || 0);
      } catch (e) {
        setFollowerCount(0);
      }
    };

    const fetchFollowingCount = async () => {
      try {
        const res = await friendApi.getAllFolowingById(userId as string);
        setFollowingCount(res.data.data.pagination.count || 0);
      } catch (e) {
        setFollowingCount(0);
      }
    };

    fetchProfile();
    fetchFriendCount();
    fetchFollowerCount();
    fetchFollowingCount();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Không tìm thấy profile</div>;

  return (
    <div className="relative h-screen bg-gray-100">
      <div className="hidden lg:block fixed top-[64px] left-0 h-full bg-white border-r z-20">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      <div className="hidden lg:block fixed top-0 right-0 h-full bg-white border-l z-20">
        <RightSideBar />
      </div>
      <main className="lg:ml-[240px] lg:mr-[260px] h-full overflow-y-auto px-4 py-2">
        <div className="max-w-4xl mx-auto bg-white">
          <ProfileBanner profile={profile} />
          <ProfileAction
            profile={{
              followerCount: followerCount,
              friendCount: friendCount,
              followingCount: followingCount,
            }}
            relationship={relationship}
            userId={profile?._id}
          />
          <div className="flex flex-col lg:flex-row w-full gap-4 px-2">
            <div className="w-full lg:w-1/3">
              <ProfileTableOfContents />
              <FriendSection friends={friends} totalCount={friendCount} userId={userId as string}/>
            </div>
            <div className="flex-1 space-y-3">
              <ProfileFeed profileUserId={profile._id}/>
              <ProfilePosts newPost={newPost} profileUserId={profile._id}/>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
