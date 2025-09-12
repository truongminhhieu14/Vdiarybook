import { useClickOutside } from "@/hook/useClickOutside";
import React, { useRef } from "react";

interface DeletePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
export default function DeletePostModal({
  isOpen,
  onClose,
  onConfirm,
}: DeletePostModalProps) {
  const modalRef = useRef<HTMLDivElement>(null!);
  useClickOutside(modalRef, onClose);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div ref={modalRef} className="bg-white rounded-2xl shadow-lg p-6 w-[380px] animate-fadeIn">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Bạn có chắc muốn xóa bài đăng này?
        </h2>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
