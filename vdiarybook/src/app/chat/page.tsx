"use client";

import MessageIcon from "@/Icon/messageIcon";
import { useMessageContext } from "./context";
import SerachForMessage from "@/components/SeachForMessage/SeachForMessage";

export default function MessagePage() {
  const {showPopoverSearchMessage, onClosePopover} = useMessageContext()
  return (
    <div className="w-3/4 ml-auto h-full flex flex-col items-center justify-center">
      <MessageIcon className="w-24 h-24 mb-4" />
      <div className="text-xl text-center">
        <p>Your messages</p>
        <p className="mt-2 font-normal text-slate-500 text-sm">
          Send private photos and messages to a friend or group
        </p>
        <button
          onClick={onClosePopover}
          className="text-white px-3 py-2 rounded-md bg-blue-500 text-sm mt-4 hover:bg-opacity-85 font-semibold"
        >
          Send Message
        </button>
      </div>
      {showPopoverSearchMessage && (
        <SerachForMessage onClosePopover={onClosePopover} />
      )}
    </div>
  );
}