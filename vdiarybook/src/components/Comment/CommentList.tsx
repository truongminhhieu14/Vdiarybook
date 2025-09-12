import React, { useContext, useEffect, useState } from "react";
import Comment from "./Comment";
import { IComment } from "@/types/comment.type";
import commentApi from "@/services/comment.service";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { AppContext } from "@/context/app.context";
import { getSocket } from "@/utils/socket";

type Props = {
  postId: string;
  onReplyClick?: (comment: IComment) => void;
  onEditClick?: (comment: IComment) => void;
};

type GroupedComments = {
  [date: string]: IComment[];
};

export default function CommentList({
  postId,
  onReplyClick,
  onEditClick,
}: Props) {
  const [comments, setComments] = useState<IComment[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { socket: contextSocket } = useContext(AppContext);
  const limit = 10;

  const fetchComments = async () => {
    try {
      const res = await commentApi.getAllComments(postId, page, limit);
      const newComments = res.data;

      setComments((prev) => {
        const existingIds = new Set(prev.map((c) => c._id));
        const filtered = newComments.filter((c) => !existingIds.has(c._id));
        return [...prev, ...filtered];
      });
      setHasMore(newComments.length === limit);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [page, postId]);

  useEffect(() => {
    const socket = contextSocket || getSocket();
    if (!socket) return;

    const handleNewComment = (newComment: IComment) => {
      if (newComment.postId === postId) {
        setComments((prev) => {
          const exists = prev.some((c) => c._id === newComment._id);
          if (exists) return prev;
          return [newComment, ...prev];
        });
      }
    };
    socket.on(`new-comment-${postId}`, handleNewComment);
    return () => {
      socket.off(`new-comment-${postId}`, handleNewComment);
    };
  }, [postId, contextSocket]);
  const groupByDate = (comments: IComment[]): GroupedComments => {
    return comments.reduce((groups: GroupedComments, comment) => {
      const date = format(new Date(comment.createdAt), "dd/MM/yyyy", {
        locale: vi,
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(comment);
      return groups;
    }, {});
  };

  const grouped = groupByDate(comments);

  return (
    <div className="space-y-6">
      {Object.keys(grouped).map((date) => (
        <div key={date}>
          <p className="text-sm font-bold text-gray-500 mb-2">{date}</p>
          <div className="space-y-4 w-full">
            {grouped[date].map((comment) => (
              <Comment
                key={comment._id}
                className="flex items-start space-x-2"
                comment={comment}
                onReply={onReplyClick}
                onEdit={(c) => onEditClick?.(c)}
                onDelete={(id) =>
                  setComments((prev) => prev.filter((item) => item._id !== id))
                }
              />
            ))}
          </div>
        </div>
      ))}

      {hasMore && (
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="mt-4 text-blue-500 text-sm"
        >
          Xem thêm bình luận
        </button>
      )}
    </div>
  );
}
