import { SuccessResponse } from '@/types/response';
import { Conversation, GetMessagesResponse, Message } from '../types/chat.type';
import http from "./api.service";

const API_URL = '/chat';

export const fetchConversations = async (
  page?: number,
  limit?: number
): Promise<Conversation[]> => {
  const { data } = await http.get<SuccessResponse<Conversation[]>>(`${API_URL}/`, {
    params: {
      page: page || 1,
      limit,
    },
  });
  return data.result;
};

export const fetchMessages = async ({
  conversationId,
  page,
}: {
  conversationId: string;
  page?: number;
}): Promise<GetMessagesResponse> => {
  const { data } = await http.get<SuccessResponse<GetMessagesResponse>>(
    `${API_URL}/${conversationId}/message`,
    {
      params: {
        page: page || 1,
      },
    }
  );
  return data.result;
};

export const sendMessage = async (message: {
  content: string;
  senderId: string;
  receiverId: string;
  conversation: string;
}): Promise<Message> => {
  const { data } = await http.post<Message>(`${API_URL}/message`, message);
  return data;
};

export const createConversation = async (receiverId: string): Promise<Conversation> => {
  const { data } = await http.post<SuccessResponse<Conversation>>(`${API_URL}/create`, {
    receiverId
  })
  return data.result
}
