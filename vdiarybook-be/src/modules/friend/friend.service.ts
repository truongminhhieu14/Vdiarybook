import mongoose from "mongoose";
import { FriendModel } from "./friend.model";
import UserModel from "../auth/auth.model";

export const sendFriendRequest = async (requesterId: string, recipientId: string) => {
  if (requesterId === recipientId) {
    throw new Error("Can't send friend requests to myself");
  }

  const existed = await FriendModel.findOne({
    requester: requesterId,
    recipient: recipientId,
    type: "friend_request"
  });

  if (existed) {
    throw new Error("This friend request has been sent before");
  }

  const newRequest = await FriendModel.create({
    requester: requesterId,
    recipient: recipientId,
    type: "friend_request",
    status: "pending",
  });

  return newRequest;
};


export const getFriendsList = async (userId: string, page: number = 1, limit: number = 10) => {
  const objectUserId = new mongoose.Types.ObjectId(userId);
  const skip = (page - 1) * limit;
  const friendships = await FriendModel.find({
    $or: [
      { requester: objectUserId, status: "accepted", type: "friend_request" },
      { recipient: objectUserId, status: "accepted", type: "friend_request" },
    ],
  })
    .skip(skip)
    .limit(limit)
    .populate("requester", "name avatar verified background")
    .populate("recipient", "name avatar verified background");

  const friends = friendships
    .map((f) => {
      if (!f.requester || !f.recipient) return null;
      const isRequester = f.requester._id.toString() === userId;
      return isRequester ? f.recipient : f.requester;
    })
    .filter(Boolean);

    const count = await FriendModel.countDocuments({
    $or: [
      { requester: objectUserId, status: "accepted", type: "friend_request" },
      { recipient: objectUserId, status: "accepted", type: "friend_request" },
    ],
  });

  return {
    data : friends,
    count,
    hasMore: page * limit < count
  };
};


export const acceptFriendRequest = async (requesterId: string, recipientId: string) => {
  const updated = await FriendModel.findOneAndUpdate(
    {
      requester: requesterId,
      recipient: recipientId,
      type: "friend_request",
      status: "pending"
    },
    { status: "accepted" },
    { new: true }
  );
  return updated;
};

export const rejectFriendRequest = async (requestId: string, userId: string) => {
  const request = await FriendModel.findById(requestId);

  if (!request) throw new Error("You did not find any connection invitations.");

  if (request.recipient.toString() !== userId && request.requester.toString() !== userId) {
    throw new Error("You have no right to refuse this invitation.");
  }

  await FriendModel.findByIdAndDelete(requestId);

  return { success: true, message: "Friend request cancelled/declined successfully" };
};

export const getFriendRequest = async (userId: string, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const requests = await FriendModel.find({
    recipient: userId,
    type: "friend_request",
    status: "pending"
  })
    .skip(skip)
    .limit(limit)
    .sort({createdAt: -1})
    .populate("requester", "name avatar background verified");

    const count = await FriendModel.countDocuments({
      recipient: userId,
      type: "friend_request",
      status: "pending"
    })
    
  const totalPages = Math.ceil(count / limit);
  const hasMore = page < totalPages;
  return {
    data: requests,
    pagination: {
      page,
      limit,
      count,
      totalPages,
      hasMore
    }
  };
}

export const getSentFriendRequest = async (userId: string, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const requests = await FriendModel.find({
    requester: userId,
    type: "friend_request",
    status: "pending"
  })
    .skip(skip)
    .limit(limit)
    .sort({createdAt: -1})
    .populate("recipient", "name avatar background verified");

    const count = await FriendModel.countDocuments({
      requester: userId,
      type: "friend_request",
      status: "pending"
    })
    
  const totalPages = Math.ceil(count / limit);
  const hasMore = page < totalPages;
  return {
    data: requests,
    pagination: {
      page,
      limit,
      count,
      totalPages,
      hasMore
    }
  };
}

export const unfriend = async (userId: string, friendId: string) => {
  if (userId === friendId) {
    throw new Error("can't unfriend myself");
  }
  const existingFriend = await FriendModel.findOne({
    $or: [
      { requester: userId, recipient: friendId, status: "accepted" },
      { requester: friendId, recipient: userId, status: "accepted" }
    ],
    type: "friend_request",
    status: "accepted"
  });
  if (!existingFriend) {
    throw new Error("Not friend");
  }
  await FriendModel.deleteOne({_id: existingFriend._id})
  return true;
};
export const handleFollow = async (requesterId: string, recipientId: string) => {
  if(requesterId === recipientId) throw new Error("can't follow myself")
  
  const existed = await FriendModel.findOne({
    requester: requesterId,
    recipient: recipientId,
    type: "follow"
  });
  if(existed) {
    throw new Error("You have followed this user")
  };

  return await FriendModel.create({
    requester: requesterId,
    recipient: recipientId,
    type: "follow",
    status: "following"
  })
}

