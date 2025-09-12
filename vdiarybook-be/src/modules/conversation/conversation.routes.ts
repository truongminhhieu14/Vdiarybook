import { Router } from "express";
import { verifyToken } from "~/middleware/auth.middleware";
import { wrapAsync } from "~/utils/handler";
import { createConversationController, createMessageController, getAllConversationController, getConversationController } from "./conversation.controller";

const router = Router();

router.get("/", verifyToken, wrapAsync(getAllConversationController));
router.post("/create", verifyToken, wrapAsync(createConversationController));
router.post("/:conversationId/message", verifyToken, wrapAsync(createMessageController));
router.get("/:conversationId/message", verifyToken, wrapAsync(getConversationController));

export default router;