const isAuthMiddleware = async (req, res, next) => {
  if (!req.user) {
    req.flash("error", "Unauthorized or session expired");
    return res.redirect("/login");
  }

  next();
};

export default isAuthMiddleware;
