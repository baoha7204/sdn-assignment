import { extractFlashMessage } from "../utils/helpers.js";

const getHome = async (req, res) => {
  const errorMessage = extractFlashMessage(req, "error");
  const successMessage = extractFlashMessage(req, "success");
  res.render("public/home", {
    pageTitle: "Home",
    path: "/",
    errorMessage,
    successMessage,
  });
};

export default {
  getHome,
};
