import { Hashtag } from "../hashtag/hashtag.model";
import { IPost, LinkMeta, Post } from "./post.model";
import { PostRequestBody } from "./post.request";
import { getFollowing, getFriendsList } from "../friend/friend.service";
import { getLinkPreview } from "link-preview-js";
import { ObjectId, Types } from "mongoose";
import { Like } from "../like/like.model";
import { Comment } from "../comment/comment.model";
import { Notification } from "../notification/notification.model";
import { calculateWeight, weightRandom } from "~/utils/feed";


class PostService {
  private urlRegex = /(https?:\/\/[^\s]+)/g;
  async checkAndCreateHashtag(hashtags: string[]): Promise<ObjectId[]> {
    const hashtagDocuments = await Promise.all(
      hashtags.map((hashtag) => {
        return Hashtag.findOneAndUpdate(
          {
            name: hashtag,
          },
          { $setOnInsert: { name: hashtag } },
          {
            upsert: true,
            returnDocument: "after",
          }
        );
      })
    );
    return hashtagDocuments.map((hashtagDocument) => hashtagDocument._id as ObjectId);
  }
  private async extractLinkMetadata(caption: string) {
  const match = caption.match(this.urlRegex);
  if (!match) return [];

  const results = await Promise.all(
    match.map(async (url) => {
      try {
        if (url.includes("youtube.com/watch?v=") || url.includes("youtu.be/")) {
          let videoId = "";
          const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
          const videoMatch = url.match(youtubeRegex);
          if (videoMatch && videoMatch[1]) {
            videoId = videoMatch[1];
          }
          return {
            url,
            type: "youtube" as const,
            videoId,
            embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`
          };
        }
        const meta = await getLinkPreview(url);
        return {
          url,
          type: "link" as const,
          title: "title" in meta ? meta.title : "",
          description: "description" in meta ? meta.description : "",
          image: "images" in meta && Array.isArray(meta.images)
            ? meta.images[0]
            : "favicons" in meta && Array.isArray(meta.favicons)
            ? meta.favicons[0]
            : "",
        };
      } catch (err) {
        console.error("Lỗi khi fetch metadata:", err);
        return null;
      }
    })
  );

  return results.filter((r): r is NonNullable<typeof r> => r !== null);
}

  async createPost(userId: string, body: PostRequestBody) {
    const mentionObjectIds = body.mentions.map((id) => new Types.ObjectId(id));
    const hashtags = await this.checkAndCreateHashtag(body.hashtags);
    const extractedLinks = body.links?.length ? body.links : await this.extractLinkMetadata(body.caption)
    const postedOnId = body.postedOn ? new Types.ObjectId(body.postedOn) : new Types.ObjectId(userId)
    if(postedOnId.toString() !==userId) {
      const friends_user_ids = await getFriendsList(userId);
      const friendIds = (friends_user_ids.data || [])
        .map((friend) => friend?._id.toString())
        .filter(Boolean);

      if(!friendIds.includes(postedOnId.toString())) {
        throw new Error("Bạn không được phép đăng");
      }
    }
    
    const post = await Post.create({
      caption: body.caption,
      images: body.images,
      videos: body.videos,
      links: extractedLinks,
      hashtags: hashtags,
      mentions: mentionObjectIds,
      likes: body.likes,
      author: new Types.ObjectId(userId),
      postedOn: postedOnId,
      privacy: body.privacy
    });

    const populatedPost = (await post.populate('author', 'name avatar')).populate('postedOn', 'name avatar')
    return populatedPost;
  }

  async updatePost(userId: string, postId: string, body: PostRequestBody) {
    const post = await Post.findById(postId);
    if(!post) throw new Error("Post not found");
    if(post.author.toString() !== userId) throw new Error("Not authorized to update this post");

    let mentionObjectIds: Types.ObjectId[] = []
    if (body.hashtags.length > 0) {
      mentionObjectIds = body.mentions.map((id) => new Types.ObjectId(id))
    }
    const hashtags = await this.checkAndCreateHashtag(body.hashtags)
    let extractedLinks: LinkMeta[] = post.links || [];
    if (body.caption && body.caption !== post.caption) {
      const newLinks = await this.extractLinkMetadata(body.caption);
      if (newLinks.length > 0) {
        extractedLinks = newLinks;
      }
    } 

    if (body.caption !== undefined) post.caption = body.caption;
    if (body.images !== undefined) post.images = body.images;
    if (body.videos !== undefined) post.videos = body.videos;
    if (hashtags !== undefined) post.hashtags = hashtags;
    if (mentionObjectIds.length) post.mentions = mentionObjectIds;
    if (extractedLinks !== undefined) post.links = extractedLinks;
    if (body.privacy !== undefined) post.privacy = body.privacy;

    await post.save();
    return await post.populate("author", "name avatar")
  }

  async deletePost(userId: string, postId: string) {
    const post = await Post.findById(postId);
    if(!post) {
      throw new Error("Post not found");
    }
    if(post.author.toString() !== userId) {
      throw new Error("Not authorized to delete this post");
    }
    await Comment.deleteMany({postId});
    await Like.deleteMany({postId});
    await Notification.deleteMany({post: postId})

    await Post.findByIdAndDelete(postId);
  }


  async getNewFeeds({userId, limit, page}: {userId: string; limit: number; page: number;}) {
    const following_user_ids = await getFollowing(userId);
    const followingIds = following_user_ids.data.map(
      (item) => item.recipient._id
    );
    const friends_user_ids = await getFriendsList(userId);
    const friendIds = (friends_user_ids.data || [])
      .map((friend) => friend?._id?.toString())
      .filter(Boolean);

    const ids = [
      ...new Set([...followingIds, ...friendIds, userId.toString()]),
    ].map((id) => new Types.ObjectId(id));

    const posts = await Post.aggregate<IPost>([
      {
        $match: {
          author: { $in: ids },
          $or: [
            {privacy: "public"},
            { $and: [{privacy: "private"}, {author: new Types.ObjectId(userId)}] },
            { $and: [{privacy: "friends"}, {author: { $in: friendIds.map(id => new Types.ObjectId(id))}}]}
          ]
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $lookup: {
          from: "users",
          localField: "postedOn",
          foreignField: "_id",
          as: "postedOn"
        }
      },
      { $unwind: { path: "$postedOn", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "hashtags",
          localField: "hashtags",
          foreignField: "_id",
          as: "hashtags",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "mentions",
          foreignField: "_id",
          as: "mentions",
        },
      },
      {
        $addFields: {
          mentions: {
            $map: {
              input: "$mentions",
              as: "mention",
              in: {
                _id: "$$mention._id",
                username: "$$mention.username",
                email: "$$mention.email",
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post_id",
          as: "comments",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "likes",
          foreignField: "_id",
          as: "likes",
        },
      },
      {
        $addFields: {
          likes: { $size: "$likes" },
          comments: { $size: "$comments" },
        },
      },
      {
      $lookup: {
        from: "posts",
        localField: "originalPost",
        foreignField: "_id",
        as: "originalPost",
      },
    },
    { $unwind: { path: "$originalPost", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "originalPost.author",
        foreignField: "_id",
        as: "originalPost.author",
      },
    },
    { $unwind: { path: "$originalPost.author", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          author: {
            password: 0,
            email: 0,
            role: 0,
          },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: limit * (page - 1) },
      { $limit: limit },
    ]);

    const total = await Post.countDocuments({
      author: { $in: ids },
      $or: [
        { privacy: "public" },
        { $and: [{ privacy: "private" }, { author: new Types.ObjectId(userId) }]},
        {
          $and: [
            { privacy: "friends" },
            { author: { $in: friendIds.map(id => new Types.ObjectId(id))}}
          ]
        }
      ]
    });

    return { posts, total };
  }

  async getAllPostOfUser({userId, limit, page, currentUserId}: {userId: string, page: number, limit: number; currentUserId: string}) {
    const ids = [new Types.ObjectId(userId)];
    const friends_user_ids = await getFriendsList(userId);
    const friendIds = (friends_user_ids.data || [])
      .map((friend) => friend?._id?.toString())
      .filter(Boolean);
    const isFriend = friendIds.includes(currentUserId)
    const posts = await Post.aggregate<IPost>([
      {
        $match: {
          $and: [
            {
              $or: [
                // {author: new Types.ObjectId(userId)},
                {postedOn: new Types.ObjectId(userId)}
              ]
            }
          ],
           $or: [
          { privacy: "public" },
          { $and: [{ privacy: "private" }, { author: new Types.ObjectId(currentUserId) }] },
          isFriend
            ? { $and: [{ privacy: "friends" }, { author: new Types.ObjectId(userId) }] }
            : { _id: null },
        ],
          
        }
      },      
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author"
        }
      },
      { $unwind: "$author"},
      {
        $lookup: {
          from: "users",
          localField: "postedOn",
          foreignField: "_id",
          as: "postedOn"
        }
      },
      { $unwind: { path: "$postedOn", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "hashtags",
          localField: "hashtags",
          foreignField: "_id",
          as: "hashtags"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "mentions",
          foreignField: "_id",
          as: "mentions",
        }
      },
      {
        $addFields: {
          mentions: {
            $map: {
              input: "$mentions",
              as: "mention",
              in: {
                _id: "$$mention._id",
                username: "$$mention.username",
                email: "$$mention.email"
              }
            }
          }
        }
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post_id",
          as: "comments",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "likes",
          foreignField: "_id",
          as: "likes",
        },
      },
      {
        $addFields: {
          likes: { $size: "$likes" },
          comments: { $size: "$comments" },
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "originalPost",
          foreignField: "_id",
          as: "originalPost",
        },
      },
      { $unwind: { path: "$originalPost", preserveNullAndEmptyArrays: true} },
      {
        $lookup: {
          from: "users",
          localField: "originalPost.author",
          foreignField: "_id",
          as: "originalPost.author",
        },
      },
      { $unwind: { path: "$originalPost.author", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          author: {
            email: 0,
            password: 0,
            role: 0,
            verified: 0,
          },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: limit * (page - 1) },
      { $limit: limit },
    ])
    const total = await Post.countDocuments({
      author: { $in: ids},
    });

    return { posts, total };
}

  async getPostByPostId(postId: string) {
    const post = await Post.findById(postId)
      .populate("author", "name avatar")
      .populate({
        path: "originalPost",
        populate: { path: "author", select: "name avatar" }
      })
      .lean();
    if (!post) {
      throw new Error("Post not found");
    }
    return post;
  }

async getRandomFeeds({
  userId,
  page,
  limit
}: {
  userId: string;
  page: number;
  limit: number;
}) {
  if (!Types.ObjectId.isValid(userId)) throw new Error("Invalid user id");

  const following_user_ids = await getFollowing(userId);
  const followingIds = following_user_ids.data.map(
    (item: any) => item.recipient._id
  );

  const friends_user_ids = await getFriendsList(userId);
  const friendIds = (friends_user_ids.data || [])
    .map((friend: any) => friend?._id?.toString())
    .filter(Boolean);

  const ids = [
    ...new Set([...followingIds, ...friendIds, userId.toString()])
  ].map((id) => new Types.ObjectId(id));

  const rawPosts = await Post.aggregate<IPost>([
    {
      $match: {
        author: { $in: ids },
        $or: [
          { privacy: "public" },
          { $and: [{ privacy: "private" }, { author: new Types.ObjectId(userId) }] },
          {
            $and: [
              { privacy: "friends" },
              { author: { $in: friendIds.map((id) => new Types.ObjectId(id)) } }
            ]
          }
        ]
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author"
      }
    },
    { $unwind: "$author" },
    {
      $lookup: {
        from: "users",
        localField: "postedOn",
        foreignField: "_id",
        as: "postedOn"
      }
    },
    { $unwind: { path: "$postedOn", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "hashtags",
        localField: "hashtags",
        foreignField: "_id",
        as: "hashtags"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "mentions",
        foreignField: "_id",
        as: "mentions"
      }
    },
    {
      $addFields: {
        mentions: {
          $map: {
            input: "$mentions",
            as: "mention",
            in: {
              _id: "$$mention._id",
              username: "$$mention.username",
              email: "$$mention.email"
            }
          }
        }
      }
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post_id",
        as: "comments"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "likes",
        foreignField: "_id",
        as: "likes"
      }
    },
    {
      $addFields: {
        likes: { $size: "$likes" },
        comments: { $size: "$comments" }
      }
    },
    {
      $lookup: {
        from: "posts",
        localField: "originalPost",
        foreignField: "_id",
        as: "originalPost"
      }
    },
    { $unwind: { path: "$originalPost", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "originalPost.author",
        foreignField: "_id",
        as: "originalPost.author"
      }
    },
    { $unwind: { path: "$originalPost.author", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        author: {
          password: 0,
          email: 0,
          role: 0
        }
      }
    }
  ]);

  const total = rawPosts.length;
  if (!total) {
    return { posts: [], total, page, limit };
  }

  const maxValues = {
    engagement: Math.max(
      ...rawPosts.map((p: any) => (p.likes || 0) + (p.comments || 0)),
      1
    )
  };

  const postsWithWeight = rawPosts.map((post: any) => ({
    ...post,
    weight: calculateWeight(post, maxValues, userId)
  }));

  const randomized = weightRandom(postsWithWeight, total);

  const start = (page - 1) * limit;
  const end = start + limit;
  const pagedPosts = randomized.slice(start, end);

  return {
    posts: pagedPosts,
    total
  };
}



}
export const postService = new PostService()
