import Member from "../models/member.js";
import { JWT } from "../utils/jwt.js";

export const isAuth = async (req, res, next) => {
  const token = req.session.jwt;

  if (!token) {
    req.flash("error", "Unauthorized");
    return res.redirect("/login");
  }

  const { valid } = JWT.verifyToken(token);

  if (!valid || !req.user) {
    req.flash("error", "Unauthorized or session expired");
    return res.redirect("/login");
  }

  try {
    const user = await Member.findById(req.user);
    req.user = user;
    res.locals.user = user;
  } catch (error) {
    console.log("Error fetching user:", error);
    req.user = null;
    res.locals.user = null;
  }

  next();
};
