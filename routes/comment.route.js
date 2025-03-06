import Router from "express-promise-router";

import commentController from "../controllers/comment.controller.js";

import isAuthMiddleware from "../middlewares/is-auth.middleware.js";

import { commentValidation } from "../validators/comment.validator.js";

const commentRouter = Router();

commentRouter.use(isAuthMiddleware);

// Add a comment to a perfume
commentRouter.post(
  "/perfumes/:perfumeId/comments",
  commentValidation,
  commentController.addComment
);

// Edit a comment
commentRouter.post(
  "/perfumes/:perfumeId/comments/:commentId/edit",
  commentValidation,
  commentController.editComment
);

// Delete a comment
commentRouter.post(
  "/perfumes/:perfumeId/comments/:commentId/delete",
  commentController.deleteComment
);

export default commentRouter;
