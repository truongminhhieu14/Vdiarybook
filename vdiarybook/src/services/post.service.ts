import http from "./api.service";
import {
  INewFeeds,
  IPost,
  LinkMeta,
  LinkMetaResponse,
} from "@/types/post.type";
import { SuccessResponse } from "@/types/response";
import { AxiosResponse } from "axios";

export interface CreatePostPayload {
  caption: string;
  images: string[];
  videos: string[];
  links: LinkMeta[];
  hashtags: string[];
  mentions: string[];
  privacy: "public" | "friends" | "private";
  postedOn?: string;
}

const postApi = {
  createPost: async (data: CreatePostPayload): Promise<AxiosResponse<{ result: IPost }>> => {
    return await http.post("/posts", data, {
    });
  },
  getPostByPostId: async (postId: string): Promise<AxiosResponse<{ data: IPost }>> => {
    return await http.get(`/posts/${postId}`, {
    });
  },

  getRandomFeed: async (page = 1, limit = 10): Promise<AxiosResponse<INewFeeds>> => {
    return await http.get("/posts/feeds", {
      params: { page, limit }
    })
  },

  getNewFeed: async (page = 1, limit = 10): Promise<AxiosResponse<INewFeeds>> => {
    return await http.get("/posts", {
      params: { page, limit } });
  },

  getAllPostOfUser: async(userId: string ,page = 1, limit = 10): Promise<AxiosResponse<INewFeeds>> => {
    return await http.get(`/posts/profile/${userId}`, {params: {page, limit}});
  },
  
  getLinkMetadata: async (caption: string): Promise<AxiosResponse<LinkMetaResponse>> => {
    return await http.post(
      "/posts/metadata",
      { caption },
    );
  },

  updatePost: async (postId: string, data: Partial<CreatePostPayload>): Promise<AxiosResponse<{updatePost: IPost}>> => {
    return await http.put(`/posts/${postId}`, data , {
    })
  },

  deletePost: async (postId: string): Promise<AxiosResponse<SuccessResponse<null>>> => {
    return await http.delete(`/posts/${postId}`, {
    })
  },

};

export default postApi;
