import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}
export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: 'Unauthorized: Token not provided',
        error: true,
        success: false
      });
      return;
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err || !decoded) {
        console.error('JWT Error:', err)
        return res.status(401).json({
          message: 'Invalid or expired token',
          error: true,
          success: false
        });
      }
      const payload = decoded as JwtPayload;
      req.userId = payload._id || payload.id || payload.userId;
      return next();
    });
  } catch (error) {
    res.status(403).json({
      message: "Authentication error",
    });
    return;
  }
};
