export interface PostRequestBody {
  caption: string
  images: string[]
  videos: string[]
  links: string[]
  hashtags: string[]
  mentions: string[]
  likes: string[]  
  privacy: "public" | "friends" | "private"
  postedOn: string   
}

export interface PostParam {
  postId: string; 
}

export interface Pagination {
  limit: string;   
  page: string;   
}
