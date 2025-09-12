import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPost } from "@/types/post.type";

interface PostState {
  posts: IPost[];
}

const initialState: PostState = {
  posts: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<IPost[]>) => {
      state.posts = action.payload;
    },
    addPost: (state, action: PayloadAction<IPost>) => {
      state.posts.unshift(action.payload);
    },
    appendPosts: (state, action: PayloadAction<IPost[]>) => {
      state.posts = [...state.posts, ...action.payload];
    },
    updatePost: (state, action: PayloadAction<IPost>) => {
      state.posts = state.posts.map((p) =>
        p._id === action.payload._id ? action.payload : p
      );
    },
  }  
});

export const { setPosts, addPost, appendPosts, updatePost } = postSlice.actions;
export default postSlice.reducer;
