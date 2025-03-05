import Router from "express-promise-router";

import authController from "../controllers/auth.controller.js";

import isAuth from "../middlewares/is-auth.middleware.js";

import {
  loginValidation,
  signupValidation,
} from "../validators/auth.validator.js";

const authRouter = Router();

authRouter.get("/login", authController.getLogin);

authRouter.get("/register", authController.getRegister);

authRouter.post("/login", loginValidation, authController.postLogin);

authRouter.post("/register", signupValidation, authController.postRegister);

authRouter.get("/logout", isAuth, authController.getLogout);

export default authRouter;
