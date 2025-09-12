 "use client";

import ProfileBanner from "@/components/Profile/ProfileBanner";
import ProfileAction from "@/components/Profile/ProfileAction";
import ProfileFeed from "@/components/Profile/ProfileFeed";
import ProfileTableOfContents from "@/components/Profile/ProfileTableOfContents";
import Sidebar from "@/components/Profile/Sidebar";
import { useEffect, useState } from "react";
import { IProfile } from "@/types/auth.type";
import authApi from "@/services/auth.service";
import RightSideBar from "@/components/Profile/RightSideBar";
import friendApi from "@/services/friend.service";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";
import FriendSection from "@/components/Profile/FriendSection";
import { IFriend } from "@/types/friend.type";
import PhotoSection from "@/components/Profile/PhotoSection";
import ProfilePosts from "@/components/Post/ProfilePosts";
import { IPost } from "@/types/post.type";

export default function ProfilePage() {
  const [friends, setFriends] = useState<IFriend[]>([]);
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [friendCount, setFriendCount] = useState<number>(0);
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [relationship, setRelationship] = useState<"me" | "friend" | "not_friend" | "requested" | "following">("not_friend");
  const [newPost, setNewPost] = useState<IPost | null>(null);

  const dispatch = useDispatch();

  //   const handlePostCreated = (post: IPost) => {
  //   setNewPost(post);
  // };


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await authApi.getProfile();
        const updatedUser = res.data.user;
        dispatch(setUser(updatedUser));
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setProfile(res.data.user);
        setRelationship(res.data.relationship);
      } catch (err: any) {
        setError(err.response?.data?.message || "Lỗi khi tải thông tin profile");
      } finally {
        setLoading(false);
      }
    };

    const fetchFriends = async () => {
      try {
        const res = await friendApi.getAllFriend();
        setFriends(res.data.data?.friends || []);
        setFriendCount(res.data.data.pagination.count || 0);
      } catch (e) {
        setFriends([]);
        setFriendCount(0);    
      }
    }

    const fetchFollowerCount = async () => {
      try {
        const res = await friendApi.getFollowers();
        setFollowerCount(res.data.data.pagination.count || 0);
      } catch (e) {
        setFollowerCount(0);
      }
    }

    const fetchFollowingCount = async () => {
      try {
        const res = await friendApi.getFollowing();
        setFollowingCount(res.data.data.pagination.count || 0);
      } catch (e) {
        setFollowingCount(0);
      }
    }

    fetchProfile(); 
    fetchFriends();
    fetchFollowerCount();
    fetchFollowingCount();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Không tìm thấy profile</div>;

  return (
    <div className="relative h-screen bg-gray-100">
      <div className="hidden lg:block fixed top-[64px] left-0 h-full bg-white border-r z-20">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      <div className="hidden lg:block fixed top-0 right-0 h-full bg-white border-l z-20">
        <RightSideBar />
      </div>

      <main className="lg:ml-[240px] lg:mr-[260px] h-full overflow-y-auto px-4 py-2">
        <div className="max-w-4xl mx-auto bg-white">
          <ProfileBanner />

          <ProfileAction
            profile={{
              followerCount,
              friendCount,
              followingCount,
            }}
            relationship={relationship}
            userId={profile?._id}
          />

          <div className="flex flex-col lg:flex-row w-full gap-4 px-2">
            {/* Sidebar giữa */}
            <div className="w-full lg:w-1/3">
              <ProfileTableOfContents />
              <FriendSection friends={friends} totalCount={friendCount} userId=""/>
              <PhotoSection />
            </div>

            <div className="flex-1">
              <ProfileFeed profileUserId=""/>
              <ProfilePosts newPost={newPost} profileUserId={profile._id}/>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}