import { body } from "express-validator";

export const editProfileValidation = [
  body("name").trim().not().isEmpty().withMessage("Name is required"),
  body("YOB", "Invalid year of birth").isInt({
    min: 1900,
    max: new Date().getFullYear(),
  }),
  body("gender", "Invalid gender").toBoolean(),
];

export const changePasswordValidation = [
  body("oldPassword")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Old password is required"),
  body("newPassword")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match!");
      }
      return true;
    }),
];
