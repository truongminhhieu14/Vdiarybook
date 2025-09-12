"use client";

import { FaUserFriends, FaUserPlus, FaUserCheck, FaUser } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function FriendsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentTab = pathname.split("/").pop();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex w-72 bg-white rounded-xl shadow border border-gray-200 flex-col pt-6 pb-4 px-4 min-h-[calc(100vh-32px)] mx-2 my-2">
        <h2 className="text-2xl font-bold mb-6 pl-2 tracking-wide">Friends</h2>
        <nav className="flex-1">
          <ul className="space-y-1">
            <li>
              <Link
                href="/friends/all"
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg font-semibold ${
                  currentTab === "all"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaUserFriends className="text-lg" />
                All
              </Link>
            </li>
            <li>
              <Link
                href="/friends/suggestions"
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg font-semibold ${
                  currentTab === "suggestions"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaUserPlus className="text-lg" />
                Suggestions
              </Link>
            </li>
            <li>
              <Link
                href="/friends/requests"
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg font-semibold ${
                  currentTab === "requests"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaUserCheck className="text-lg" />
                Friend requests
              </Link>
            </li>
            <li>
              <Link
                href="/friends/invitation-sent"
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg font-semibold ${
                  currentTab === "invitation-sent"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaUserCheck className="text-lg" />
                Invitation sent
              </Link>
            </li>
            <li>
              <Link
                href="/friends/following"
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg font-semibold ${
                  currentTab === "following"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaUser className="text-lg" />
                Following
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Banner */}
        <div className="w-full h-48 relative">
          <Image
            src="/assets/img/banner.png"
            alt="Banner"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Search and header */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-8 pt-4 pb-2 flex flex-col gap-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex items-end gap-2">
              <h3 className="text-xl font-bold text-gray-800">Friends</h3>
              <span className="text-blue-600 font-semibold text-base">
                {/* {(friendCount ?? 0).toLocaleString()} friends */}
              </span>
            </div>
            <div className="relative w-80">
              <input
                type="text"
                placeholder="Enter friends' names, VDB ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>


        {/* Content thay đổi */}
        <div className="flex-1 overflow-y-auto px-2 py-2 bg-gray-50">
          {children}
        </div>
      </main>
    </div>
  );
}
