import {

  configureStore,
 
} from "@reduxjs/toolkit";

import AuthReducer from "./slices/AuthSlice";
import PostReducer from "./slices/PostSlice";

const store = configureStore({
  reducer: {
    Post: PostReducer,
    Auth : AuthReducer
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
