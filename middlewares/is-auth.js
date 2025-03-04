export const isAuth = (req, res, next) => {
  if (!req.session.user && !req.user) {
    req.flash("error", "Unauthorized");
    return res.redirect("/login");
  }
  next();
};
