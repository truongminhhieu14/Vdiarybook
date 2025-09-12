import { NextFunction, Request, Response } from "express";
import { uploadImageService, uploadVideoService } from "./media.service";

export const uploadSingleImage = async (req: Request, res: Response, next: NextFunction) => {
    const data = await uploadImageService(req)
    return res.json(data)
}

export const uploadVideoController = async  (req: Request, res: Response, next: NextFunction) => {
    const data = await uploadVideoService(req);
    return res.json(data)
}