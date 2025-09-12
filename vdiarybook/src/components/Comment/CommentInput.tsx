import { useEffect, useState, useRef } from "react";
import { IoMdSend } from "react-icons/io";
import { FaTimes } from "react-icons/fa";
import { getSocket, connectSocket } from "@/utils/socket";
import { IComment } from "@/types/comment.type";

interface CommentInputProps {
  postId: string;
  currentUserId: string;
  userAvatar?: string;
  replyTo?: IComment | null;
  editComment?: IComment | null;

  onSendComment: (
    text: string,
    replyTo?: IComment | null,
    editComment?: IComment | null
  ) => void;
  onCancelReplyOrEdit?: () => void;
}

export default function CommentInput({
  postId,
  currentUserId,
  userAvatar,
  replyTo,
  editComment,
  onSendComment,
  onCancelReplyOrEdit,
}: CommentInputProps) {
  const [comment, setComment] = useState("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const socket = connectSocket(currentUserId);
    socket.emit("join-comment-room", postId);

    socket.on("user-typing-comment", ({ userId }: { userId: string }) => {
      setTypingUsers((prev) =>
        prev.includes(userId) ? prev : [...prev, userId]
      );
    });

    socket.on("user-stop-typing-comment", ({ userId }: { userId: string }) => {
      setTypingUsers((prev) => prev.filter((id) => id !== userId));
    });

    return () => {
      socket.off("user-typing-comment");
      socket.off("user-stop-typing-comment");
    };
  }, [postId, currentUserId]);

  useEffect(() => {
    if ((replyTo || editComment) && inputRef.current) {
      inputRef.current.focus();
    }
    if (editComment) {
      setComment(editComment.text);
    } else if (replyTo) {
      setComment("");
    }
  }, [replyTo, editComment]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
    const socket = getSocket();
    if (!socket) return;

    socket.emit("start-typing-comment", { postId });

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit("stop-typing-comment", { postId });
    }, 1000);
  };

  const handleSubmit = () => {
    if (!comment.trim()) return;
    onSendComment(comment, replyTo, editComment);
    setComment("");
    const socket = getSocket();
    if (socket) socket.emit("stop-typing-comment", { postId });
  };

  const handleCancel = () => {
    setComment("");
    onCancelReplyOrEdit?.();
  };

  return (
    <div className="border-t px-4 py-3 flex flex-col w-full bg-white">
      {/* Typing indicator */}
      {typingUsers.length > 0 && (
        <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
          <span>{typingUsers.length} người đang nhập</span>
          <div className="flex items-end gap-1">
            <span className="animate-bounceTyping text-gray-600">.</span>
            <span className="animate-bounce text-gray-600 delay-200">.</span>
            <span className="animate-bounce text-gray-600 delay-400">.</span>
          </div>
        </div>
      )}
      {(replyTo || editComment) && (
        <div className="flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2 mb-2">
          <div>
            {replyTo && (
              <>
                <p className="text-sm font-semibold text-blue-600">
                  {replyTo.author.name}
                </p>
                <p className="text-xs text-gray-600 truncate max-w-[200px]">
                  {replyTo.text}
                </p>
              </>
            )}
            {editComment && (
              <>
                <p className="text-sm font-semibold text-blue-600">
                  {editComment.author.name}
                </p>
                <p className="text-xs text-gray-600 truncate max-w-[200px]">
                  {editComment.text}
                </p>
              </>
            )}
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-red-500 ml-2"
          >
            <FaTimes size={14} />
          </button>
        </div>
      )}

      {/* Input + Send */}
      <div className="flex items-center gap-2">
        {userAvatar && (
          <img
            src={userAvatar}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={comment}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={
              editComment
                ? "Chỉnh sửa bình luận..."
                : replyTo
                ? `Trả lời ${replyTo.author.name}...`
                : "Chia sẻ cảm nhận của bạn"
            }
            className="w-full border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <IoMdSend
            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 cursor-pointer"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
