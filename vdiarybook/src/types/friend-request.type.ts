export type IUser = {
  _id: string;
  name: string;
  avatar: string;
  background?: string;
  verified?: boolean;
}

export type IFriendRequest = {
  _id: string;
  requester: IUser;
}

export type IFriendSentRequest = {
  _id: string;
  recipient: IUser;
};

export type IPagination = {
  page: number;
  limit: number;
  count: number;
  totalPages: number;
  hasMore: boolean;
}
export type IFriendRequestSuccess = {
    requests: IFriendRequest[];
    pagination: IPagination;
}

export type IFriendSentRequestSuccess = {
  sentRequests: IFriendSentRequest[];
  pagination: IPagination
  
}