import { Router } from "express";
import { verifyToken } from "~/middleware/auth.middleware";
import { handleFriendActionController, getMutualFriendsBatchController, getFriendDataController, searchFriendsController } from "./friend.controller";
import { wrapAsync } from "~/utils/handler";
import { handleFriendActionValidator } from "~/validators/friend.validator";


const router = Router();

router.post("/action", verifyToken, handleFriendActionValidator, wrapAsync(handleFriendActionController))
router.get("/", verifyToken, wrapAsync(getFriendDataController))
router.get("/:userId", verifyToken, wrapAsync(getFriendDataController))
router.post("/mutual-friends-batch", verifyToken, wrapAsync(getMutualFriendsBatchController));
router.get("/search", verifyToken , wrapAsync(searchFriendsController));

export default router;

