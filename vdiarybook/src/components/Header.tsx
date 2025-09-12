"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Bell, MessageCircle, Users, Star, Home, Settings, SidebarOpen } from "lucide-react";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/store/authSlice";
import authApi from "@/services/auth.service";
import { clearLocalStorage } from "@/utils/auth";
import NotificationDropdown from "./Notification/NotificationDropdown";
   

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);



  const handleLogout = async () => {
    try {
      await authApi.logOut();
      clearLocalStorage();
      dispatch(logout());
      toast.success("Logout successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    }
    if (isAccountMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAccountMenuOpen]);

  return (
    <header className="sticky top-0 w-full z-50 h-16 bg-white shadow px-2 sm:px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-blue-600 hover:text-blue-800">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <img src="https://openweathermap.org/img/w/04d.png" alt="weather" className="w-8 h-8" />
          <div className="text-sm leading-4">
            <span className="text-green-600 font-semibold">Da Nang, 34.43°C</span>
            <p className="text-gray-500 text-xs">mây đen u ám</p>
          </div>
        </div>
      </div>

      {user && (
        <div className="flex-1 flex items-center justify-center gap-3">
          <div className="relative">
            <img 
              src={user.avatar || "/assets/img/user.png"} 
              alt="avatar" 
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"             
            />
            <img src={`/assets/img/${user.country || "vn"}.png`} alt="flag" className="absolute -top-1 -left-1 w-4 h-4 rounded-full border border-white" />
          </div>
          <span className="font-bold text-blue-600 flex items-center gap-1">
            {user.name.length > 18 ? user.name.slice(0, 16) + "..." : user.name}
            {user.verified && <img src="/icons/verified.svg" alt="verified" className="w-4 h-4" />}
            {user.badge && <img src="/icons/badge.svg" alt="badge" className="w-4 h-4" />}
          </span>

          <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-3 py-1 text-gray-600 cursor-pointer">
            <Users className="w-5 h-5 mr-1" />
            <span>Mọi người</span>
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
          </div>

          <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1 ml-2 w-[320px] max-w-xs">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              className="bg-transparent outline-none flex-1 text-sm"
              placeholder="Nhập tên bạn bè, nhóm, trang, VDB ID,..."
              value={search}
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
        </div>
      )}


      <div className="flex items-center gap-3">
        {user ? (
          <>
            <button className="relative bg-gray-100 rounded-full p-2 hover:bg-gray-200">
              <Settings className="w-5 h-5 text-gray-500" />
            </button>
            <button className="relative bg-gray-100 rounded-full p-2 hover:bg-gray-200">
              <Home className="w-5 h-5 text-gray-500" />
              <span className="absolute -top-1 -right-2 bg-blue-500 text-white text-[10px] rounded-full px-1">new</span>
            </button>
            <div className="relative">
              <NotificationDropdown />
            </div>
            <button className="relative bg-gray-100 rounded-full p-2 hover:bg-gray-200">
              <MessageCircle className="w-5 h-5 text-gray-500" />
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">49</span>
            </button>
            <button className="relative bg-gray-100 rounded-full p-2 hover:bg-gray-200">
              <Users className="w-5 h-5 text-gray-500" />
            </button>

            <div className="relative" ref={accountMenuRef}>
              <div
                className="relative cursor-pointer"
                onClick={() => setIsAccountMenuOpen((v) => !v)}
                title="Tài khoản"
              >
                <img 
                  src={user.avatar || "/assets/img/user.png"} 
                  alt="user" 
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
                <img src={`/assets/img/${user.country || "vn"}.png`} alt="flag" className="absolute -top-1 -left-1 w-4 h-4 rounded-full border border-white" />
              </div>

              {isAccountMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg z-50 p-4 animate-fade-in"
                >

                  <div className="flex items-center gap-3 mb-3 hover:bg-gray-100"
                  onClick={() => router.push("/profile")}
                  >
                    <div className="relative">
                      <img src={user.avatar || "assets/img/user.png"} alt="avatar" className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover" />
                      <img src={`/assets/img/${user.country || "vn"}.png`} alt="flag" className="absolute -top-1 -left-1 w-5 h-5 rounded-full border border-white" />
                    </div>
                    <div>
                      <div className="font-bold text-blue-600 flex items-center gap-1">
                        {user.name}
                        {user.verified && <img src="/icons/verified.svg" alt="verified" className="w-4 h-4" />}
                        {user.badge && <img src="/icons/badge.svg" alt="badge" className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded px-2 py-1">
                      <Settings className="w-5 h-5 text-blue-500" />
                      <span>Cài đặt tài khoản</span>
                    </li>
                    <li className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded px-2 py-1">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 8l4 4-4 4M21 12H3" /></svg>
                      <span>Liên kết giới thiệu</span>
                    </li>
                    <li className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded px-2 py-1">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M16 3v4a1 1 0 0 0 1 1h4" /></svg>
                      <span>Cài đặt trang cá nhân</span>
                    </li>
                    <li className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded px-2 py-1 text-blue-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 19V5m7 7H5" /></svg>
                      <span>Chuyển tài khoản</span>
                    </li>
                    <li className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded px-2 py-1">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
                      <span>Trung tâm hỗ trợ</span>
                    </li>
                    <li className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded px-2 py-1">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /></svg>
                      <span>Hoạt động</span>
                    </li>
                    <li
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded px-2 py-1 text-red-500"
                      onClick={() => {handleLogout(), setIsAccountMenuOpen(false)}}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
                      <span>Đăng xuất</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push("/login")}
              className="bg-blue-600 text-white px-4 py-2 rounded mr-2 hover:bg-blue-700"
            >
              Đăng nhập
            </button>
            <button
              onClick={() => router.push("/register")}
              className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50"
            >
              Đăng kí ngay
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
