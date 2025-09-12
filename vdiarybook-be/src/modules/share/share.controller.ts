import { Response } from "express";
import { AuthRequest } from "~/middleware/auth.middleware";
import { shareService } from "./share.service";

export const shareInternalController = async(req: AuthRequest, res: Response) => {
    const userId = req.userId as string;
    const { postId, caption } = req.body;

    const share = await shareService.internalShare(userId, postId, caption);
    return res.status(201).json({share})
}

export const shareExternalController = async(req: AuthRequest, res: Response) => {
    const userId = req.userId as string;
    const { postId, platform } = req.body;
    const result = await shareService.externalShare(postId, platform);
    return res.status(200).json(result);
}