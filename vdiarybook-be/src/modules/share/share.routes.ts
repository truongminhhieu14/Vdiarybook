import { Router } from "express";
import { verifyToken } from "~/middleware/auth.middleware";
import { wrapAsync } from "~/utils/handler";
import { shareInternalController } from "./share.controller";

const router = Router();

router.post("/internal", verifyToken, wrapAsync(shareInternalController));

export default router