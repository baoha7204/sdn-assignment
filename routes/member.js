import Router from "express-promise-router";

import memberController from "../controllers/member.js";

import { editProfileValidation } from "../validators/member.js";

const memberRouter = Router();

memberRouter.get("/profile", memberController.getProfile);

memberRouter.get(
  "/profile/change-password",
  memberController.getChangePassword
);

memberRouter.post(
  "/profile",
  editProfileValidation,
  memberController.postEditProfile
);

export default memberRouter;
