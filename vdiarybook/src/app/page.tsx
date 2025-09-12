"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import ProfileFeed from "@/components/Profile/ProfileFeed";
import Sidebar from "@/components/Profile/Sidebar";
import RightSideBar from "@/components/Profile/RightSideBar";
import ProfilePosts from "@/components/Post/ProfilePosts";
import Stories from "@/components/Profile/Stories";

import { IProfile } from "@/types/auth.type";
import { IPost } from "@/types/post.type";
import authApi from "@/services/auth.service";
import { setUser } from "@/store/authSlice";

export default function ProfilePage() {
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [relationship, setRelationship] = useState<
    "me" | "friend" | "not_friend" | "requested" | "following"
  >("not_friend");
  const [newPost, setNewPost] = useState<IPost | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await authApi.getProfile();
        const updatedUser = res.data.user;
        dispatch(setUser(updatedUser));
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setProfile(updatedUser);
        setRelationship(res.data.relationship);
      } catch (err: any) {
        setError(err.response?.data?.message || "Lỗi khi tải thông tin profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!profile) return <div className="text-center py-20">Không tìm thấy profile</div>;

  return (
    <div className="relative h-screen bg-gray-100">

      <div className="hidden lg:block fixed top-[64px] left-0 h-full bg-white border-r z-20">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      <div className="hidden lg:block fixed top-0 right-0 h-full bg-white border-l z-20">
        <RightSideBar />
      </div>

      <main className="lg:ml-[240px] lg:mr-[260px] h-full overflow-y-auto px-4 py-2">
        <div className="max-w-xl mx-auto space-y-3">
          <Stories />
          <ProfileFeed profileUserId={profile._id}/>
          <ProfilePosts newPost={newPost} />
        </div>
      </main>
    </div>
  );
}
