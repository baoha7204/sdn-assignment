import Router from "express-promise-router";

import errorController from "../controllers/error.controller.js";

const errorRouter = Router();

errorRouter.use("*", errorController.get404Page);

errorRouter.use(errorController.errorHandler);

export default errorRouter;
