const getHome = async (req, res) => {
  res.render("public/home", {
    pageTitle: "Home",
    path: "/",
  });
};

export default {
  getHome,
};
