import Member from "../models/member.js";
import { JWT } from "../utils/jwt.js";

const bindReqUser = async (req, res, next) => {
  const token = req.session.jwt;

  if (!token) {
    req.user = null;
    res.locals.user = null;
    return next();
  }

  const { valid, userId, error } = JWT.verifyToken(token);

  if (!valid) {
    console.log("JWT verification failed:", error);
    req.user = null;
    res.locals.user = null;
    return next();
  }

  req.user = userId || null;
  res.locals.user = req.user;

  next();
};

export default bindReqUser;
