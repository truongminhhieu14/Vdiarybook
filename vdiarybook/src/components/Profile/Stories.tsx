"use client";

import Image from "next/image";
import { useState } from "react";

type Story = {
  id: number;
  name: string;
  avatar: string;
  storyImage: string;
  isCreate?: boolean;
};

const mockStories: Story[] = [
  {
    id: 1,
    name: "Tạo tin",
    avatar: "/assets/img/user.png",
    storyImage: "/assets/img/user.png",
    isCreate: true,
  },
  {
    id: 2,
    name: "Anh Thư Phan",
    avatar: "/assets/img/user.png",
    storyImage: "/assets/img/trainers/hieu.jpg",
  },
  {
    id: 3,
    name: "Tramy Luu",
    avatar: "/assets/img/user.png",
    storyImage: "/assets/img/trainers/tramanh.jpg",
  },
  {
    id: 4,
    name: "Thảo Phương Trần",
    avatar: "/assets/img/user.png",
    storyImage: "/assets/img/trainers/minhmanh.jpg",
  },
  {
    id: 5,
    name: "Vạn Tường",
    avatar: "/assets/img/user.png",
    storyImage: "/assets/img/trainers/phuonganh.jpg",
  },
];

export default function Stories() {
  const [stories] = useState<Story[]>(mockStories);

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl">
    <div className="flex space-x-3 overflow-x-auto scrollbar-hide py-4">
      {stories.map((story) => (
        <div
          key={story.id}
          className="relative w-28 h-48 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer group"
        >
          <Image
            src={story.storyImage}
            alt={story.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
          {story.isCreate ? (
            <div className="absolute bottom-0 left-0 right-0 bg-white py-2 flex flex-col items-center">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mb-1">
                +
              </div>
              <span className="text-xs font-semibold">{story.name}</span>
            </div>
          ) : (
            <>
              <div className="absolute top-2 left-2 w-10 h-10 rounded-full border-2 border-blue-500 overflow-hidden">
                <Image src={story.avatar} alt="avatar" fill className="object-cover" />
              </div>
              <div className="absolute bottom-2 left-2 right-2 text-white text-sm font-medium truncate drop-shadow">
                {story.name}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
    </div>
  );
}
