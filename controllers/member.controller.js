import { validationResult } from "express-validator";

import { extractFlashMessage } from "../utils/helpers.js";
import Member from "../models/member.model.js";

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
  const errorMessage = extractFlashMessage(req, "error");
  const successMessage = extractFlashMessage(req, "success");
  res.render("member/change-password", {
    pageTitle: "Change password",
    path: "/member/profile/change-password",
    errorMessage,
    successMessage,
    validationErrors: [],
    oldInput: req.oldInput,
  });
};

const postChangePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("member/change-password", {
      pageTitle: "Change password",
      path: "/member/profile/change-password",
      errorMessage: errors.array()[0].msg,
      successMessage: null,
      validationErrors: errors.array(),
      oldInput: req.oldInput,
    });
  }

  const { oldPassword, newPassword } = req.body;
  const user = await Member.findById(req.user._id);

  try {
    // Check if old password is correct using model's matchPassword method
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(422).render("member/change-password", {
        pageTitle: "Change password",
        path: "/member/profile/change-password",
        errorMessage: "Old password is incorrect.",
        successMessage: null,
        validationErrors: [{ path: "oldPassword" }],
        oldInput: req.oldInput,
      });
    }

    // Set the new password and let the pre-save hook handle the hashing
    user.password = newPassword;
    await user.save();

    req.flash("success", "Password changed successfully.");
  } catch (error) {
    console.error(error);
    req.flash("error", "Something went wrong. Please try again.");
  } finally {
    res.redirect("/member/profile/change-password");
  }
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
  postChangePassword,
  postEditProfile,
};
