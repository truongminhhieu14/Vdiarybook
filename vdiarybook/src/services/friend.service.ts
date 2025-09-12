import { IFriendRequestSuccess, IFriendSentRequestSuccess, IPagination } from "@/types/friend-request.type";
import http from "./api.service"
import { IFollowingSuccess, IFriend, IFriendSuccess } from "@/types/friend.type";
import { AxiosResponse } from "axios";

export const getMutualFriends = async (
  targetIds: string[]
): Promise<AxiosResponse<{ data: { count: number; mutualFriends: IFriend[] } }>> => {
  return await http.post(
    "/friends/mutual-friends-batch",
    { targetIds },
  );
};

const friendApi = {
    getAllFriend: async (page = 1, limit = 10): Promise<AxiosResponse<{data: IFriendSuccess}>> => {
        return await http.get("/friends", {
            params: {type: "friends", page, limit},
        })
    },
    getAllFriendById: async (userId: string, page = 1, limit = 10): Promise<AxiosResponse<{data: IFriendSuccess}>> => {
        return await http.get(`/friends/${userId}`, {
            params: {type: "friends", page, limit},
        })
    },
    unfriend: async (friendId: string): Promise<AxiosResponse<{data: IFriend}>> => {
        return await http.post("/friends/action", {action: "unfriend", friendId} ,{
        })
    },
    getSuggestions: async (page = 1, limit = 10): Promise<AxiosResponse<{data: IFriend[], pagination: { page: number; limit: number; count: number; hasMore: boolean }}>> => {
        return await http.get("/friends", {
            params: {type: "suggestions", page, limit},
        })
    },
    addFriend: async (recipientId: string): Promise<AxiosResponse<{data: IFriend}>> => {
        return await http.post("/friends/action", {action: "send", recipientId} ,{
        })
    },
    getFriendRequests: async (page = 1, limit = 10): Promise<AxiosResponse<{data: IFriendRequestSuccess, pagination: IPagination}>> => {
        return await http.get("/friends", {
            params: {type: "requests", page, limit},
        })
    },
    getFriendSentRequests: async (page = 1, limit = 10): Promise<AxiosResponse<{data: IFriendSentRequestSuccess, pagination: IPagination}>> => {
        return await http.get("/friends", {params: {type: "sentRequests", page, limit}})
    },
    acceptFriendRequest: async (recipientId: string): Promise<AxiosResponse<{data: IFriend}>> => {
        return await http.post("/friends/action", {action: "accept", recipientId} ,{
        })
    },
    rejectFriendRequest: async (requestId: string): Promise<AxiosResponse<{data: IFriend}>> => {
        return await http.post("/friends/action", {action: "reject", requestId}, {
        })
    },
    getFollowing: async (page = 1, limit = 10): Promise<AxiosResponse<{data: IFollowingSuccess}>> => {
        return await http.get("/friends", {
            params: {type: "following", page, limit},
        })
    },
    getAllFolowingById: async (userId: string, page = 1, limit = 10): Promise<AxiosResponse<{data: IFollowingSuccess}>> => {
        return await http.get(`/friends/${userId}`, {
            params: {type: "following", page, limit},
        })
    },
    follow: async (recipientId: string) => {
        return await http.post("/friends/action", {action: "follow", recipientId}, {
        })
    },
    unfollow: async (recipientId: string) => {
        return await http.post("/friends/action", {action: "unfollow", recipientId}, {
        })
    },
    getFollowers: async (): Promise<AxiosResponse<{data: IFollowingSuccess}>> => {
        return await http.get("/friends", {
            params: {type: "followers"},
        })
    },
    getAllFollowerById: async (userId: string, page = 1, limit = 8): Promise<AxiosResponse<{data: IFriendSuccess}>> => {
        return await http.get(`/friends/${userId}`, {
            params: {type: "followers", page, limit},
        })
    },
    searchFriends: async (keyword: string): Promise<AxiosResponse<{ data: IFriend[] }>> => {
        return await http.get("/friend/search", {
            params: { keyword },
        });
    },
}

export default friendApi;