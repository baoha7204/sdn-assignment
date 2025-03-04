import Router from "express-promise-router";
import authController from "../controllers/auth.js";
import { loginValidation, signupValidation } from "../validators/auth.js";

const authRouter = Router();

authRouter.get("/login", authController.getLogin);

authRouter.get("/register", authController.getRegister);

authRouter.post("/login", loginValidation, authController.postLogin);

authRouter.post("/register", signupValidation, authController.postRegister);

authRouter.post("/logout", authController.postLogout);

export default authRouter;
