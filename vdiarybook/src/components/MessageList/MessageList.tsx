"use client";

import { useMessages } from "@/hook/useMessage";
import { Conversation, GetMessagesResponse, Message } from "@/types/chat.type";
import MessageSentFromMe from "../MessageSent/FromMe/MessageSentFromMe";
import MessageSentFromFriend from "../MessageSent/FromFriend/MessageSentFromFriend";
import { groupMessagesByTime } from "@/utils/time";
import { useContext, useEffect, useRef } from "react";
import { AppContext } from "@/context/app.context";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { getSocket } from "@/utils/socket";
import MessageInput from "../MessageInput/MessageInput";
import Image from "next/image";
import PhoneIcon from "@/Icon/phoneIcon";
import VideoCallIcon from "@/Icon/videoCallIcon";
import ThreeDotIcon from "@/Icon/threeDotIcon";
import { useParams } from "next/navigation";

type Props = {
  currentUserId?: string;
  conversations: Conversation[];
};

export default function MessageList({ currentUserId, conversations }: Props) {
  const params = useParams();
  const conversationId = params?.conversationId as string;
  const conversation = conversations?.find((c) => c._id === conversationId);
  const { data, fetchNextPage } = useMessages(conversationId || "");
  const { socket } = useContext(AppContext);
  const bottomRef = useRef<any>(null);
  const queryClient = useQueryClient();
  const messages: Message[] =
    data?.pages.flatMap((page) => page.messages) ?? [];
  const messagesToRender = data
    ? groupMessagesByTime([...messages].reverse()).reverse()
    : [];
  console.log("messagesToRender:", messagesToRender);
  const hasMore = data?.pages[data.pages.length - 1]?.hasNextPage ?? false;
  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket) {
      console.log("Không có socket");
      return;
    }

    const handleIncomingMessage = (msg: Message) => {
      if (msg.conversation === conversationId) {
        queryClient.setQueryData(
          ["messages", conversationId],
          (old: InfiniteData<GetMessagesResponse> | undefined) => {
            if (!old) return old;
            return {
              ...old,
              pages: [
                {
                  ...old.pages[0],
                  messages: [msg, ...old.pages[0].messages],
                },
                ...old.pages.slice(1),
              ],
              pageParams: old.pageParams,
            };
          }
        );
      }
    };
    socket.on("resend-message", handleIncomingMessage);
    socket.on("new-message", handleIncomingMessage);

    return () => {
      socket.off("resend-message", handleIncomingMessage);
      socket.off("new-message", handleIncomingMessage);
    };
  }, [socket, conversationId, queryClient]);

  const handleSendMessage = (content: string) => {
    if (!conversationId) return;
    const conversation = conversations?.find((c) => c._id === conversationId);

    const receiverId = conversation?.other_participants?.[0]._id;
    console.log("other_participants:", conversation?.other_participants);
    console.log("receiverId:", receiverId);
    console.log(conversation);

    if (receiverId) {
      const msg = {
        conversation: conversationId,
        senderId: currentUserId,
        receiverId,
        content,
      };
      const socket = getSocket();
      if (!socket) return;
      socket.emit("send-message", msg); // gửi trực tiếp tới server
    }
  };

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <div className="flex items-center justify-between p-4 border-b border-slate-300 bg-white sticky top-0 z-10 h-1/10">
        {conversation?.other_participants?.map((user) => (
          <div key={user._id} className="flex items-center space-x-2">
            <Image
              src={user.avatar || "/assets/img/user.png"}
              alt={user.name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-semibold">{user.name}</span>
          </div>
        ))}
        <div className="flex items-center cursor-pointer">
          <PhoneIcon className="w-6 h-6 mr-4" />
          <VideoCallIcon className="w-6 h-6 mr-4" />
          <ThreeDotIcon className="w-6 h-6" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-50 py-2">
        <div
          id="scrollableDiv"
          className="h-full flex flex-col-reverse overflow-auto px-4 py-2 bg-gray-50"
        >
          <InfiniteScroll
            dataLength={messages.length}
            next={fetchNextPage}
            style={{ display: "flex", flexDirection: "column-reverse" }}
            inverse={true}
            hasMore={hasMore}
            loader={<h4></h4>}
            scrollableTarget="scrollableDiv"
          >
            {messagesToRender &&
              messagesToRender.map((item, index) => {
                if (item.type === "timestamp") {
                  return (
                    <div
                      key={`timestamp-${index}`}
                      className="flex justify-center my-1"
                    >
                      <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                        {item.time}
                      </span>
                    </div>
                  );
                } else {
                  const message = item.message as Message;
                  const isCurrentUser = message.senderId === currentUserId;

                  if (isCurrentUser) {
                    return (
                      <MessageSentFromMe
                        key={message._id + "-" + index}
                        content={message.content}
                      />
                    );
                  } else {
                    const sender = conversation?.other_participants?.find(
                      (u) => u._id === message.senderId
                    );

                    return (
                      <MessageSentFromFriend
                        key={message._id + "-" + index}
                        content={message.content}
                        avatar={sender?.avatar}
                      />
                    );
                  }
                }
              })}
            {conversation?.other_participants?.map((user) => (
              <div key={user._id} className="flex flex-col items-center my-9">
                <img
                  src={user.avatar || "/assets/img/user.png"}
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover"
                />
                <h1 className="text-xl font-semibold mt-4">{user.name}</h1>
                <p className="text-gray-500">{user.name} · Instagram</p>
                <button className="mt-3 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition">
                  Xem trang cá nhân
                </button>
              </div>
            ))}
          </InfiniteScroll>
        </div>
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 bg-white border-t border-slate-300 z-10">
        <MessageInput onSend={handleSendMessage} />
      </div>
    </div>
  );
}
