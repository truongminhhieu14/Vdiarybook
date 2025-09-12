import { Router } from "express";
import { verifyToken } from "~/middleware/auth.middleware";
import { wrapAsync } from "~/utils/handler";
import { createPostController, deletePostController, extractLinkMetadataController, getAllPostOfUserController, getNewFeedsController, getPostByPostIdController, getRandomFeedsController, updatePostController } from "./post.controller";
import { checkPageAndLimit } from "~/middleware/common.middleware";
import { createPostValidator, postValidator } from "~/validators/post.validator";


const router = Router();

router.post('/metadata', extractLinkMetadataController)
router.post('/', verifyToken, createPostValidator, wrapAsync(createPostController));
router.get("/feeds", verifyToken, wrapAsync(getRandomFeedsController));
router.get("/profile/:userId", verifyToken, wrapAsync(getAllPostOfUserController));
router.get('/', verifyToken, checkPageAndLimit, wrapAsync(getNewFeedsController));
router.get('/:postId', verifyToken, postValidator, wrapAsync(getPostByPostIdController));
router.put("/:postId", verifyToken,createPostValidator, wrapAsync(updatePostController))
router.delete("/:postId", verifyToken, wrapAsync(deletePostController));

export default router;