import { Router } from "express";
import { verifyToken } from "~/middleware/auth.middleware";
import { wrapAsync } from "~/utils/handler";
import { checkIsLikedController, getReactionOfPostController, handleLikeController, seeAllLikeOfPostController } from "./like.controller";

const router = Router();

router.post('/', verifyToken, wrapAsync(handleLikeController));
router.get('/:postId', verifyToken, wrapAsync(seeAllLikeOfPostController));
router.get("/reactions/:postId", verifyToken, wrapAsync(getReactionOfPostController))
router.get('/check/:postId', verifyToken, wrapAsync(checkIsLikedController));

export default router;