import { StaticImageData } from "next/image";

export type User = {
  email: string;
  profileUrl: string | StaticImageData;
};

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  coverImgUrl: string | StaticImageData;
  createdAt?: string;
  user?: User;
};
export type BlogForm = {
  title: string;
  content: string;
  coverImgUrl: string | StaticImageData;
  coverImageName: string;
};
export type BlogPostUpdate = {
  title: string;
  content: string;
  coverImgUrl: string | StaticImageData;
};

export type AuthPayload = {
  email: string;
  accessToken: string;
};

export type UserAuth = {
  email: string;
  password: string;
  profileUrl: string | StaticImageData;
};

export type LoginAuth = {
  email: string;
  password: string;
};
