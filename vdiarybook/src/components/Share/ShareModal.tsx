"use client";
import {
  PlusSquare, Link, MessageSquare, Users, FileText,
  Flag, Download, Code, ArrowRightSquare, Bell
} from 'lucide-react';
import { useState } from "react";
import SharePostModal from "@/components/Share/SharePostModal";
import { IPost } from "@/types/post.type";
import ShareExternalModal from './ShareExternalModal';

type Props = {
  post: IPost;
};

const menuSections = [
  [
    { icon: PlusSquare, label: 'Chia sẻ nhanh', action: () => {} },
    { icon: FileText, label: 'Tạo bài đăng mới', action: "sharePost" },
    { icon: Users, label: 'Chia sẻ với bạn bè', action: () => {} },
    { icon: Flag, label: 'Chia sẻ lên trang', action: () => {} },
    { icon: Users, label: 'Chia sẻ lên nhóm', action: () => {} },
    { icon: MessageSquare, label: 'Gửi qua tin nhắn', action: () => {} },
    { icon: ArrowRightSquare, label: 'Sang ứng dụng khác', action: "shareOther" },
  ],
  [
    { icon: Link, label: 'Sao chép liên kết', action: () => {} },
    { icon: Code, label: 'Sao chép mã nhúng', action: () => {} },
    { icon: Download, label: 'Tải về', action: () => {} },
  ],
  [
    { icon: Bell, label: 'Báo cáo', action: () => {} },
  ]
];

export default function ShareMenuContent({ post }: Props) {
  const [openShareModal, setOpenShareModal] = useState(false);
  const [openShareOtherModal, setOpenShareOtherModal] = useState(false);

  const handleItemClick = (item: any) => {
    if (item.action === "sharePost") {
      setOpenShareModal(true);
    }else if(item.action === "shareOther"){
      setOpenShareOtherModal(true);
    } else if (typeof item.action === "function") {
      item.action();
    }
  };

  return (
    <div className="p-2">
      {menuSections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          {section.map((item) => (
            <button
              key={item.label}
              onClick={() => handleItemClick(item)}
              className="flex w-full items-center gap-4 rounded-md px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-100"
            >
              <item.icon className="h-5 w-5 text-gray-600" />
              <span>{item.label}</span>
            </button>
          ))}
          {sectionIndex < menuSections.length - 1 && (
            <hr className="my-2 border-gray-200" />
          )}
        </div>
      ))}

      {/* Modal share bài viết */}
      <SharePostModal
        open={openShareModal}
        onClose={() => setOpenShareModal(false)}
        post={post}
      />
      {openShareOtherModal && (

      <ShareExternalModal 
        onClose={() => setOpenShareOtherModal(false)}
        postUrl={`https://myapp.com/posts/${post._id}`} 
      />
      )}
    </div>
  );
}
