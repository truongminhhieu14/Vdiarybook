import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
  unreadCount: number;
}

const initialState: NotificationState = {
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setUnreadCount(state, action: PayloadAction<number>) {
      state.unreadCount = action.payload;
    },
    increaseUnread(state) {
      state.unreadCount += 1;
    },
    decreaseUnread(state) {
      if (state.unreadCount > 0) {
        state.unreadCount -= 1;
      }
    },
    clearUnread(state) {
      state.unreadCount = 0;
    },
  },
});

export const {
  setUnreadCount,
  increaseUnread,
  decreaseUnread,
  clearUnread,
} = notificationSlice.actions;

export default notificationSlice.reducer;
