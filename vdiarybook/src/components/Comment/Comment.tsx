import { IComment } from "@/types/comment.type";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getSocket } from "@/utils/socket";
import commentApi from "@/services/comment.service";
import { BsThreeDots } from "react-icons/bs";
import { toast } from "react-toastify";

type Props = {
  className?: string;
  comment: IComment;
  onReply?: (comment: IComment) => void;
  onDelete?: (commentId: string) => void;
  onEdit?: (comment: IComment) => void;
};

export default function Comment({
  className,
  comment,
  onReply,
  onDelete,
  onEdit,
}: Props) {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<IComment[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchReplies = async () => {
      if (showReplies && comment._id) {
        try {
          const res = await commentApi.getChildComments(comment._id.toString());
          setReplies(res.data);
        } catch (err) {
          console.error("Lỗi khi fetch replies:", err);
        }
      }
    };

    fetchReplies();
  }, [showReplies, comment._id]);
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const handleNewChildComment = (data: {
      parentCommentId: string;
      newComment: IComment;
    }) => {
      if (data.parentCommentId === comment._id) {
        setReplies((prev) => [...prev, data.newComment]);
      }
    };

    socket.on("new-child-comment", handleNewChildComment);
    return () => {
      socket.off("new-child-comment", handleNewChildComment);
    };
  }, [comment._id]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleUpdateComment = (updated: IComment) => {
      if (updated._id === comment._id) {
        comment.text = updated.text;
        setReplies((prev) =>
          prev.map((r) => (r._id === updated._id ? updated : r))
        );
      }
    };

    socket.on("updated-comment", handleUpdateComment);

    return () => {
      socket.off("updated-comment", handleUpdateComment);
    };
  }, [comment._id]);

  const handleDeleteComment = async () => {
    try {
      const res = await commentApi.deleteComments(comment._id);
      toast.success(res.message || "Delete comment sucessfully");
      if (onDelete) {
        onDelete(comment._id);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Delete comment failed");
    }
  };
  return (
    <div className={`${className} flex flex-col gap-2 group`}>
      {/* Parent comment */}
      <div className=" flex items-start">
        <Image
          src={comment.author.avatar || "/assets/img/user.png"}
          alt="avt"
          width={32}
          height={32}
          className="object-cover w-10 h-10 mr-4 rounded-full"
        />
        <div className="bg-gray-100 rounded-2xl p-2 text-sm flex-1">
          <p className="font-semibold mr-2">{comment.author.name}</p>
          <p className="break-words">{comment.text}</p>
          <p className="text-xs text-slate-400 my-1">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
              locale: vi,
            })}
          </p>

          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1">
            <button
              onClick={() => {
                if (comment.parentId) {
                  onReply?.({ ...comment, _id: comment.parentId });
                } else {
                  onReply?.(comment);
                }
              }}
              className="hover:underline"
            >
              Trả lời
            </button>

            <button
              onClick={() => setShowReplies(!showReplies)}
              className="hover:underline"
            >
              {showReplies ? "Hide replies" : "View replies"}
            </button>
          </div>
        </div>

        <div
          className="relative ml-2 mt-10 opacity-0 group-hover:opacity-100 transition-opacity"
          ref={menuRef}
        >
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 hover:bg-gray-200 rounded-full"
          >
            <BsThreeDots size={16} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-40 bg-white border rounded-xl shadow-lg z-10">
              <button
                onClick={handleDeleteComment}
                className="w-full px-3 py-2 text-left hover:bg-gray-100"
              >
                Xóa bình luận
              </button>
              <button className="w-full px-3 py-2 text-left hover:bg-gray-100">
                Ẩn bình luận
              </button>
              {user?._id === comment.author._id && (
                <>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit?.(comment);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100"
                  >
                    Chỉnh sửa bình luận
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Child comments */}
      {replies.length > 0 && (
        <div className="ml-6 flex flex-col gap-2 relative">
          <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-300" />

          {replies.map((reply) => (
            <div key={reply._id} className="flex items-start gap-2 relative">
              <div className="w-6 flex justify-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2" />
              </div>
              <div className="flex-1">
                <Comment comment={reply} className="w-full" onReply={onReply} onEdit={onEdit} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
