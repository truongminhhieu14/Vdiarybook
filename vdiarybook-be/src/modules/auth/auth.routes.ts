import express from "express";
import { getAllUsersController, getProfileController, loginController, logOutController, refreshTokenController, registerController, updateProfileController } from "./auth.controller";
import { verifyToken } from "~/middleware/auth.middleware";
import { wrapAsync } from "~/utils/handler";
import { filterMiddleware } from "~/middleware/common.middleware";
import { loginValidator, registerValidator, updateUserValidator } from "~/validators/auth.validator";
import { UpdateProfile } from "./auth.request";

const router = express.Router();

router.post("/register", registerValidator, wrapAsync(registerController));
router.post("/login", loginValidator, wrapAsync(loginController));
router.post("/logout", logOutController)
router.post("/getNewAccessToken", wrapAsync(refreshTokenController))
router.get("/users", verifyToken, wrapAsync(getAllUsersController))
router.get("/get-profile", verifyToken, wrapAsync(getProfileController))
router.get("/get-profile/:userId", verifyToken, wrapAsync(getProfileController))
router.patch("/update-profile", verifyToken, updateUserValidator, filterMiddleware<UpdateProfile>(['name', 'avatar', 'background']) ,wrapAsync(updateProfileController))

export default router;
 