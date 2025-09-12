import Image from "next/image";
import {
  FaHeart,
  FaStar,
  FaShareAlt,
  FaCommentDots,
  FaTimes,
} from "react-icons/fa";
import { BsEye } from "react-icons/bs";
import { AiOutlineLike } from "react-icons/ai";
import { IPost } from "@/types/post.type";
import Modal from "../Modal/modal";
import { useEffect, useRef, useState } from "react";
import postApi from "@/services/post.service";
import useDisableBodyScroll from "@/hook/useDisableBodyScroll";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import CommentList from "../Comment/CommentList";
import { getSocket } from "@/utils/socket";
import useCommentCount from "@/hook/useCommentCount";
import { useClickOutside } from "@/hook/useClickOutside";
import { IComment } from "@/types/comment.type";
import CommentInput from "../Comment/CommentInput";
import YoutubeIframe from "@/hook/useYoutubeIframe";

interface DetailPostProps {
  isOpen: boolean;
  postId: string;
  onClose: () => void;
}

export default function DetailPost({
  isOpen,
  postId,
  onClose,
}: DetailPostProps) {
  const [post, setPost] = useState<IPost | null>(null);
  const [commentCount, setCommentCount] = useState(0);
  const [replyTo, setReplyTo] = useState<IComment | null>(null);
  const [editComment, setEditComment] = useState<IComment | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { count: commentCountHook, loading: loadingCommentCount } =
    useCommentCount(postId);
  const user = useSelector((state: RootState) => state.auth.user);
  const modalRef = useRef<HTMLDivElement>(null!);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCommentCount(commentCountHook);
  }, [commentCountHook]);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await postApi.getPostByPostId(postId);
      setPost(res.data.data);
    };
    fetchPost();
  }, [postId]);

  const handleSendComment = async (
    text: string,
    reply?: IComment | null,
    edit?: IComment | null
  ) => {
    const socket = getSocket();
    if (!socket || !text.trim() || !user) return;

    if (edit) {
      socket.emit("update-comment", {
        commentId: edit._id,
        text,
      });
      setEditComment(null);
    } else {
      socket.emit("send-comment", {
        text,
        postId,
        author: user._id,
        parentId: reply ? reply._id : null,
        mentions: reply ? [reply.author._id] : [],
      });
      setCommentCount((prev) => prev + 1);
    }
    setReplyTo(null);
    setEditComment(null);
  };
  const handleReplyClick = (comment: IComment) => {
    setReplyTo(comment);
    setEditComment(null);
  };
  const handleEditClick = (comment: IComment) => {
    setEditComment(comment);
    setReplyTo(null);
  };

  useDisableBodyScroll(isOpen);
  useClickOutside(modalRef, onClose);
  if (!isOpen) return null;
  if (!post) return <p>Đang tải bài viết...</p>;

  return (
    <Modal>
      <div
        ref={modalRef}
        className="relative max-w-2xl max-h-[90vh] mx-auto bg-white shadow-lg rounded-md overflow-hidden mt-6 flex flex-col"
      >
        <div className="overflow-y-auto max-h-[75vh] max-w-2xl">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 p-2 z-10"
            onClick={onClose}
          >
            <FaTimes size={18} />
          </button>

          {/* Header */}
          <div className="flex items-start p-4">
            <Image
              src={post.author.avatar || "/assets/img/user.png"}
              alt="avatar"
              width={48}
              height={48}
              className="rounded-full object-cover w-12 h-12"
            />
            <div className="ml-3">
              <p className="font-semibold text-blue-600 flex items-center">
                {post.author.name}
                <span className="ml-1 text-green-500">🛡️</span>
              </p>
              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString("vi-VN")}
              </p>
              {post.caption && (
                <p className="text-gray-800 text-base mt-1">{post.caption}</p>
              )}
            </div>
          </div>

          {/* Image */}
          {Array.isArray(post.images) && post.images.length > 0 && (
            <div className="mb-3 relative w-full h-[400px]">
              <img
                src={post.images[currentImageIndex]}
                alt={`post-img-${currentImageIndex}`}
                className="w-full h-auto object-cover rounded-lg"
              />

              {post.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImageIndex(
                        currentImageIndex === 0
                          ? post.images.length - 1
                          : currentImageIndex - 1
                      )
                    }
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImageIndex(
                        currentImageIndex === post.images.length - 1
                          ? 0
                          : currentImageIndex + 1
                      )
                    }
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2"
                  >
                    ›
                  </button>

                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {post.images.map((_, i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i === currentImageIndex ? "bg-white" : "bg-gray-400"
                        }`}
                      ></span>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          {/* Video */}
          {post.videos?.length > 0 && (
            <div className="mb-3">
              {post.videos.length === 1 && (
                <video
                  src={post.videos[0]}
                  controls
                  autoPlay
                  muted
                  playsInline
                  className="w-full max-h-[500px] rounded-lg"
                />
              )}

              {post.videos.length === 2 && (
                <div className="grid grid-cols-2 gap-3">
                  {post.videos.map((video: string, index: number) => (
                    <video
                      key={index}
                      src={video}
                      controls
                      className="w-full max-h-[400px] rounded-lg"
                    />
                  ))}
                </div>
              )}

              {post.videos.length > 2 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {post.videos.map((video: string, index: number) => (
                    <video
                      key={index}
                      src={video}
                      controls
                      className="w-full max-h-[400px] rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          {/* Link Preview */}
          {Array.isArray(post.links) && post.links.length > 0 && (
            <div className="mb-3 space-y-3">
              {post.links.map((link: any, index: number) => (
                <div
                  key={index}
                  className="block border rounded-lg overflow-hidden hover:shadow-lg transition duration-300"
                >
                  {link.type === "youtube" ? (
                    <YoutubeIframe embedUrl={link.embedUrl} index={index} />
                  ) : (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      {link.image && (
                        <img
                          src={link.image}
                          alt={link.title || "Link preview"}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-3 bg-gray-50">
                        <p className="font-semibold text-gray-800 truncate">
                          {link.title || link.url}
                        </p>
                        {link.description && (
                          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                            {link.description}
                          </p>
                        )}
                        <p className="text-xs text-blue-600 mt-1 truncate">
                          {link.url}
                        </p>
                      </div>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
          {/* Reactions */}
          <div className="flex justify-between items-center text-gray-500 text-sm px-4 py-3 border-b">
            <div className="flex items-center space-x-2">
              <FaHeart className="text-red-500" />
              <AiOutlineLike className="text-blue-500" />
              <span>{post.likes?.length || 0} lượt thích</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>
                <FaCommentDots className="inline mr-1" />{" "}
                {loadingCommentCount
                  ? "Đang tải..."
                  : `${commentCount} comments`}
              </span>
              <span>
                <BsEye className="inline mr-1" /> 5
              </span>
            </div>
          </div>

          {/* Emoji bar */}
          <div className="flex items-center px-4 py-2 space-x-2 overflow-x-auto border-b">
            <span className="text-sm font-medium text-gray-600">Cảm xúc</span>
            <span className="text-2xl">🎉</span>
            <span className="text-2xl">😍</span>
            <span className="text-2xl">👏</span>
            <span className="text-2xl">❤️</span>
            <span className="text-2xl">🔥</span>
            <span className="text-2xl">😂</span>
            <span className="text-2xl">🤩</span>
            <span className="text-2xl">💯</span>
            <span className="ml-auto text-blue-500 cursor-pointer flex items-center text-sm">
              <FaStar className="mr-1" /> Huy hiệu
            </span>
            <FaShareAlt className="text-blue-500 cursor-pointer ml-2" />
          </div>

          {/* Danh sách comment (mock) */}
          <div className="px-4 pb-4 space-y-4">
            <CommentList
              postId={postId}
              onReplyClick={handleReplyClick}
              onEditClick={handleEditClick}
            />
          </div>
        </div>

        <CommentInput
          postId={postId}
          currentUserId={user?._id || ""}
          userAvatar={user?.avatar}
          replyTo={replyTo}
          editComment={editComment}
          onSendComment={handleSendComment}
          onCancelReplyOrEdit={() => {
            setReplyTo(null);
            setEditComment(null);
          }}
        />
      </div>
    </Modal>
  );
}
