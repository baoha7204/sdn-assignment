import Router from "express-promise-router";

import publicController from "../controllers/public.controller.js";

const publicRouter = Router();

publicRouter.get("/", publicController.getHome);
publicRouter.get("/perfumes/:perfumeId", publicController.getPerfumeDetail);

export default publicRouter;
