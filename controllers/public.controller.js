import { extractFlashMessage } from "../utils/helpers.js";
import Perfume from "../models/perfume.model.js";
import Brand from "../models/brand.model.js";

const getHome = async (req, res) => {
  const errorMessage = extractFlashMessage(req, "error");
  const successMessage = extractFlashMessage(req, "success");

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    // Get search and filter parameters
    const searchQuery = req.query.search || "";
    const brandFilter = req.query.brand || "";

    // Build the query object
    const query = {};
    if (searchQuery) {
      query.perfumeName = { $regex: searchQuery, $options: "i" };
    }
    if (brandFilter) {
      query.brand = brandFilter;
    }

    // Get all perfumes with pagination, search, and filter
    const perfumes = await Perfume.find(query)
      .populate("brand")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPerfumes = await Perfume.countDocuments(query);
    const totalPages = Math.ceil(totalPerfumes / limit);

    // Get all brands for the filter dropdown
    const brands = await Brand.find().sort({ brandName: 1 });

    res.render("public/home", {
      pageTitle: "Perfume Collection",
      path: "/",
      perfumes,
      brands,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      searchQuery,
      brandFilter,
      errorMessage,
      successMessage,
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Error fetching perfumes");
    throw error;
  }
};

const getPerfumeDetail = async (req, res) => {
  const errorMessage = extractFlashMessage(req, "error");
  const successMessage = extractFlashMessage(req, "success");

  try {
    const perfumeId = req.params.perfumeId;
    const perfume = await Perfume.findById(perfumeId)
      .populate("brand")
      .populate({
        path: "comments.author",
        model: "Member",
        select: "username name",
      });

    if (!perfume) {
      req.flash("error", "Perfume not found");
      return res.redirect("/");
    }

    res.render("public/perfume-detail", {
      pageTitle: perfume.perfumeName,
      path: "/perfumes",
      perfume,
      errorMessage,
      successMessage,
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Error fetching perfume details");
    res.redirect("/");
  }
};

export default {
  getHome,
  getPerfumeDetail,
};
