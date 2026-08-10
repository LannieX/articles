"use server";

import { SignInType, SignUpType } from "../app/types/authType";
import { ApiServices } from "./api.service";

export const SignUp = async (body: SignUpType) => {
  return ApiServices("POST", "/auth/signUp", body);
};

export const SignIn = async (body: SignInType) => {
  return ApiServices("POST", "/auth/signIn", body);
};

export const SignOut = async () => {
  return ApiServices("POST", "/auth/signOut");
};

export const GetMe = async () => {
  return ApiServices("GET", "/auth/me");
};