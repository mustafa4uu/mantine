import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer from "./SideBarSlice";

export const store = configureStore({
  reducer: {
    sideBarData: sidebarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;