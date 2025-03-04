import { body } from "express-validator";
import Member from "../models/member.js";

export const loginValidation = [
  body("username", "Invalid username").trim().notEmpty(),
  body("password", "Password at least 5 characters!")
    .trim()
    .isLength({ min: 5 }),
];

export const signupValidation = [
  body("name", "Invalid name").trim().notEmpty(),
  body("YOB", "Invalid year of birth").isInt({
    min: 1900,
    max: new Date().getFullYear(),
  }),
  body("gender", "Invalid gender").toBoolean(),
  body("username", "Invalid username")
    .trim()
    .notEmpty()
    .custom(async (value) => {
      const user = await Member.findOne({ username: value });
      if (user) {
        throw new Error("Username already exists! Please login.");
      }
      return true;
    }),
  body("password", "Password at least 5 characters!")
    .trim()
    .isLength({ min: 5 }),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match.");
    }
    return true;
  }),
];
