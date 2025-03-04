import { validationResult } from "express-validator";

import Member from "../models/member.js";

import { extractFlashMessage } from "../utils/helpers.js";

const getLogin = async (req, res) => {
  const errorMessage = extractFlashMessage(req, "error");
  const successMessage = extractFlashMessage(req, "success");
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage,
    successMessage,
    validationErrors: [],
    oldInput: req.oldInput,
  });
};

const getRegister = async (req, res) => {
  const errorMessage = extractFlashMessage(req, "error");
  const successMessage = extractFlashMessage(req, "success");
  res.render("auth/register", {
    pageTitle: "Register",
    path: "/register",
    errorMessage,
    successMessage,
    validationErrors: [],
    oldInput: req.oldInput,
  });
};

const postLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      oldInput: req.oldInput,
    });
  }

  const { username, password } = req.body;
  const user = await Member.findOne({ username });
  if (!user) {
    req.flash("error", "Invalid username or password.");
    return res.redirect("/login");
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    req.flash("error", "Invalid email or password.");
    return res.redirect("/login");
  }
  req.session.user = user;
  await req.session.save();
  res.redirect("/");
};

const postRegister = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/register", {
      pageTitle: "Register",
      path: "/register",
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      oldInput: req.oldInput,
    });
  }
  const { name, username, YOB, gender, password } = req.body;
  const newUser = new Member({
    name,
    username,
    YOB,
    gender,
    password,
  });
  await newUser.save();

  req.flash("success", "Register successfully!");

  res.redirect("/login");
};

const postLogout = async (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

export default {
  getLogin,
  getRegister,
  postLogin,
  postRegister,
  postLogout,
};
