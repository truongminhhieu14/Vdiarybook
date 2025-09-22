import { Types } from "mongoose";
import { ObjectId } from 'mongodb'
import { Message } from "../message/message.model";
import { Conversation } from "./conversation.model";

class ConversationService {
  async getConversation({userId, conversationId, page}: {userId: string; conversationId: string; page: number;}) {
    const messages = await Message.find({
      conversation: new ObjectId(conversationId),
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .select("-__v")
      .lean();
    const totalMessages = await Message.countDocuments();
    const hasNextPage = page * 10 < totalMessages;
    return { messages, hasNextPage };
  }

  async getAllConversation(userId: string, page: number, limit: number) {
    const conversations = await Conversation.aggregate([
        {
            $match: {
                participants: new Types.ObjectId(userId) // Chỉ lấy conversation có bạn tham gia
            }
        },
        {
            $lookup: {
                from: "users", // Collection users
                localField: "participants",
                foreignField: "_id",
                as: "participants_info"
            }
        },
        {
            $lookup: {
                from: "messages", // Join sang messages để lấy last_message
                localField: "last_message",
                foreignField: "_id",
                as: "last_message"
            }
        },
        {
            $unwind: {
                path: "$last_message",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                // Lọc ra những người tham gia không phải bạn
                other_participants: {
                    $filter: {
                        input: "$participants_info",
                        as: "participant",
                        cond: {
                            $ne: ["$$participant._id", new Types.ObjectId(userId)]
                        }
                    }
                }
            }
        },
        {
            $project: {
                _id: 1,
                is_group: 1,
                last_message: 1,
                updated_at: 1,
                other_participants: 1,// Chỉ giữ lại thông tin người khác
            }
        },
        {
            $skip: limit * (page - 1)
        },
        {
            $limit: limit
        }
    ])
    return conversations;
  }

  async createConversation(userId: string, receiverId: string) {
    // Kiểm tra xem cuộc trò chuyện đã tồn tại chưa
    const existingConversation = await Conversation.findOne({
        participants: {$all: [new Types.ObjectId(userId), new Types.ObjectId(receiverId)]}
    })
    if(existingConversation) {
        return existingConversation;
    }
    // Tạo cuộc trò chuyện mới nếu chưa tồn tại
    const newConversation = new Conversation({
        participants: [new Types.ObjectId(userId), new Types.ObjectId(receiverId)]
    });
    await newConversation.save();
    return newConversation;
  }

  async deleteConversation(userId: string, conversationId: string) {
    const deletedConversation = await Conversation.findOneAndDelete({
        _id: new Types.ObjectId(conversationId),
        participants: new Types.ObjectId(userId)
    })
    return deletedConversation;
  }

  async createMessage(user_id: string, conversation_id: string, receiver_id: string, content: string) {

    // Cập nhật cuộc trò chuyện và tin nhắn mới
    const newMessage = await Message.create({
        senderId: new Types.ObjectId(user_id),
        receiverId: new Types.ObjectId(receiver_id),
        content,
        conversation: new Types.ObjectId(conversation_id)
    })
    return newMessage;
  }
}

export const conversationService = new ConversationService();
