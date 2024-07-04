import { type Request } from "express";
import { type JwtPayload } from "jsonwebtoken";
import type mongoose from "mongoose";

export type UserRequestBody = {
  fullname: string;
  email: string;
  profession: string;
  city: string;
  contact: string;
  password: string;
  isAdmin?: boolean;
};

export type ArticleRequestBody = {
  title: string;
  type: string;
  content: string;
};

export type PayloadRequestUser = {
  userId: mongoose.Types.ObjectId;
  fullname: string;
  isAdmin: boolean;
};

export type IgetUserAuthInfoRequest = {
  user?: JwtPayload; // or any other type
} & Request;
