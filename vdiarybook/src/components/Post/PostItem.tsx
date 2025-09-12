"use client";

import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import useLikeCount from "../LikeOfPost/LikeCount";
import useCommentCount from "@/hook/useCommentCount";
import { AiFillHeart } from "react-icons/ai";
import likeApi from "@/services/like.service";
import DetailPost from "../DetailPost/DetailPost";
import { ReactionType } from "@/types/like.type";
import {
  FaGlobeAsia,
  FaLock,
  FaThumbtack,
  FaUserFriends,
} from "react-icons/fa";
import LikeListModal from "../LikeOfPost/LikeIsPost";
import { BsThreeDots } from "react-icons/bs";
import { GoTriangleRight } from "react-icons/go";
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import UpdatePostModal from "./UpdatePostModal";
import { useDeletePost } from "@/hook/usePost";
import { toast } from "react-toastify";
import Popover from "../Popover/popover";
import { useClickOutside } from "@/hook/useClickOutside";
import AutoPauseVideo from "@/hook/useIntersectionObserver";
import DeletePostModal from "./DeletePostModal";
import { reactions, reactionColors } from "@/constant";
import Link from "next/link";
import YoutubeIframe from "@/hook/useYoutubeIframe";
import ShareMenuContent from "../Share/ShareModal";

