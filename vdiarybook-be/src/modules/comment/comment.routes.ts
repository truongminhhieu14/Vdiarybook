import { Router } from "express";
import { verifyToken } from "~/middleware/auth.middleware";
import { wrapAsync } from "~/utils/handler";
import { countTotalCommentsController, createChildCommentController, createCommentController, deleteCommentController, getChildCommentsController, getCommentController, updateCommentController } from "./comment.controller";


const router = Router();

router.post("/:postId", verifyToken, wrapAsync(createCommentController));
router.post("/reply/:postId/:parentCommentId", verifyToken, wrapAsync(createChildCommentController));
router.put("/:commentId", verifyToken, wrapAsync(updateCommentController));
router.delete("/:commentId", verifyToken, wrapAsync(deleteCommentController));
router.get("/post/:postId", wrapAsync(getCommentController));
router.get("/replies/:parentCommentId", wrapAsync(getChildCommentsController));
router.get("/count/:postId", wrapAsync(countTotalCommentsController));

export default router;
