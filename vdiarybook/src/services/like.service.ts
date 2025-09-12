import { AxiosResponse } from "axios";
import http from "./api.service";
import { checkIsLikedResponse, GetAllLikesResponse, GetReactionOfPostResponse } from "@/types/like.type";

const likeApi = {
    handleLike: async (postId: string, action: "like" | "unlike", type: "like" | "love" | "haha" | "wow" | "sad" | "angry" = "like"): Promise<AxiosResponse> => {
      return await http.post(`/likes`, { postId, action, type });
    },
    
    checkIsLiked: async (postId: string): Promise<AxiosResponse<checkIsLikedResponse>> => {
      return await http.get(`/likes/check/${postId}`);
    },

    seeAllLikes: async(postId: string, page = 1, limit = 10 ): Promise<AxiosResponse<GetAllLikesResponse>> => {
        return await http.get(`/likes/${postId}`, {
             params: { page, limit },
        }); 
    },

    getReactionOfPost: async(postId: string): Promise<AxiosResponse<GetReactionOfPostResponse>> => {
      return await http.get(`/likes/reactions/${postId}`)
    }

}

export default likeApi;