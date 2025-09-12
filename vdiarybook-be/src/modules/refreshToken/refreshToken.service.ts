import { Types } from "mongoose";
import { RefreshToken } from "./refreshToken.model";

export const createRefreshToken = async (userId: Types.ObjectId, token: string) => {
  return await RefreshToken.create({ userId, token });
};

export const findRefreshToken = async (token: string) => {
  return await RefreshToken.findOne({ token }).populate("userId");
};

export const deleteRefreshToken = async (token: string) => {
  return await RefreshToken.findOneAndDelete({ token });
};

export const deleteAllUserTokens = async (userId: string) => {
  return await RefreshToken.deleteMany({ userId });
};
