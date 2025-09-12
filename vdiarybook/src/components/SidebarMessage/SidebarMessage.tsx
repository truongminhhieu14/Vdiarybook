"use client"
import Link from "next/link";
import UserMessage from "../UserMessage/UserMessage";
import LogoIcon from "@/Icon/logoIcon";
import NoteIcon from "@/Icon/noteIcon";
import { useConversations } from "@/hook/useMessage";
import { Conversation } from "@/types/chat.type";

type Props = {
  className?: string;
};

export default function SideBarMessage({ className }: Props) {
  const { data: conversations, isLoading} = useConversations();
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4 px-6">
        <Link href="/" className="flex cursor-pointer items-center">
          <LogoIcon className="w-8 h-8 mr-2" />
          <div className="text-xl font-bold">hieutm</div>
        </Link>
        <button>
          <NoteIcon className="w-8 h-8" />
        </button>
      </div>
      <p className="text-xl font-bold mb-4 px-6">Messages</p>
      <div className="overflow-x-hidden h-full w-full px-6">
        {isLoading && <p>Đang tải...</p>}
        {conversations?.map((conversations: Conversation) => (
          <Link
            key={conversations._id}
            href={`/chat/${conversations._id}`}
            className="mb-4 block"
          >
            <UserMessage
              className="rounded-md hover:bg-slate-50 outline-none p-2 flex justify-between items-center"
              userName={conversations.other_participants?.[0]?.name || "Unknown"}
              avatar={conversations.other_participants?.[0]?.avatar || "/assets/img/user.png"}
              lastMessage={conversations.last_message?.content}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}