export const handleUnfollow = async (requesterId: string, recipientId: string) => {
  if(requesterId === recipientId) {
    throw new Error("can't unfollow myself");
  } 
  const existed = await FriendModel.findOne({
    requester: requesterId,
    recipient: recipientId,
    type: "follow",
    status: "following",
  });
  if(!existed) {
    throw new Error("You are not following this person.")
  }
  await FriendModel.deleteOne({ _id: existed._id});
};

export const searchFriends = async (userId: string, keyword: string) => {

  const objectUserId = new mongoose.Types.ObjectId(userId);
  const regex = new RegExp(keyword, "i");
  const relations = await FriendModel.find({
    type: "friend_request",
    status: "accepted",
    $or: [
      { requester: objectUserId },
      { recipient: objectUserId },
    ],
  }).lean();

  const friendIds = relations.map(rel => {
    return rel.requester.toString() === userId 
      ? rel.recipient
      :rel.requester;
  });

  const matchedFriends = await UserModel.find({
    _id: { $in: friendIds },
    name: { $regex: regex }
  }).select("_id name avatar email");

  return matchedFriends;
}

export const getFriendSuggestions = async (userId: string, page = 1, limit = 10) => {
  const objectUserId = new mongoose.Types.ObjectId(userId);

  const relationships = await FriendModel.find({
    $or: [
      { requester: objectUserId },
      { recipient: objectUserId },
    ]
  });

  const excludedIds = new Set<string>();
  excludedIds.add(userId);
  relationships.forEach(rel => {
    excludedIds.add(rel.requester.toString());
    excludedIds.add(rel.recipient.toString());
  });

  const skip = (page - 1) * limit

  const count = await UserModel.countDocuments({
    _id: { $nin: Array.from(excludedIds) }
  })

  const suggestions = await UserModel.find({
    _id: { $nin: Array.from(excludedIds) },
  })
    .skip(skip)
    .limit(limit)
    .select("_id name avatar background verified")

    const hasMore = skip + suggestions.length < count;
  return {
    suggestions,
    pagination: {
      page,
      limit,
      count,
      hasMore
    }
  };
};

export const getFollowing = async (userId: string, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const following = await FriendModel.find({
    requester: userId,
    type: "follow",
    status: "following"
  })
    .skip(skip)
    .limit(limit)
    .sort({createdAt : -1})
    .populate("recipient", "name avatar background");

    const count = await FriendModel.countDocuments({
      requester: userId,
      type: "follow",
      status: "following"
    });
    return {
      data: following,
      pagination: {
        page,
        limit,
        count,
        totalPages: Math.ceil(count / limit),
        hasMore: skip + following.length < count
      }
    }
};

export const getFollower = async (userId: string, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const follower = await FriendModel.find({
    recipient: userId,
    type: "follow",
    status: "following"
  })
    .skip(skip)
    .limit(limit)
    .sort({createdAt : -1})
    .populate("requester", "name avatar background");

    const count = await FriendModel.countDocuments({
      requester: userId,
      type: "follow",
      status: "following"
    });
    return {
      data: follower,
      pagination: {
        page,
        limit,
        count,
        totalPages: Math.ceil(count / limit),
        hasMore: skip + follower.length < count
      }
    }
};

export const getMutualFriendsBatchService = async (userId: string, targetIds: string[]) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("ID không hợp lệ");
  }

  const userFriends = await FriendModel.find({
    $or: [
      { requester: userId, status: "accepted", type: "friend_request" },
      { recipient: userId, status: "accepted", type: "friend_request" },
    ]
  });
  const extractFriendId = (record: any, currentId: string) => {
    return record.requester.toString() === currentId
      ? record.recipient.toString()
      : record.requester.toString();
  };
  const userFriendIds = userFriends.map(f => extractFriendId(f, userId));

  const allTargetFriends = await FriendModel.find({
    $or: targetIds.flatMap(targetId => ([
      { requester: targetId, status: "accepted", type: "friend_request" },
      { recipient: targetId, status: "accepted", type: "friend_request" },
    ]))
  });

  const targetFriendMap: { [key: string]: string[] } = {};
  for (const targetId of targetIds) {
    targetFriendMap[targetId] = allTargetFriends
      .filter(f => f.requester.toString() === targetId || f.recipient.toString() === targetId)
      .map(f => extractFriendId(f, targetId));
  }

  const result: { [key: string]: { count: number, mutualFriends: any[] } } = {};
  for (const targetId of targetIds) {
    const mutualFriendIds = userFriendIds.filter(id => targetFriendMap[targetId].includes(id));
    const mutualFriends = await UserModel.find({ _id: { $in: mutualFriendIds } }).select("name avatar email");
    result[targetId] = {
      count: mutualFriends.length,
      mutualFriends,
    };
  }
  return result;
};


