import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  _id: string;
  name: string;
  avatar: string;
  background: string;
  country: string;
  verified: boolean;
  badge: boolean;   
};

type AuthState = {
  user: User | null;
};

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;