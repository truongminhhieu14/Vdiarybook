"use client";

import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import "moment/locale/vi";
import { IPost } from "@/types/post.type";
import postApi from "@/services/post.service";
import { getUserIdFromLocalStorage } from "@/utils/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addPost, appendPosts, setPosts } from "@/store/postSlice";
import PostItem from "./PostItem";


moment.locale("vi");

interface ProfilePostsProps {
  newPost?: IPost | null;
  profileUserId?: string;
}

const ProfilePosts = ({ newPost, profileUserId }: ProfilePostsProps) => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const posts = useSelector((state: RootState) => state.post.posts);
  const dispatch = useDispatch();
  const isFetchingRef = useRef(false);

  useEffect(() => {
    setUserId(getUserIdFromLocalStorage());
  }, []);
  const handleDeletedPost = (postId: string) => {
    dispatch(setPosts(posts.filter(post => post._id !== postId)));
  };

  const fetchPosts = async (pageNum: number) => {
    try {
      setLoading(true);
      let res;
      if(profileUserId){
        res = await postApi.getAllPostOfUser(profileUserId, pageNum, 10);

      }else {
        res = await postApi.getNewFeed(pageNum, 10)
      }
      const feedList = res.data.posts || []
      const hasMore = res.data?.hasMore || false;
      if (pageNum === 1) {
        dispatch(setPosts(feedList));
      } else {
        dispatch(appendPosts(feedList));
      }
      setHasMore(hasMore);
    } catch (error) {
      console.error("Lỗi khi tải bài viết", error);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    if (userId) fetchPosts(page);
  }, [userId, page]);

  const loadMore = () => {
    if (isFetchingRef.current || !hasMore) return;
    isFetchingRef.current = true;
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || loading) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1, rootMargin: "0px 0px 100px 0px" }
    );
    observer.observe(loadMoreRef.current);
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, loading]);

  useEffect(() => {
    if (newPost) {
      dispatch(addPost(newPost));
    }
  }, [newPost]);

  return (
    <>
      <div className="space-y-4">
        {posts.map((post, index) => (
          <PostItem key={`${post._id}-${index}`} post={post} onDeleted={handleDeletedPost}/>
        ))}
      </div>
      {hasMore && <div ref={loadMoreRef} className="h-10" />}
    </>
  );
};

export default ProfilePosts;
