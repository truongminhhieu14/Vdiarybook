import { Request, Response } from "express";
import { login, logOut, refreshTokenService, registerUser, updateProfile } from "./auth.service";
import { AuthRequest } from "~/middleware/auth.middleware";
import * as userService from "./auth.service"
import { USER_MESSAGES } from "~/constants/message";
import { httpStatus } from "~/constants/httpStatus";


export const registerController = async (req: Request, res: Response) => {
    const user = await registerUser(req.body);
    res.status(httpStatus.CREATED).json({
      success: true,
      message: USER_MESSAGES.REGISTER_SUCCESS,
      data: user,
    });
};

export const loginController = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await login(email, password);

    res.status(httpStatus.OK).json({
      success: true,
      message: USER_MESSAGES.LOGIN_SUCCESS,
      metadata: {
        user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, background: user.background },
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    });
};

export const logOutController  = async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;
    await logOut(refreshToken);
    res.status(httpStatus.OK).json({ success: true, message: USER_MESSAGES.LOGOUT_SUCCESS });
}

export const refreshTokenController = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const tokenPair = await refreshTokenService(refreshToken);
    res.status(httpStatus.OK).json( {metadata: tokenPair});
};

export const getAllUsersController = async(req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await userService.getAllUser(page, limit);

  return res.status(200).json(result);
}

export const getProfileController = async(req: AuthRequest, res: Response) => {
    const userId = req.params.userId || req.userId;
    const currentUserId = req.userId;
    if (!userId) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: USER_MESSAGES.UNAUTHORIZED })
    }
    if (!currentUserId) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: USER_MESSAGES.UNAUTHORIZED });
    }
    const user = await userService.getProfile(userId)
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ message: USER_MESSAGES.USER_NOT_FOUND });
    }
    let relationship = "not_friend";
    if (userId === currentUserId) {
      relationship = "me";
    } else {
      if (await userService.isFriend(currentUserId, userId)) {
        relationship = "friend";
      } else if (await userService.isRequested(currentUserId, userId)) {
        relationship = "requested";
      } else if (await userService.isFollowing(currentUserId, userId)) {
        relationship = "following";
      }
    }
    return res.status(200).json({ user, relationship })
}

export const updateProfileController = async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    const { name, email, avatar, background } = req.body;

    if (!userId) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: USER_MESSAGES.UNAUTHORIZED, 
      });
    }

    const payload = {
      ...(name && { name }), 
      ...(email && { email }),
      ...(avatar && { avatar }),
      ...(background && { background }),
    };

    const updatedUser = await updateProfile(userId, payload);

    if (!updatedUser) {
      return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: USER_MESSAGES.USER_NOT_FOUND,
      });
    }
    return res.status(httpStatus.OK).json({
      success: true,
      message: USER_MESSAGES.UPDATE_PROFILE_SUCCESS,
      data: updatedUser,
    });
};
