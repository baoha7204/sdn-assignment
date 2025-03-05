import Router from "express-promise-router";

import publicController from "../controllers/public.controller.js";

const publicRouter = Router();

publicRouter.get("/", publicController.getHome);

export default publicRouter;
