import Member from "../models/member.model.js";

const isAuthMiddleware = async (req, res, next) => {
  if (!req.user) {
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

export default isAuthMiddleware;
