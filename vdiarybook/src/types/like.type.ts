export interface LikeUser {
  _id: string;
  name: string;
  avatar: string;
}

export interface GetAllLikesResponse {
  message: string;
  success: boolean;
  data: LikeUser[];
  pagination: {
    page: number;
    limit: number;
    count: number;
    hasMore: number;
  };
}

export interface ReactionData {
  reactionType: string;
  count: number;
  users: LikeUser[]
}

export interface GetReactionOfPostResponse {
  success: boolean;
  data: ReactionData[];
}
export type ReactionType = "like" | "love" | "haha" | "wow" | "sad" | "angry";

export type checkIsLikedResponse = {
  isLiked: boolean;
  reactionType: ReactionType | null;
}
