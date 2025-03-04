import Router from "express-promise-router";

import memberController from "../controllers/member.js";

const memberRouter = Router();

memberRouter.get("/", memberController.getHome);

export default memberRouter;
