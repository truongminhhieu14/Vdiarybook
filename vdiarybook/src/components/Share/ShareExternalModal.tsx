"use client";

import { FaFacebook, FaXTwitter, FaLinkedin, FaPinterest } from "react-icons/fa6";
import { X } from "lucide-react";
import Modal from "../Modal/modal";

type ShareModalProps = {
  onClose: () => void;
  postUrl: string;
};

export default function ShareExternalModal({ onClose, postUrl }: ShareModalProps) {
  const shareLinks = [
    {
      name: "Facebook",
      icon: <FaFacebook size={28} className="text-blue-600" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
    },
    {
      name: "Twitter",
      icon: <FaXTwitter size={28} />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`,
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin size={28} className="text-sky-700" />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`,
    },
    {
      name: "Pinterest",
      icon: <FaPinterest size={28} className="text-red-600" />,
      url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(postUrl)}`,
    },
    {
      name: "Dòng lịch sử",
      icon: (
        <img src="https://file.apetavers.com/api/files/admin/20240922/79b95afd-84a2-4439-9c26-fdfb82c1c225--150.png" alt="history" className="w-7 h-7" />
      ),
      url: "#",
    },
    {
      name: "Vdiarybook",
      icon: (
        <img src="https://file.apetavers.com/api/files/admin/20240922/0c0e4d99-8134-47b8-b580-2587e784b01c--150.png" alt="vdiarybook" className="w-7 h-7" />
      ),
      url:  `https://vdiarybook.com/share?url=${encodeURIComponent(postUrl)}`,
    },
  ];

  return (
    <Modal>
      <div className="bg-white rounded-xl shadow-lg w-[420px] p-5 relative">
        {/* Header */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={22} />
        </button>
        <h2 className="text-lg font-semibold text-center mb-6">
          Sang ứng dụng khác
        </h2>

        {/* Grid share icons */}
        <div className="grid grid-cols-3 gap-6">
          {shareLinks.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center hover:opacity-80"
            >
              {item.icon}
              <span className="text-sm mt-2 text-gray-700">{item.name}</span>
            </a>
          ))}
        </div>
      </div>
    </Modal>
  );
}
