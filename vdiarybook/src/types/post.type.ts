export interface LinkMeta {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  type?: "youtube" | "link";
  videoId?: string;
  embedUrl: string;
}
export interface IUser {
  _id: string;
  name: string;
  avatar?: string;
}

export interface IPost {
  _id: string;
  caption: string;
  images: string[];
  videos: string[];
  links: LinkMeta[];
  author: IUser
  hashtags: string[];
  mentions: string[];
  likes: string[];
  privacy: "public" | "friends";
  postedOn: string;
  createdAt: string
}
export interface LinkMetaResponse {
  data: LinkMeta[];
}

export interface INewFeeds {
  userId: string,
  posts: IPost[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
