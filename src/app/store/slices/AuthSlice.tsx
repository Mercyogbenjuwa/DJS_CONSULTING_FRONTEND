import { AuthPayload } from "@/app/types/blogTypes";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";


const initialState: AuthPayload = {
  email: Cookies.get("blog_admin_email") || "",
  accessToken: Cookies.get("blog_admin_access_token") || "",
 
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    setUserEmail: (state, { payload }: PayloadAction<string>) => {
      state.email = payload;
      Cookies.set("blog_admin_email", payload);
    },
    setUserAccessToken: (state, { payload }: PayloadAction<string>) => {
      state.accessToken = payload;
      Cookies.set("blog_admin_access_token", payload);
    },
  
   
    clearAuth: (state) => {
      state.email = "";
      state.accessToken = "";
      Cookies.remove("blog_admin_email");
      Cookies.remove("blog_admin_access_token");
        
    },
    removeEmail: (state) => {
      state.email = "";
      Cookies.remove("blog_admin_email");
    },
  },
});

export const {
  setUserEmail,
  setUserAccessToken,
  clearAuth,
  removeEmail,
} = AuthSlice.actions;

const AuthReducer = AuthSlice.reducer;
export default AuthReducer;

export const selectIsLoggedIn = (): boolean => {
  const token = Cookies.get("blog_admin_access_token");
  return token !== undefined && token !== null && token.trim() !== "";
};