const PostItem = ({
  post,
  onDeleted,
}: {
  post: any;
  onDeleted?: (id: string) => void;
}) => {
  const formattedTime = moment(post.createdAt).fromNow();
  const { likeCount, loading } = useLikeCount(post._id);

  const [showLikeModal, setShowLikeModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(likeCount);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [isLiking, setIsLiking] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<ReactionType | null>(
    null
  );

  const modalRef = useRef<HTMLDivElement>(null!);

  const { count: commentsCount, loading: loadingCommentCount } =
    useCommentCount(post._id);
  const { deletePost, loading: deleting } = useDeletePost();
  const handleDelete = async () => {
    try {
      await deletePost(post._id);
      toast.success("Xóa bài viết thành công");
      onDeleted?.(post._id);
    } catch (error) {
      toast.error("Xóa bài viết thất bại");
    }
    setShowDeleteModal(false);
  };
  useEffect(() => {
    setCommentCount(commentsCount);
  }, [commentsCount]);
  useEffect(() => {
    const fetchLikeState = async () => {
      if (!post._id) return;
      try {
        const res = await likeApi.checkIsLiked(post._id);
        if (res.data.isLiked) {
          setUserReaction(res.data.reactionType as ReactionType);
          setSelectedReaction(res.data.reactionType as ReactionType);
        } else {
          setUserReaction(null);
          setSelectedReaction(null);
        }
      } catch (error) {
        console.error("Lỗi kiểm tra trạng thái like:", error);
      }
    };
    fetchLikeState();
    setLocalLikeCount(likeCount);
  }, [post._id, likeCount]);

  const handleOpenModal = async () => {
    // const res = await likeApi.seeAllLikes(post._id);
    // setLikeUsers(res.data.data);
    setShowLikeModal(true);
  };

  // const handleLikeToggle = async () => {
  //   if (isLiking) return;
  //   setIsLiking(true);
  //   const action = isLiked ? "unlike" : "like";
  //   await likeApi.handleLike(post._id, action);
  //   setLocalLikeCount((prev) => prev + (isLiked ? -1 : 1));
  //   setIsLiked((prev) => !prev);
  //   setIsLiking(false);
  // };

  const handleReaction = async (
    action: "like" | "unlike",
    reaction: ReactionType
  ) => {
    if (isLiking) return;
    setIsLiking(true);

    try {
      if (userReaction === reaction) {
        await likeApi.handleLike(post._id, "unlike");
        setUserReaction(null);
        setSelectedReaction(null);
        setLocalLikeCount((prev) => prev - 1);
      } else {
        await likeApi.handleLike(post._id, action, reaction);
        setUserReaction(reaction);
        if (!userReaction) {
          setLocalLikeCount((prev) => prev + 1);
        }
      }
    } catch (err) {
      console.error("Reaction error:", err);
    } finally {
      setIsLiking(false);
    }
  };

  useClickOutside(modalRef, () => {
    if (modalRef) setMenuOpen(false);
  });

  return (
    <div className="bg-white max-w-xl rounded-lg shadow-md border border-gray-200 p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Link
            href={`/profile/${post.author?._id}`}
            className="flex items-center"
          >
            <img
              src={post.author?.avatar || "/assets/img/user.png"}
              alt={post.author?.name}
              className="w-12 h-12 rounded-full object-cover mr-3 border border-gray-200"
            />
          </Link>

          <div>
            <div className="flex items-center text-gray-900 text-lg">
              {post.postedOn && post.author._id !== post.postedOn._id ? (
                <>
                  <Link href={`/profile/${post.author._id}`}>
                    <span className="font-semibold hover:underline">
                      {post.author.name}
                    </span>
                  </Link>
                  <span className="mx-1 text-gray-500">
                    <GoTriangleRight />
                  </span>
                  <Link href={`/profile/${post.postedOn._id}`}>
                    <span className="font-semibold hover:underline">
                      {post.postedOn.name}
                    </span>
                  </Link>
                </>
              ) : (
                <Link href={`/profile/${post.author._id}`}>
                  <span className="font-semibold hover:underline">
                    {post.author.name}
                  </span>
                </Link>
              )}
            </div>
            <div className="text-sm text-gray-500 flex items-center space-x-2">
              <span>{formattedTime}</span>
              <span>•</span>
              {post.privacy === "public" && (
                <span className="flex items-center space-x-1">
                  <FaGlobeAsia />
                  <span>Công khai</span>
                </span>
              )}
              {post.privacy === "friends" && (
                <span className="flex items-center space-x-1">
                  <FaUserFriends />
                  <span>Bạn bè</span>
                </span>
              )}
              {post.privacy === "private" && (
                <span className="flex items-center space-x-1">
                  <FaLock />
                  <span>Chỉ mình tôi</span>
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="relative ml-auto ">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 hover:bg-gray-200 rounded-full"
          >
            <BsThreeDots size={18} />
          </button>
          {menuOpen && (
            <div
              ref={modalRef}
              className="absolute right-0 mt-1 w-56 bg-white border rounded-xl shadow-lg z-10"
            >
              <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100">
                <FaThumbtack className="mr-3 text-gray-700" />
                <span className="text-sm font-medium">Ghim bài viết</span>
              </button>
              <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100">
                <MdEdit className="mr-3 text-gray-700" />
                <span
                  className="text-sm font-medium"
                  onClick={() => {
                    setShowEditModal(true);
                    setMenuOpen(false);
                  }}
                >
                  Chỉnh sửa bài viết
                </span>
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(true);
                }}
                disabled={deleting}
                className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
              >
                <MdOutlineDelete className="mr-3 text-gray-700" />
                <span className="text-sm font-medium">Xóa bài viết</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Nội dung bài viết */}
      {post.caption?.startsWith("http") && post.links?.[0] ? (
        <a
          href={post.links[0].url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline block mb-3 leading-relaxed"
        >
          {post.links[0].url}
        </a>
      ) : (
        <p className="text-gray-800 mb-3 leading-relaxed">{post.caption}</p>
      )}
      {/* ✅ Nếu là bài share thì render originalPost */}
      {post.type === "share" && post.originalPost && (
        <div className="border rounded-lg p-3 bg-gray-50 mb-3">
          <div className="flex items-center mb-2">
            <img
              src={post.originalPost.author?.avatar || "/assets/img/user.png"}
              alt={post.originalPost.author?.name}
              className="w-8 h-8 rounded-full mr-2"
            />
            <div>
              <p className="font-semibold text-gray-800">
                {post.originalPost.author?.name}
              </p>
              <p className="text-xs text-gray-500">
                {moment(post.originalPost.createdAt).fromNow()}
              </p>
            </div>
          </div>
          <p className="text-gray-700 mb-2">{post.originalPost.caption}</p>

          {/* Nếu bài gốc có ảnh */}
          {Array.isArray(post.originalPost.images) &&
            post.originalPost.images.length > 0 && (
              <img
                src={post.originalPost.images[0]}
                alt="shared-post-img"
                className="w-full h-auto rounded-lg"
              />
            )}

          {/* Nếu bài gốc có video */}
          {Array.isArray(post.originalPost.videos) &&
            post.originalPost.videos.length > 0 && (
              <AutoPauseVideo src={post.originalPost.videos[0]} />
            )}

          {Array.isArray(post.originalPost.links) &&
            post.originalPost.links.length > 0 && (
              <div className="mb-3 space-y-3">
                {post.originalPost.links.map((link: any, index: number) => (
                  <div
                    key={index}
                    className="block border rounded-lg overflow-hidden hover:shadow-lg transition duration-300"
                  >
                    {link.type === "youtube" ? (
                      <YoutubeIframe
                        embedUrl={post.originalPost.embedUrl}
                        index={index}
                      />
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
        </div>
      )}

      {/* Ảnh */}
      {Array.isArray(post.images) && post.images.length > 0 && (
        <div className="mb-3">
          {post.images.length === 1 && (
            <img
              src={post.images[0]}
              alt="post-img-0"
              className="w-full h-auto object-cover rounded-lg cursor-pointer"
              onClick={() => setShowDetail(true)}
            />
          )}

          {post.images.length === 2 && (
            <div className="grid grid-cols-2 gap-2">
              {post.images.map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  alt={`post-img-${i}`}
                  className="w-full h-auto object-cover rounded-lg cursor-pointer"
                  onClick={() => setShowDetail(true)}
                />
              ))}
            </div>
          )}

          {post.images.length === 3 && (
            <div className="grid grid-cols-3 gap-2">
              {post.images.map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  alt={`post-img-${i}`}
                  className="w-full h-auto object-cover rounded-lg cursor-pointer"
                  onClick={() => setShowDetail(true)}
                />
              ))}
            </div>
          )}

          {post.images.length > 3 && (
            <div className="grid grid-cols-2 gap-2">
              {post.images.slice(0, 3).map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  alt={`post-img-${i}`}
                  className="w-full h-[200px] object-cover rounded-lg cursor-pointer"
                  onClick={() => setShowDetail(true)}
                />
              ))}
              <div className="relative">
                <img
                  src={post.images[3]}
                  alt="post-img-3"
                  className="w-full h-[200px] object-cover rounded-lg cursor-pointer"
                  onClick={() => setShowDetail(true)}
                />
                {post.images.length > 4 && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg text-white text-xl font-bold">
                    +{post.images.length - 4}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {/* Video */}
      {post.videos?.length > 0 && (
        <div className="mb-3">
          {post.videos.length === 1 && <AutoPauseVideo src={post.videos[0]} />}

          {post.videos.length === 2 && (
            <div className="grid grid-cols-2 gap-3">
              {post.videos.map((video: string, index: number) => (
                <AutoPauseVideo key={index} src={video} />
              ))}
            </div>
          )}

          {post.videos.length > 2 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {post.videos.map((video: string, index: number) => (
                <AutoPauseVideo key={index} src={video} />
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

      {/* Like + Comment count */}
      <div className="flex justify-between items-center text-gray-500 text-sm mb-3 border-b pb-3 border-gray-100">
        <div className="flex items-center" onClick={handleOpenModal}>
          <AiFillHeart className="text-xl text-red-600" />
          <span>
            {isLiking || loading ? "Đang tải..." : localLikeCount + " like"}
          </span>
        </div>
        <div>
          <span onClick={() => setShowDetail(true)}>
            {loadingCommentCount ? "Đang tải..." : `${commentCount}`} bình luận
          </span>
        </div>
      </div>

      {/* Nút tương tác */}
      <div className="flex justify-around items-center text-gray-600 text-sm font-semibold whitespace-nowrap">
        <Popover
          openOnHover
          trigger={
            <button className="flex items-center p-2 rounded-full hover:bg-gray-100">
              {selectedReaction ? (
                <>
                  <span
                    className={`mr-2 ${
                      reactionColors[selectedReaction] || "text-gray-600"
                    }`}
                  >
                    {reactions.find((r) => r.type === selectedReaction)?.icon}
                  </span>
                  <span
                    className={`${
                      reactionColors[selectedReaction] || "text-gray-600"
                    } font-medium`}
                  >
                    {reactions.find((r) => r.type === selectedReaction)?.label}
                  </span>
                </>
              ) : (
                <>
                  <i className="fas fa-smile mr-2"></i>
                  Cảm xúc
                </>
              )}
            </button>
          }
        >
          <div className="absolute bottom-full mb-2 left-0 bg-white shadow-lg rounded-full px-3 py-2 flex space-x-2 border border-gray-200 z-50">
            {reactions.map((r) => (
              <button
                key={r.type}
                className="relative flex flex-col items-center text-3xl hover:scale-125 transition-transform group"
                onClick={() => {
                  handleReaction("like", r.type as ReactionType);
                  setSelectedReaction(r.type as ReactionType);
                }}
              >
                {r.icon}
                <span className="absolute bottom-full mb-1 px-2 py-1 text-xs text-white bg-black rounded-xl opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150 whitespace-nowrap">
                  {r.label}
                </span>
              </button>
            ))}
          </div>
        </Popover>

        <button className="flex items-center p-2 rounded-full hover:bg-gray-100 transition-colors flex-1 justify-center mx-1 whitespace-nowrap">
          <i className="fas fa-award mr-2"></i>
          <span>Huy hiệu</span>
        </button>

        <button
          onClick={() => setShowDetail(true)}
          className="flex items-center p-2 rounded-full hover:bg-gray-100 transition-colors flex-1 justify-center mx-1 whitespace-nowrap"
        >
          <i className="fas fa-comment-alt mr-2"></i>
          <span>Bình luận</span>
        </button>

        <Popover
          openOnHover={false}
          trigger={
            <button className="flex items-center p-2 rounded-full hover:bg-gray-100 transition-colors flex-1 justify-center mx-1 whitespace-nowrap">
              <i className="fas fa-share-alt mr-2"></i>
              <span>Chia sẻ</span>
            </button>
          }
          className="absolute bottom-full mb-2 right-0 bg-white shadow-lg rounded-lg border border-gray-200 z-50"
        >
          <ShareMenuContent post={post} />
        </Popover>
      </div>

      {/* Lượt xem */}
      <div className="text-right text-gray-500 text-sm mt-3 pt-3 border-t border-gray-100">
        <i className="fas fa-eye mr-1"></i>
        <span>{post.viewsCount || 0} lượt xem</span>
      </div>

      {showLikeModal && (
        <LikeListModal
          isOpen
          postId={post._id}
          onClose={() => setShowLikeModal(false)}
        />
      )}
      {showDetail && (
        <DetailPost
          isOpen
          postId={post._id}
          onClose={() => setShowDetail(false)}
        />
      )}
      {showEditModal && (
        <UpdatePostModal
          open
          post={post}
          onClose={() => setShowEditModal(false)}
        />
      )}
      {showDeleteModal && (
        <DeletePostModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default PostItem;
