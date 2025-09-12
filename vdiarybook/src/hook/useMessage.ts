import { createConversation, fetchConversations, fetchMessages, sendMessage } from "@/services/chat.service"
import { Conversation, GetMessagesResponse, Message } from "@/types/chat.type"
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useConversations = () => {
    return useQuery<Conversation[]>({
        queryKey: ["conversations"],
        queryFn: () => fetchConversations(1, 10)
    })
}

export const useMessages = (conversationId: string) => {
  return useInfiniteQuery<GetMessagesResponse, Error>({
    queryKey: ['messages', conversationId],
    queryFn: ({ pageParam = 1 }) => fetchMessages({ conversationId, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Assuming fetchMessages returns an object like { messages: Message[], hasNextPage: boolean }
      // If not, adjust this logic based on your actual API response
      // For now, let's assume the API returns an array and we fetch until the array is empty
      return lastPage.hasNextPage ? allPages.length + 1 : undefined;
    }
  })
}
 
export const useSendMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (newMessage, variables) => {
      queryClient.setQueryData<Message[]>(['messages', variables.conversation], (oldMessages = []) => [
        ...oldMessages,
        newMessage
      ])
    }
  })
}

export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (receiverId: string) => createConversation(receiverId),
    onSuccess: (newConversation: Conversation) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"]})
      return newConversation
    }
  })
}