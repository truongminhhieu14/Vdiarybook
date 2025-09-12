import { Response } from 'express'
import { POST_MESSAGES } from '~/constants/message'
import { AuthRequest } from '~/middleware/auth.middleware'
import { postService } from './post.service'

export const extractLinkMetadataController = async (req: AuthRequest, res: Response) => {
  try {
    const { caption } = req.body;

    if (!caption) {
      return res.status(400).json({ message: "Caption is required" });
    }

    const metadata = await (postService as any).extractLinkMetadata(caption);

    res.status(200).json({ success: true, data: metadata });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createPostController = async (req: AuthRequest, res: Response) => {
  const userId = req.userId as string
  const result = await postService.createPost(userId, req.body);
  return res.status(201).json({
    message: POST_MESSAGES.POST_SUCCESS,
    result
  })
}

export const updatePostController = async (req: AuthRequest, res: Response) => {
  const userId = req.userId as string;
  const { postId } = req.params;
  const body = req.body;

  const updatePost = await postService.updatePost(userId, postId, body);
  return res.status(200).json({
    message: POST_MESSAGES.UPDATE_POST_SUCCESS,
    updatePost
  }) 
}

export const deletePostController = async (req: AuthRequest, res: Response) => {
  const userId = req.userId as string;
  const { postId } = req.params;
  await postService.deletePost(userId, postId);

  return res.status(200).json({
    success: true,
    message: POST_MESSAGES.DELETE_POST_SUCCESS
  })
}

export const getPostByPostIdController = async (req: AuthRequest, res: Response) => {
  const {postId} = req.params;
  const post = await postService.getPostByPostId(postId);

  return res.status(200).json({
    message: POST_MESSAGES.GET_POST_SUCCESS,
    data: post
  })
}

export const getNewFeedsController = async (req: AuthRequest, res: Response) => {
  const userId = req.userId as string
  const limit = Number(req.query.limit) || 10
  const page = Number(req.query.page) || 1

  const { posts, total } = await postService.getNewFeeds({ userId: userId, limit, page })  
  const hasMore = page < Math.ceil(total / limit)
  return res.status(200).json({
    userId,
    posts,
    total,
    page,
    limit,
    hasMore
  })
}

export const getAllPostOfUserController = async (req: AuthRequest, res: Response) => {
  const userId = req.params.userId
  const limit = Number(req.query.limit) || 10
  const page = Number(req.query.page) || 1
  const currentUserId = req.userId as string;

  const { posts, total } = await postService.getAllPostOfUser({userId: userId, page, limit, currentUserId})
  const hasMore = page < Math.ceil(total / limit);
  return res.status(200).json({
    userId,
    posts,
    total, 
    page,
    limit, 
    hasMore
  })
}

export const getRandomFeedsController = async (req: AuthRequest, res: Response) => {
  const userId = req.userId as string;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  const {posts, total} =  await postService.getRandomFeeds({userId, limit, page});
  const hasMore = page < Math.ceil(total / limit);
  return res.json({userId, posts, page, limit, total, hasMore})
}
