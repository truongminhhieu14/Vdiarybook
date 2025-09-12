import { AuthRequest } from "~/middleware/auth.middleware";
import { conversationService } from "./conversation.service";
import { Response } from "express";



export const getConversationController = async(req: AuthRequest, res: Response ) => {
    const userId = req.userId as string;
    const page = parseInt(req.query.page as string);
    const { conversationId } = req.params as {conversationId: string};
    const conversation = await conversationService.getConversation({userId, conversationId, page})
    res.status(200).json({
        result: conversation
    })
}

export const getAllConversationController = async(req: AuthRequest, res: Response) => {
    const userId = req.userId as string;
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const conversations = await conversationService.getAllConversation(userId, page, limit);
    res.status(200).json({
        message: "Get conversations successfully",
        result: conversations
    })
}

export const createConversationController = async(req: AuthRequest, res: Response) => {
    const userId = req.userId as string;
    const { receiverId } = req.body as {receiverId: string}
    const conversation = await conversationService.createConversation(userId, receiverId);
    res.status(200).json({
        message: "Create conversation successfully",
        result: conversation
    })
}

export const deleteConversationController = async(req: AuthRequest, res: Response) => {
    const userId = req.userId as string;
    const { conversationId } = req.body as {conversationId: string};
    const conversation = await conversationService.deleteConversation(userId, conversationId);
    res.status(200).json({
        message: "Delete conversation successfully",
        result: conversation
    })
}

export const createMessageController = async(req: AuthRequest, res: Response) => {
    const user_id = req.userId as string;
    const {conversation_id, receiver_id, content} = req.body as {conversation_id: string, receiver_id: string, content: string};
    const message = await conversationService.createMessage(user_id, conversation_id, receiver_id, content);
    res.status(200).json({
        message: "Create message successfully",
        result: message
    })
}