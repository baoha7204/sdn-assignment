import mongoose, { Schema } from "mongoose";

const brandSchema = new Schema({ brandName: String }, { timestamps: true });

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
