import mongoose, { Schema } from "mongoose";

import { Password } from "../utils/password.js";

const memberSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    name: { type: String, required: true },
    YOB: { type: Number, required: true },
    gender: { type: Boolean, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

memberSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashedPassword = await Password.hashPassword(this.password).catch(
      done
    );
    this.set("password", hashedPassword);
  }

  done();
});

memberSchema.methods.matchPassword = async function (enteredPassword) {
  return await Password.comparePassword(enteredPassword, this.password);
};

const Member = mongoose.model("Member", memberSchema);

export default Member;
