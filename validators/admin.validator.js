import { body } from "express-validator";
import Brand from "../models/brand.model.js";

export const brandValidation = [
  body("brandName", "Invalid brand name")
    .trim()
    .notEmpty()
    .custom(async (value) => {
      const existedBrand = await Brand.findOne({ brandName: value });
      if (existedBrand) {
        throw new Error("Brand already exists! Please input another one.");
      }
      return true;
    }),
];

export const perfumeValidation = [
  body("perfumeName", "Invalid perfume name").trim().notEmpty(),
  body("uri", "Invalid URI").trim().notEmpty().isURL(),
  body("price", "Invalid price").trim().isNumeric(),
  body("volume", "Invalid volume").trim().isNumeric(),
];
