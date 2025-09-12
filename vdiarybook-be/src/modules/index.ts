import { Router } from "express";

import authRoutes from "./auth/auth.routes";
import friendRoutes from "./friend/friend.routes";
import mediaRouter from "./media/media.routes"
import postsRouter from "./post/post.routes";
import likesRouter from "./like/like.routes"
import commentsRouter from "./comment/comment.routes"
import notificationRoutes from "./notification/notification.routes";
import conversationRouter from "./conversation/conversation.routes"
import shareRouter from "./share/share.routes"

const router = Router();

router.use("/auth", authRoutes);
router.use("/friends", friendRoutes); 
router.use("/medias", mediaRouter);
router.use('/posts', postsRouter);
router.use('/likes', likesRouter);
router.use("/comments", commentsRouter);
router.use("/notifications", notificationRoutes);
router.use("/chat", conversationRouter);
router.use("/share", shareRouter);

export default router;