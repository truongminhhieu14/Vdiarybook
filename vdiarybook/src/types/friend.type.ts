import { IProfile } from "./auth.type";

export type IFriend = {
  _id: string;
  name: string;
  avatar: string;
  background: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type IFriendSuccess = {
  friends: IFriend[];
  pagination: {
    page: number;
    limit: number;
    count: number;
    hasMore: boolean;
  };
  count: number;
};
export interface IFollowing {
  _id: string;
  requester: string;
  recipient: IProfile;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type IFollowingSuccess = {
  following: IFollowing[];
  pagination: {
    page: number;
    limit: number;
    count: number;
    totalPage: number;
    hasMore: boolean;
  };
};
