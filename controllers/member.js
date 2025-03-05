import { validationResult } from "express-validator";

import { extractFlashMessage } from "../utils/helpers.js";
import Member from "../models/member.js";

const getProfile = async (req, res) => {
  const errorMessage = extractFlashMessage(req, "error");
  const successMessage = extractFlashMessage(req, "success");
  res.render("member/profile", {
    pageTitle: "Profile",
    path: "/member/profile",
    errorMessage,
    successMessage,
    validationErrors: [],
    oldInput: req.oldInput,
  });
};

const getChangePassword = async (req, res) => {
  res.render("member/change-password", {
    pageTitle: "Change password",
    path: "/member/profile/change-password",
  });
};

const postEditProfile = async (req, res) => {
  const errors = validationResult(req);
  const successMessage = extractFlashMessage(req, "success");
  if (!errors.isEmpty()) {
    return res.status(422).render("member/profile", {
      pageTitle: "Profile",
      path: "/member/profile",
      errorMessage: errors.array()[0].msg,
      successMessage,
      validationErrors: errors.array(),
      oldInput: req.oldInput,
    });
  }
  const { name, YOB, gender } = req.body;
  const user = await Member.findById(req.user._id);
  if (!user) {
    req.flash("error", "User not found.");
    return res.redirect("/member/profile");
  }

  user.name = name;
  user.YOB = YOB;
  user.gender = gender;
  await user.save();

  req.flash("success", "Profile updated successfully.");
  res.redirect("/member/profile");
};

export default {
  getProfile,
  getChangePassword,
  postEditProfile,
};
