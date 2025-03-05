const isAdminMiddleware = async (req, res, next) => {
  if (!req.user.isAdmin) {
    req.flash("error", "Admin access required");
    return res.redirect("/login");
  }

  next();
};

export default isAdminMiddleware;
