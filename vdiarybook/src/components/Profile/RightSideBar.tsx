"use client";

import { useConversations } from "@/hook/useMessage";
import { Conversation, Message } from "@/types/chat.type";
import UserMessage from "../UserMessage/UserMessage";
import { useContext, useEffect, useState } from "react";
import ChatModal from "../ChatModal/ChatModal";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { AppContext } from "@/context/app.context";

type Props = {
  className?: string;
};

export default function RightSideBar({ className }: Props) {
  const [openChat, setOpenChat] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const { data: conversations, isLoading } = useConversations();
  const user = useSelector((state: RootState) => state.auth.user);
  const currentUserId = user?._id;
  const { socket } = useContext(AppContext);

  const handleOpenChat = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setOpenChat(true);
  }

  useEffect(() => {
    if(!socket) return;

    const handleIncomingMessage = (msg: Message) => {
      const conversation = conversations?.find(c => c._id === msg.conversation);
      if(conversation) {
        setSelectedConversation(conversation);
        setOpenChat(true);
      }
    }
    socket.on("new-message", handleIncomingMessage);
    return () => {
      socket.off("new-message", handleIncomingMessage)
    }
  }, [socket, conversations])

  return (
    <>
    <aside
      className={`w-72 bg-white rounded-xl shadow p-2 pt-16 ml-4 h-screen border border-gray-200 flex flex-col ${className}`}
    >
      <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide">
        <div className="mb-2">
          <img
            src="https://file.apetavers.com/api/files/admin/20250630/8b8e773b-aee1-4321-86b5-1a09036c0fb9--1920.webp"
            className="w-full rounded"
            alt="banner"
          />
        </div>
        <div className="mb-2">
          <img
            src="https://file.apetavers.com/api/files/admin/20250618/674d883a-df87-45f2-b6bf-0f4718cf894e--1920.webp"
            className="w-full rounded"
            alt="banner"
          />
        </div>
        <div className="mb-2">
          <img
            src="https://file.apetavers.com/api/files/admin/20241226/9741bec3-34f6-468a-b7d5-713fcc036c2d--1920.webp"
            className="w-full rounded"
            alt="banner"
          />
        </div>
        <div className="mb-2">
          <img
            src="https://file.apetavers.com/api/files/admin/20241226/9741bec3-34f6-468a-b7d5-713fcc036c2d--1920.webp"
            className="w-full rounded"
            alt="banner"
          />
        </div>
        <div className="mb-2">
          <img
            src="https://file.apetavers.com/api/files/admin/20241226/9741bec3-34f6-468a-b7d5-713fcc036c2d--1920.webp"
            className="w-full rounded"
            alt="banner"
          />
        </div>
      </div>

      <div className="border-t border-gray-300 my-2"/>

      <div className="flex-1 overflow-y-auto px-2 pr-1 scrollbar-hide">
        <p className="font-bold text-gray-700 mb-4">Conversations</p>

        {isLoading && <p className="text-gray-500 text-sm">Đang tải...</p>}

        {conversations?.length === 0 && !isLoading && (
          <p className="text-gray-500 text-sm">Không có cuộc trò chuyện nào</p>
        )}

        {conversations?.map((conversation: Conversation) => (
          <div
            key={conversation._id}
            //href={`/chat/${conversation._id}`}
            className="mb-2 block"
            onClick={() => handleOpenChat(conversation)}
            
          >
            <UserMessage
              className="rounded-md hover:bg-slate-100 outline-none p-2 flex justify-between items-center"
              userName={conversation.other_participants?.[0]?.name || "Unknown"}
              avatar={
                conversation.other_participants?.[0]?.avatar ||
                "/assets/img/user.png"
              }
              lastMessage={conversation.last_message?.content}
            />
          </div>
        ))}
      </div>
    </aside>
    {openChat && selectedConversation && (
        <ChatModal
          currentUserId={currentUserId}
          conversation={selectedConversation}
          onClose={() => setOpenChat(false)}
        />
      )}
    </>
  );
}
