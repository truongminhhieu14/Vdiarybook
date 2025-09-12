import postApi from "@/services/post.service";
import { IPost } from "@/types/post.type";
import { useState } from "react"

export const useUpdatePost = () => {
    const [loading, setLoading] = useState(false);
    const updatePost = async(postId: string, data: Partial<IPost>) => {
        try {
            setLoading(true);
            const res = await postApi.updatePost(postId, data);
            return res.data;
        } catch (error) {
            console.error("Update post failed", error);
            
        }finally{
            setLoading(false);
        }
    }
    return { updatePost, loading};
}

export const useDeletePost = () => {
    const [loading, setLoading] = useState(false);

    const deletePost = async(postId: string) => {
        try {
            setLoading(true);
            const res = await postApi.deletePost(postId);
            return res.data;
        } catch (error) {
            console.error("Delete post failed", error);
            
        } finally  {
            setLoading(false)
        }
    }
    return { deletePost, loading };
}