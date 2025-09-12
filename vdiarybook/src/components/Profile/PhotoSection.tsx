import React from "react";
import Link from "next/link";

// Mock data ảnh
const mockPhotos = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=256&h=256",
  "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=256&h=256",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=256&h=256",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=256&h=256",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=256&h=256",
];

const PhotoSection: React.FC = () => (
  <div className="bg-white rounded-lg shadow p-2 mb-4">
    <div className="flex justify-between items-center mb-2">
      <span className="font-bold">Hình ảnh</span>
      <Link href="/profile/photos" className="text-blue-500 text-sm">Xem tất cả</Link>
    </div>
    {mockPhotos.length === 0 ? (
      <div className="text-gray-400 text-sm">Chưa có hình ảnh</div>
    ) : (
      <div className="grid grid-cols-3 gap-2">
        {mockPhotos.slice(0, 3).map((photo, idx) => (
          <img
            key={idx}
            src={photo}
            alt={`photo-${idx}`}
            className="w-16 h-16 rounded object-cover"
          />
        ))}
      </div>
    )}
  </div>
);

export default PhotoSection;