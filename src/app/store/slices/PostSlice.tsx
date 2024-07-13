import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { BlogForm, BlogPost } from "@/app/types/blogTypes";

interface InitialState {
  allPosts: BlogPost[];
  postForm: BlogForm;
  currentPost : BlogPost;
}

const initialState: InitialState = {
  allPosts: [],
  postForm: {
    title: "",
    content: "",
    coverImgUrl: "",
    coverImageName: "",
  },
  currentPost : {
    content: "",
    coverImgUrl: "",
    id : "",
    title: "",
    createdAt: "",
    user : {
      email: "",
      profileUrl: "",
    }
  },
};

const PostSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPostTitle: (state: InitialState, {payload}: PayloadAction<string>) => {
      state.postForm.title = payload;
    },
    setPostContent: (state: InitialState, {payload}: PayloadAction<string>) => {
      state.postForm.content = payload;
    },
    setPostCoverImg: (state: InitialState, {payload}: PayloadAction<string>) => {
      state.postForm.coverImgUrl = payload;
    },
    setPostCoverImgName: (state: InitialState, {payload}: PayloadAction<string>) => {
      state.postForm.coverImageName = payload;
    },
    setCurrentPost: (state: InitialState, {payload}: PayloadAction<BlogPost>) => {
      state.currentPost = payload;
    },
    clearPostForm(state) {
      state.postForm.title = "";
      state.postForm.content = "";
      state.postForm.coverImgUrl = "";
      state.postForm.coverImageName = "";
    },
    setAllPost: (state: InitialState, payload: PayloadAction<BlogPost[]>) => {
      state.allPosts = payload.payload;
    },
  },
});
export const {
  clearPostForm,
  setAllPost,
  setPostContent,
  setPostCoverImg,
  setPostTitle,
  setPostCoverImgName,
  setCurrentPost
} = PostSlice.actions;


const PostReducer = PostSlice.reducer;
export default PostReducer;
