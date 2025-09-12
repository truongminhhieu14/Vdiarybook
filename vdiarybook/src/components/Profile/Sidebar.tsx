"use client";
import { motion } from "framer-motion";
import { headerData } from "@/constant";
import { HeaderMenuItem } from "@/types/menu.type";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <aside
      className={`fixed top-[64px] left-0 z-20 bg-white border-r transition-all duration-300 
              ${isOpen ? "w-64" : "w-16"} h-[calc(100vh-64px)] flex flex-col`}
    >
      <button
        onClick={onToggle}
        className="p-1 rounded hover:bg-blue-50 self-end"
        aria-label="Thu nhỏ/mở rộng sidebar"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div
        className={`font-bold text-blue-600 text-xl mb-1 px-6 ${
          !isOpen && "hidden"
        }`}
      >
        Vdiarybook
      </div>
      <div className={`text-pink-500 mb-4 px-6 ${!isOpen && "hidden"}`}>
        Chào buổi tối
      </div>

      <div className="overflow-auto scrollbar-hide">
        <ul className="flex-1 overflow-y-auto px-2">
          {headerData?.map((item: HeaderMenuItem, index) => (
            <motion.li
              key={item.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
              whileHover={{
                scale: 1.03,
                backgroundColor: "#eff6ff",
              }}
              className="flex items-center py-2 px-2 rounded cursor-pointer"
            >
              <Link href={item.href} className="flex items-center w-full">
                {item.icon && <span className="mr-2 text-xl">{item.icon}</span>}
                {isOpen && <span className="text-gray-700">{item.title}</span>}
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
