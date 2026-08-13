import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice.redux";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
export default store;
