import mongoose, { Schema } from "mongoose";
import { commentSchema } from "./comment.js";

export const TargetAudience = {
  MALE: "male",
  FEMALE: "female",
  UNISEX: "unisex",
};

const perfumechema = new Schema(
  {
    perfumeName: { type: String, required: true },
    uri: { type: String, required: true },
    price: { type: Number, required: true },
    concentration: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: String, required: true },
    volume: { type: Number, required: true },
    targetAudience: { type: Object.values(TargetAudience), required: true }, // male, female, unisex
    comments: [commentSchema],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      require: true,
    },
  },
  { timestamps: true }
);

const Perfume = mongoose.model("Perfume", perfumechema);

export default Perfume;
