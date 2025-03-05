import Router from "express-promise-router";
import adminController from "../controllers/admin.controller.js";
import isAdminMiddleware from "../middlewares/is-admin.middleware.js";

import {
  brandValidation,
  perfumeValidation,
} from "../validators/admin.validator.js";

const adminRouter = Router();

// Apply admin middleware to all routes
adminRouter.use(isAdminMiddleware);

// Brand routes
adminRouter.get("/brands", adminController.getBrands);
adminRouter.get("/brands/add", adminController.getBrandForm);
adminRouter.get("/brands/:brandId/edit", adminController.getEditBrand);
adminRouter.post("/brands/add", brandValidation, adminController.postAddBrand);
adminRouter.post(
  "/brands/:brandId/edit",
  brandValidation,
  adminController.postEditBrand
);
adminRouter.post("/brands/:brandId/delete", adminController.deleteBrand);

// Perfume routes
adminRouter.get("/perfumes", adminController.getPerfumes);
adminRouter.get("/perfumes/add", adminController.getPerfumeForm);
adminRouter.get("/perfumes/:perfumeId/edit", adminController.getEditPerfume);
adminRouter.post(
  "/perfumes/add",
  perfumeValidation,
  adminController.postAddPerfume
);
adminRouter.post(
  "/perfumes/:perfumeId/edit",
  perfumeValidation,
  adminController.postEditPerfume
);
adminRouter.post("/perfumes/:perfumeId/delete", adminController.deletePerfume);

export default adminRouter;
