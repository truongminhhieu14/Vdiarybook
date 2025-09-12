import commentApi from "@/services/comment.service";
import { useEffect, useState } from "react";

export default function useCommentCount(postId: string) {
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    
    useEffect(() => {
        if(!postId) return;

        const fetchCountComment = async () => {
            setLoading(true);
            try {
                const res = await commentApi.getCountAllCommentOfPost(postId);
                setCount(res.data.countComments)
            } catch (error) {
                setCount(0);          
            } finally {
                setLoading(false);
            }
        }
        fetchCountComment();
    }, [postId])
    return {count, loading}
}