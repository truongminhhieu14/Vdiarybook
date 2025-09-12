import jwt from 'jsonwebtoken';
import bcrypt from "node_modules/bcryptjs";
import UserModel, { IUser } from "./auth.model";
import { createRefreshToken } from '../refreshToken/refreshToken.service';
import { RefreshToken } from '../refreshToken/refreshToken.model';
import { FriendModel } from '../friend/friend.model';

export const registerUser = async (userData: Partial<IUser>) => {
  const existing = await UserModel.findOne({ email: userData.email });
  if (existing) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(userData.password!, 10);

  const newUser = new UserModel({
    ...userData,
    password: hashedPassword,
  });

  const savedUser = await newUser.save();
  const userObj = savedUser.toObject();
  delete userObj.password;

  return userObj;
};

export const login = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Wrong password');

  const accessToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET || 'secret_key',
    { expiresIn: '1d' }
  );
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  ); 

  await createRefreshToken(user._id, refreshToken)

  return { user, accessToken, refreshToken };
};

export const logOut = async (refreshToken: string) => {
  await RefreshToken.findOneAndDelete({
    token: refreshToken
  })
}

export const refreshTokenService = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }

  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_SECRET!
  ) as { userId: string };

  const user = await UserModel.findById(decoded.userId);
  if (!user) {
    throw new Error("User not found");
  }

  const newAccessToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  const newRefreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );
  await createRefreshToken(user._id, newRefreshToken);
  
  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}; 

export const getAllUser = async(page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const users = await UserModel.find({}, { password: 0})
    .skip(skip)
    .limit(limit)
    .lean()

  const total = await UserModel.countDocuments();

  return { users, total, page, limit, hasMore: skip + users.length < total}
}
export const getProfile = async(userId: string) => {
  const user = await UserModel.findById(userId, {
    password: 0
  })
  return user;
}

export const  updateProfile = async(userId: string, payload: any) => {
  const user = await UserModel.findByIdAndUpdate(
    userId, 
    {
      ...payload
    },
    {
      new: true, 
      projection: {
        name: 1,
        email: 1,
        avatar: 1,
        background: 1,
      }
    }
  )
  return user;
}

export const isFriend = async (userId1: string, userId2: string) => {
  const friend = await FriendModel.findOne({
    $or: [
      { requester: userId1, recipient: userId2 },
      { requester: userId2, recipient: userId1 }
    ],
    type: "friend_request",
    status: "accepted"
  });
  return !!friend;
};

export const isRequested = async (userId1: string, userId2: string) => {
  const request = await FriendModel.findOne({
    requester: userId2,
    recipient: userId1,
    type: "friend_request",
    status: "pending"
  });
  return !!request;
};

export const isFollowing = async (userId1: string, userId2: string) => {
  const follow = await FriendModel.findOne({
    requester: userId1,
    recipient: userId2,
    type: "follow",
    status: "following"
  });
  return !!follow;
};

export const checkEmail = async(email: string): Promise<boolean> => {
  const user = await UserModel.findOne({ email })
  return !! user;
}