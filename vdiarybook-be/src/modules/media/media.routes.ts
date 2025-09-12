import { Router } from "express";
import { uploadSingleImage, uploadVideoController } from "./media.controller";
import { wrapAsync } from "~/utils/handler";

const router = Router();

router.post("/upload-image", wrapAsync(uploadSingleImage));
router.post('/upload-video', wrapAsync(uploadVideoController));

export default router;