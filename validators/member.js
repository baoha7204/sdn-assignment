import { body } from "express-validator";

export const editProfileValidation = [
  body("name", "Invalid name").trim().notEmpty(),
  body("YOB", "Invalid year of birth").isInt({
    min: 1900,
    max: new Date().getFullYear(),
  }),
  body("gender", "Invalid gender").toBoolean(),
];
