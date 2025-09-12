import { Request, Response } from "express";
import { acceptFriendRequest, getFollower, getFollowing, getFriendRequest, getFriendsList, getFriendSuggestions, getMutualFriendsBatchService, getSentFriendRequest, handleFollow, handleUnfollow, rejectFriendRequest, searchFriends, sendFriendRequest, unfriend } from "./friend.service";
import { AuthRequest } from "~/middleware/auth.middleware";
import { httpStatus } from "~/constants/httpStatus";
import UserModel from "../auth/auth.model";


export const handleFriendActionController = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const { recipientId, requestId, friendId, action } = req.body;

  if (!userId || !action) {
    res.status(httpStatus.BAD_REQUEST).json({ success: false, message: "Missing userId or action" });
    return
  }  

  const user = await UserModel.findById(recipientId)

    let result;
    switch (action) {
      case "send":
        if (!user) throw new Error("Missing recipientId");
        result = await sendFriendRequest(userId, recipientId);
        return res.status(httpStatus.CREATED).json({
          success: true,
          message: "Friend request sent successfully",
          data: result,
        });

      case "accept":
        if (!recipientId) throw new Error("Missing requesterId");
        result = await acceptFriendRequest(recipientId, userId);
        return res.status(httpStatus.OK).json({
          success: true,
          message: "Friend request accepted",
          data: result,
        });

      case "reject":
        if (!requestId) throw new Error("Missing requestId");
        result = await rejectFriendRequest(requestId, userId);
        return res.status(200).json({
          success: true,
          message: "Friend request rejected",
          data: result,
        });

      case "unfriend":
        if (!friendId) throw new Error("Missing friendId");
        await unfriend(userId, friendId);
        return res.status(httpStatus.OK).json({
          success: true,
          message: "Unfriended successfully",
        });
      
      case "follow":
        if (!recipientId) throw new Error("Missing recipientId");
        result = await handleFollow(userId, recipientId);
        return res.status(httpStatus.OK).json({
          success: true,
          message: "Followed successfully",
          data: result,
        });

      case "unfollow":
        if (!recipientId) throw new Error("Missing recipientId");
        result = await handleUnfollow(userId, recipientId);
        return res.status(httpStatus.OK).json({
          success: true,
          message: "Unfollowed successfully",
          data: result,
        });

      default:
        return res.status(httpStatus.BAD_REQUEST).json({
          success: false,
          message: "Invalid action type",
        });
    }
};


export const searchFriendsController = async (req: AuthRequest, res: Response) => {
    const keyword = req.query.keyword as string;
    const userId = req.userId;

    if (!userId) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
    }
    if (!keyword || keyword.trim() === "") {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "Please enter search keyword" });
    }
    const result = await searchFriends(userId, keyword);

    return res.status(httpStatus.OK).json({
      success: true,
      data: result,
    });
}

export const getMutualFriendsBatchController = async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    const targetIds = req.body.targetIds;
    if (!userId || !Array.isArray(targetIds) || targetIds.length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Missing userId or targetIds"
      });
    }
    const result = await getMutualFriendsBatchService(userId, targetIds);
    res.status(httpStatus.OK).json({
      success: true,
      data: result,
    });
};

export const getFriendDataController = async (req: AuthRequest, res: Response) => {
    const userId = req.params.userId || req.userId;
    if (!userId) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const type = req.query.type as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    switch (type) {
      case "friends": {
        const { data: friends, count, hasMore } = await getFriendsList(userId, page, limit);
        return res.status(httpStatus.OK).json({
          success: true,
          type,
          data: {
            friends,
          pagination: { page, limit, count, hasMore },}
        });
      }

      case "requests": {
       const { data: requests, pagination } = await getFriendRequest(userId, page, limit);
        return res.status(httpStatus.OK).json({
          success: true,
          type,
          data: {
            requests,
            pagination
          },
        });
      }

      case "sentRequests": {
        const {data: sentRequests, pagination} = await getSentFriendRequest(userId, page, limit);
        return res.status(httpStatus.OK).json({
          success: true,
          type,
          data: {
            sentRequests,
            pagination
          }
        })
      }

      case "suggestions": {
        const { suggestions, pagination } = await getFriendSuggestions(userId, page, limit);
        return res.status(httpStatus.OK).json({
          success: true,
          type,
          data: suggestions,
          pagination,
        });
      }

      case "following": {
        const { data: following, pagination } = await getFollowing(userId, page, limit);
        return res.status(httpStatus.OK).json({
          success: true,
          type,
          data: {
            following,
            pagination,
          },
        });
      }

      case "followers": {
        const { data: followers, pagination } = await getFollower(userId, page, limit);
        return res.status(httpStatus.OK).json({
          success: true,
          type,
          data: {
            followers,
            pagination,
          },
        });
      }
    
      default:
        return res.status(httpStatus.BAD_REQUEST).json({
          success: false,
          message: "Invalid type. Must be 'friends', 'requests' or 'suggestions'",
        });
    }
};


