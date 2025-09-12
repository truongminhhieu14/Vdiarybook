import { AuthRequest } from "~/middleware/auth.middleware";
import { commentService } from "./comment.service";
import { Response } from "express";
import { COMMENT_MESSAGES} from "~/constants/message";

export const createCommentController = async(req: AuthRequest, res: Response) =>{
    const userId = req.userId as string;
    const { postId } = req.params;
    const result = await commentService.createComment(userId, postId, req.body)
    return res.json({message: COMMENT_MESSAGES.CREATE_SUCCESS, result})
}

export const createChildCommentController = async (req: AuthRequest, res: Response) => {
    const userId = req.userId as string;
    const {postId, parentCommentId} = req.params;

    const result = await commentService.createChildComment(userId, postId, parentCommentId, req.body);
    return res.json({ message: COMMENT_MESSAGES.CREATE_CHILD_SUCCESS, result });
}

export const updateCommentController = async(req: AuthRequest, res: Response) => {
  const userId = req.userId as string;
  const { commentId } = req.params;

  const result = await commentService.updateComment(userId, commentId, req.body);
  return res.json(result);

}

export const deleteCommentController = async (req: AuthRequest, res: Response) => {
  const userId = req.userId as string;
  const { commentId } = req.params;

  const result = await commentService.deleteComment(userId, commentId);
  return res.json({ message: COMMENT_MESSAGES.DELETE_SUCCESS, result });
};

export const getCommentController = async (req: AuthRequest, res: Response) => {
    const  postId  = req.params.postId
    const limit = Number(req.query.limit)
    const page = Number(req.query.page)
    const result = await commentService.getAllParrentCommentOfPost({postId, limit, page});
    return res.json(result)
}

export const getChildCommentsController = async (req: AuthRequest, res: Response) => {
  const parentCommentId = req.params.parentCommentId;

  const result = await commentService.getAllChildCommentOfParentComment(parentCommentId);
  return res.json(result);
};

export const countTotalCommentsController = async (req: AuthRequest, res: Response) => {
  const postId = req.params.postId;

  const result = await commentService.getCountAllCommentOfPost(postId);
  return res.json({ countComments: result });
};