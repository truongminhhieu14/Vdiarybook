import { ObjectId } from 'mongodb'
import { CommentRequestBody } from './comment.request';
import { Comment } from './comment.model';


class CommentService {
  async createComment(userId: string, postId: string, body: CommentRequestBody) {
    const comment = await Comment.create({
    text: body.text,
    mentions: body.mentions,
    likes: body.likes,
    author: new ObjectId(userId),
    postId: new ObjectId(postId),
    parentId: null
  });

  await comment.populate('author', '_id name avatar');

  return comment;
  }

  async createChildComment(userId: string, postId: string, parentId: string, body: CommentRequestBody) {
    const comment =  await Comment.create({
      text: body.text,
      mentions: body.mentions || [],
      likes: [],
      author: new ObjectId(userId),
      postId: new ObjectId(postId),
      parentId: new ObjectId(parentId)
    })

    await comment.populate('author', '_id name avatar')
    return comment;
  }

  async updateComment(userId: string, commentId: string, body: Partial<CommentRequestBody>) {
    const comment = await Comment.findById(commentId);
    if(!comment) throw new Error("Comment not found");
    if(comment.author.toString() !== userId) throw new Error("Unauthorized");

    comment.text = body.text ?? comment.text;
    comment.mentions = body.mentions ?? comment.mentions;

    await comment.save();
    await comment.populate("author", "_id name avatar");
    return comment;
  }

  async deleteComment(userId: string, commentId: string) {
    const comment = await Comment.findById(commentId);

    if(!comment) throw new Error('Comment not found');
    if(comment.author.toString() !== userId) throw new Error('Unauthorized');

    await Comment.findByIdAndDelete(commentId)
    return {success: true}
  }

  async getAllParrentCommentOfPost({ postId, limit, page }: { postId: string; limit: number; page: number }) {
    const comments = await Comment.aggregate([
      {
        $match: {
          postId: new ObjectId(postId),
          parentId: null
        }
      },
      {
        $lookup: { 
          from: 'users',
          localField: 'mentions',
          foreignField: '_id',
          as: 'mentions'
        }
      },
      {
        $addFields: {
          mentions: {
            $map: {
              input: '$mentions',
              as: 'mention',
              in: {
                _id: '$$mention._id',
                username: '$$mention.username',
                email: '$$mention.email'
              }
            }
          }
        }
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'parentId',
          as: 'replies'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'likes',
          foreignField: '_id',
          as: 'likes'
        }
      },
      {
        $addFields: {
          likes: {
            $size: '$likes'
          },
          replies: {
            $size: '$replies'
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author'
        }
      },
      {
        $unwind: '$author'
      },
      {
        $skip: limit * (page - 1)
      },
      {
        $limit: limit
      }
    ])
    return comments
  }

  async getAllChildCommentOfParentComment(parentId: string) {
    const replies = await Comment.aggregate([
      {
        $match: {
          parentId: new ObjectId(parentId)
        } 
      },
      {
        $lookup: {
          from: 'users',
          localField: 'mentions',
          foreignField: '_id',
          as: 'mentions'
        }
      },
      {
        $addFields: {
          mentions: {
            $map: {
              input: '$mentions',
              as: 'mention',
              in: {
                _id: '$$mention._id',
                username: '$$mention.username',
                email: '$$mention.email'
              }
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author'
        }
      },
      {
        $unwind: '$author'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'likes',
          foreignField: '_id',
          as: 'likes'
        }
      },
      {
        $addFields: {
          likes: { $size: '$likes' }
        }
      },
      {
        $sort: { createdAt: 1 } 
      }
    ])
    return replies;
  }

  async getCountAllCommentOfPost(postId: string) {
    return await Comment.countDocuments({postId: new ObjectId(postId)})
  }
}
export const commentService = new CommentService()