const get404Page = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "Page not found",
    path: undefined,
  });
};

const errorHandler = (err, _, res, next) => {
  console.error(err);
  res.render("error", {
    pageTitle: "Error",
    path: undefined,
    message: err.message,
  });
};

export default {
  get404Page,
  errorHandler,
};
