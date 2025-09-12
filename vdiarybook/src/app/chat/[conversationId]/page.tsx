"use client";

import { useMessageContext } from "../context";
import SerachForMessage from "@/components/SeachForMessage/SeachForMessage";
import MessageList from "@/components/MessageList/MessageList";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useConversations } from "@/hook/useMessage";

export default function MessagePersonal() {

  const user = useSelector((state: RootState) => state.auth.user);
  const currentUserId = user?._id;

  const {data: conversations} = useConversations();

  const { showPopoverSearchMessage, onClosePopover } = useMessageContext();

  return (
    <div className="flex flex-col ml-auto w-3/4 bg-white h-[calc(100vh-64px)] overflow-hidden">
      
        <MessageList currentUserId={currentUserId} conversations={conversations || []}/>


      {showPopoverSearchMessage && (
        <SerachForMessage onClosePopover={onClosePopover} />
      )}
    </div>
  );
}