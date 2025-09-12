import { IComment } from "@/types/comment.type";
import { AxiosResponse } from "axios";
import http from "./api.service"
import { SuccessResponse } from "@/types/response";


const commentApi = {
    createComments: async (postId: string, text: string, parentId: string | null = null): Promise<AxiosResponse<{ comment: IComment }>> => {
        return await http.post(`/comments/${postId}`, { text, parentId });
    },

    createChildComments: async (postId: string, parentCommentId: string, text: string, mentions: string[] = []): Promise<AxiosResponse<{result: IComment}>> => {
        return await http.post(`/comments/reply/${postId}/${parentCommentId}`, {text, mentions});
    },
    updateComments: async (commentId: string, text: string): Promise<SuccessResponse<{commentId: string}>> => {
        return await http.put(`/comments/${commentId}`, {text})
    },

    deleteComments: async (commentId: string): Promise<SuccessResponse<{commentId: string}>> => {
        return await http.delete(`/comments/${commentId}`)
    },

    getAllComments: async (postId: string, page = 1, limit = 10): Promise<AxiosResponse<IComment[]>> => {
        return await http.get(`/comments/post/${postId}`, {
            params: { limit, page },
        });
    },
    getChildComments: async(parentCommentId: string): Promise<AxiosResponse<IComment[]>> => {
        return await http.get(`/comments/replies/${parentCommentId}`)
    },

    getCountAllCommentOfPost: async(postId: string): Promise<AxiosResponse<{countComments: number}>> => {
        return await http.get(`/comments/count/${postId}`)
    }
}

export default commentApi;