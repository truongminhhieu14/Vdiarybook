"use client";

import { useEffect, useRef, useContext } from "react";
import { useMessages } from "@/hook/useMessage";
import { Conversation, GetMessagesResponse, Message } from "@/types/chat.type";
import { groupMessagesByTime } from "@/utils/time";
import { AppContext } from "@/context/app.context";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { getSocket } from "@/utils/socket";

import MessageSentFromMe from "../MessageSent/FromMe/MessageSentFromMe";
import MessageSentFromFriend from "../MessageSent/FromFriend/MessageSentFromFriend";
import MessageInput from "../MessageInput/MessageInput";
import PhoneIcon from "@/Icon/phoneIcon";
import VideoCallIcon from "@/Icon/videoCallIcon";
import ThreeDotIcon from "@/Icon/threeDotIcon";
import CloseIcon from "@/Icon/closeIcon";

type Props = {
  currentUserId?: string;
  conversation: Conversation; // truyền vào khi click user
  onClose: () => void;        // để đóng modal
};

export default function ChatModal({ currentUserId, conversation, onClose }: Props) {
  const conversationId = conversation._id;
  const { data, fetchNextPage } = useMessages(conversationId || "");
  const { socket } = useContext(AppContext);
  const queryClient = useQueryClient();
  const bottomRef = useRef<any>(null);

  const messages: Message[] = data?.pages.flatMap((p) => p.messages) ?? [];
  const messagesToRender = data
    ? groupMessagesByTime([...messages].reverse()).reverse()
    : [];
  const hasMore = data?.pages[data.pages.length - 1]?.hasNextPage ?? false;

  // Auto scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Lắng nghe socket
  useEffect(() => {
    if (!socket) return;

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

    socket.on("new-message", handleIncomingMessage);
    socket.on("resend-message", handleIncomingMessage);

    return () => {
      socket.off("new-message", handleIncomingMessage);
      socket.off("resend-message", handleIncomingMessage);
    };
  }, [socket, conversationId, queryClient]);

  // Gửi tin nhắn
  const handleSendMessage = (content: string) => {
    if (!conversationId) return;
    const receiverId = conversation.other_participants?.[0]?._id;
    if (!receiverId) return;

    const msg = {
      conversation: conversationId,
      senderId: currentUserId,
      receiverId,
      content,
    };
    const socket = getSocket();
    if (!socket) return;
    socket.emit("send-message", msg);
  };

  return (
    <div className="fixed bottom-0 right-16 w-[340px] h-[460px] bg-white rounded-t-lg shadow-lg flex flex-col border z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center space-x-2">
          <img
            src={conversation.other_participants?.[0]?.avatar || "/assets/img/user.png"}
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
          <span className="font-semibold">
            {conversation.other_participants?.[0]?.name}
          </span>
        </div>
        <div className="flex items-center cursor-pointer">
            <PhoneIcon className="w-6 h-6 mr-2" />      
            <VideoCallIcon className="w-6 h-6 mr-2" />
            <ThreeDotIcon className="w-6 h-6 mr-2" />
            <CloseIcon onClick={onClose} className="w-6 h-6"/>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 py-2">
        <div
          id="scrollableDiv"
          className="h-full flex flex-col-reverse overflow-auto px-3"
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
            {messagesToRender.map((item, index) => {
              if (item.type === "timestamp") {
                return (
                  <div
                    key={`timestamp-${index}`}
                    className="flex justify-center my-2"
                  >
                    <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                      {item.time}
                    </span>
                  </div>
                );
              } else {
                const message = item.message as Message;
                const isCurrentUser = message.senderId === currentUserId;

                return isCurrentUser ? (
                  <MessageSentFromMe
                    key={message._id}
                    content={message.content}
                  />
                ) : (
                  <MessageSentFromFriend
                    key={message._id}
                    content={message.content}
                    avatar={conversation.other_participants?.[0]?.avatar}
                  />
                );
              }
            })}
          </InfiniteScroll>
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t">
        <MessageInput onSend={handleSendMessage} />
      </div>
    </div>
  );
}
