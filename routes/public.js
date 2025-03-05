import Router from "express-promise-router";

import publicController from "../controllers/public.js";

const publicRouter = Router();

publicRouter.get("/", publicController.getHome);

export default publicRouter;
