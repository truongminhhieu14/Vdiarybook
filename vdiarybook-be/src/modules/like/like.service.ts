import { ObjectId } from "mongodb";
import { ILike, Like } from "./like.model";
import { Post } from "../post/post.model";
import { count } from "console";

class LikeService {
  async createLike(userId: string, postId: string, type: ILike["type"]) {
    await Like.findOneAndUpdate(
      { userId: new ObjectId(userId), postId: new ObjectId(postId) },
      {
        $set: {
          userId: new ObjectId(userId),
          postId: new ObjectId(postId),
          type: type || "like"
        },
      },
      {
        upsert: true,
        new: true,
      }
    );
    await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: new ObjectId(userId) } }
    );
    return;
  }

  async unLike(userId: string, postId: string) {
    await Like.findOneAndDelete({
      userId: new ObjectId(userId),
      postId: new ObjectId(postId),
    });

    await Post.findByIdAndUpdate(
      postId,
      {$pull: {likes: new ObjectId(userId)}}
    )
  }

  async seeAllLikesOfPost(postId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const likes = await Like.find({postId: new ObjectId(postId)})
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name avatar ')

    return likes.map(like => like.userId)
  }

  async getCountLikesOfPost(postId: string) {
    return await Like.countDocuments({postId: new ObjectId(postId)})
  }

  async getReactionOfPost(postId: string) {
    const reactions = await Like.aggregate([
      {$match: {postId: new ObjectId(postId)}},
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind : "$user"},
      {
        $group: {
          _id: "$type",
          users: {
            $push: {
              _id: "$user._id",
              name: "$user.name",
              avatar: "$user.avatar"
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);
    return reactions.map(r => ({
      reactionType: r._id,
      count: r.count,
      users: r.users
    }))
  } 

  async checkIsLiked(userId: string, postId: string) {
    const liked = await Like.findOne({
      userId: new ObjectId(userId),
      postId: new ObjectId(postId),
    }, {type: 1})
    return {
      isLiked: !!liked,
      reactionType: liked?.type || null
    }
  }
}
export const likeService = new LikeService();
