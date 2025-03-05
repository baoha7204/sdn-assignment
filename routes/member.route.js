import Router from "express-promise-router";

import memberController from "../controllers/member.controller.js";

import {
  editProfileValidation,
  changePasswordValidation,
} from "../validators/member.validator.js";

const memberRouter = Router();

memberRouter.get(
  "/profile/change-password",
  memberController.getChangePassword
);

memberRouter.get("/profile", memberController.getProfile);

memberRouter.post(
  "/profile/change-password",
  changePasswordValidation,
  memberController.postChangePassword
);

memberRouter.post(
  "/profile",
  editProfileValidation,
  memberController.postEditProfile
);

export default memberRouter;
