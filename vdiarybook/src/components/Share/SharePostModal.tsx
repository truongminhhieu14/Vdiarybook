"use client";

import { useClickOutside } from "@/hook/useClickOutside";
import shareApi from "@/services/share.service";
import { IPost } from "@/types/post.type";
import { SharePayLoad } from "@/types/share.type";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

interface SharePostModalProps {
  open: boolean;
  onClose: () => void;
  post: IPost; // bài viết gốc
}

export default function SharePostModal({ open, onClose, post }: SharePostModalProps) {
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null!);
  useClickOutside(modalRef, onClose);

  if (!open) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload: SharePayLoad = {
        postId: post._id,
        type: "internal",
        caption,
      };
      await shareApi.internalShare(payload);

      toast.success("Chia sẻ bài viết thành công!");
      setCaption("");
      onClose();
    } catch (error) {
      console.error("Chia sẻ thất bại:", error);
      toast.error("Chia sẻ thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        ref={modalRef}
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] p-4 relative overflow-hidden flex flex-col"
      >
        <button className="absolute top-3 right-3" onClick={onClose}>
          ×
        </button>

        <h2 className="text-xl font-semibold text-center mb-3">Chia sẻ bài viết</h2>

        <div className="overflow-y-auto pr-2 flex-grow">
          {/* Caption nhập mới */}
          <textarea
            className="w-full border rounded p-2 text-sm mb-4"
            placeholder="Bạn muốn viết gì khi chia sẻ bài viết này?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          {/* Preview bài viết gốc */}
          <div className="border rounded-lg p-3 bg-gray-50 mb-4">
            {/* Caption gốc */}
            <p className="text-sm text-gray-800 mb-2">{post.caption}</p>

            {/* Links */}
            {post.links?.length > 0 && (
              <ul className="mb-4 space-y-2">
                {post.links.map((link, index) => (
                  <li
                    key={index}
                    className="relative flex border rounded overflow-hidden shadow bg-white"
                  >
                    {link.image ? (
                      <img
                        src={link.image}
                        alt="preview"
                        className="w-32 h-32 object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                        No image
                      </div>
                    )}
                    <div className="p-3 flex-1 overflow-hidden">
                      <p className="font-semibold text-sm line-clamp-2">
                        {link.title || "No title"}
                      </p>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {link.description || "No description"}
                      </p>
                      <a
                        href={link.url}
                        className="text-xs text-blue-600 mt-1 block truncate"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.url}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Ảnh */}
            {post.images?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {post.images.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt="shared"
                    className="h-24 rounded shadow"
                  />
                ))}
              </div>
            )}

            {/* Video */}
            {post.videos?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.videos.map((src, idx) => (
                  <video
                    key={idx}
                    src={src}
                    controls
                    className="h-32 rounded shadow"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Đang chia sẻ..." : "Chia sẻ"}
        </button>
      </div>
    </div>
  );
}
