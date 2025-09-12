import { AuthRequest } from "~/middleware/auth.middleware";
import { likeService } from "./like.service";
import { LIKE_MESSAGES } from "~/constants/message";
import { Response } from "express";

export const handleLikeController = async (req: AuthRequest, res: Response) => {
    const userId = req.userId as string;
    const {postId, action, type} = req.body;
    if(action === 'like') {
        await likeService.createLike(userId, postId, type)
        res.status(201).json({
            message: LIKE_MESSAGES.LIKE_SUCCESS,
            success: true,
            data: {postId, type}
        })
    }else if(action === 'unlike'){
        await likeService.unLike(userId, postId)
        res.status(201).json({
            message: LIKE_MESSAGES.UNLIKE_SUCCESS,
            success: true,
            data: {postId}
        })
    }
}

export const  seeAllLikeOfPostController = async (req: AuthRequest, res: Response) => {
    const {postId} = req.params
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const likes = await likeService.seeAllLikesOfPost(postId, page, limit);
    const count = await likeService.getCountLikesOfPost(postId);
    const hasMore = Math.ceil(count / limit)
    return res.status(200).json({
        message: LIKE_MESSAGES.SEE_ALL_LIKE_OF_POST,
        success: true,
        data: likes,
        pagination: {
            page,
            limit,
            count,
            hasMore
        }
    })
}

export const getReactionOfPostController= async(req: AuthRequest, res: Response) => {
    const {postId} = req.params;
    const reactions = await likeService.getReactionOfPost(postId);
    return res.status(200).json({
        success: true,
        data: reactions
    })
}

export const checkIsLikedController = async (req: AuthRequest, res: Response) => {
  const userId = req.userId as string;
  const postId = req.params.postId;

  const isLiked = await likeService.checkIsLiked(userId, postId);
  res.status(200).json(isLiked);
};


