import { validationResult } from "express-validator";
import Brand from "../models/brand.model.js";
import Perfume, {
  PerfumeConcentration,
  TargetAudience,
} from "../models/perfume.model.js";
import Member from "../models/member.model.js";

import { extractFlashMessage } from "../utils/helpers.js";

// Brand operations
const getBrands = async (req, res) => {
  const errorMessage = extractFlashMessage(req, "error");
  const successMessage = extractFlashMessage(req, "success");

  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const brands = await Brand.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBrands = await Brand.countDocuments();
    const totalPages = Math.ceil(totalBrands / limit);

    res.render("admin/brands", {
      pageTitle: "Admin: Manage Brands",
      path: "/admin/brands",
      brands,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      errorMessage,
      successMessage,
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Error fetching brands");
    res.redirect("/");
  }
};

const getBrandForm = async (req, res) => {
  const errorMessage = extractFlashMessage(req, "error");
  const successMessage = extractFlashMessage(req, "success");

  res.render("admin/brand-form", {
    pageTitle: "Add Brand",
    path: "/admin/brands",
    editing: false,
    brand: { brandName: "" },
    errorMessage,
    successMessage,
    validationErrors: [],
    oldInput: req.oldInput,
  });
};

const getEditBrand = async (req, res) => {
  const errorMessage = extractFlashMessage(req, "error");
  const successMessage = extractFlashMessage(req, "success");
  const brandId = req.params.brandId;

  try {
    const brand = await Brand.findById(brandId);

    if (!brand) {
      req.flash("error", "Brand not found");
      return res.redirect("/admin/brands");
    }

    res.render("admin/brand-form", {
      pageTitle: "Edit Brand",
      path: "/admin/brands",
      editing: true,
      brand,
      errorMessage,
      successMessage,
      validationErrors: [],
      oldInput: req.oldInput,
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Error fetching brand");
    res.redirect("/admin/brands");
  }
};

const postAddBrand = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/brand-form", {
      pageTitle: "Add Brand",
      path: "/admin/brands",
      editing: false,
      brand: null,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      successMessage: null,
      oldInput: req.oldInput,
    });
  }
  const { brandName } = req.body;
  try {
    const brand = new Brand({ brandName });
    await brand.save();

    req.flash("success", "Brand added successfully");
  } catch (error) {
    console.error(error);
    req.flash("error", "Error adding brand");
  } finally {
    res.redirect("/admin/brands");
  }
};

const postEditBrand = async (req, res) => {
  const brandId = req.params.brandId;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/brand-form", {
      pageTitle: "Add Brand",
      path: "/admin/brands",
      editing: true,
      brand: {
        _id: brandId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      successMessage: null,
      oldInput: req.oldInput,
    });
  }
  const { brandName } = req.body;
  try {
    await Brand.findByIdAndUpdate(brandId, { brandName });

    req.flash("success", "Brand updated successfully");
  } catch (error) {
    console.error(error);
    req.flash("error", "Error updating brand");
  } finally {
    res.redirect("/admin/brands");
  }
};

const deleteBrand = async (req, res) => {
  const brandId = req.params.brandId;
  try {
    // Check if brand is used by any perfumes
    const isUsed = await Brand.isUsedByPerfumes(brandId);

    if (isUsed) {
      req.flash("error", "Cannot delete brand as it is used by perfumes");
      return res.redirect("/admin/brands");
    }

    await Brand.findByIdAndDelete(brandId);

    req.flash("success", "Brand deleted successfully");
  } catch (error) {
    console.error(error);
    req.flash("error", "Error deleting brand");
  } finally {
    res.redirect("/admin/brands");
  }
};

// Perfume operations
const getPerfumes = async (req, res) => {
  const errorMessage = extractFlashMessage(req, "error");
  const successMessage = extractFlashMessage(req, "success");
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const perfumes = await Perfume.find()
      .populate("brand")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPerfumes = await Perfume.countDocuments();
    const totalPages = Math.ceil(totalPerfumes / limit);

    res.render("admin/perfumes", {
      pageTitle: "Admin: Manage Perfumes",
      path: "/admin/perfumes",
      perfumes,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      errorMessage,
      successMessage,
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Error fetching perfumes");
    res.redirect("/");
  }
};

const getPerfumeForm = async (req, res) => {
  const errorMessage = extractFlashMessage(req, "error");
  const successMessage = extractFlashMessage(req, "success");
  try {
    const brands = await Brand.find().sort({ brandName: 1 });

    if (!brands.length) {
      req.flash("error", "No brands found. Please add a brand first");
      return res.redirect("/admin/perfumes");
    }

    res.render("admin/perfume-form", {
      pageTitle: "Add Perfume",
      path: "/admin/perfumes",
      editing: false,
      perfume: {
        perfumeName: "",
        uri: "",
        price: "",
        concentration: "",
        description: "",
        ingredients: "",
        volume: "",
        targetAudience: "",
      },
      brands,
      targetOptions: Object.values(TargetAudience),
      concentrationOptions: Object.values(PerfumeConcentration),
      errorMessage,
      successMessage,
      validationErrors: [],
      oldInput: req.oldInput,
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Error loading form");
    res.redirect("/admin/perfumes");
  }
};

const getEditPerfume = async (req, res) => {
  const errorMessage = extractFlashMessage(req, "error");
  const successMessage = extractFlashMessage(req, "success");
  try {
    const perfumeId = req.params.perfumeId;
    const perfume = await Perfume.findById(perfumeId);
    const brands = await Brand.find().sort({ brandName: 1 });

    if (!perfume) {
      req.flash("error", "Perfume not found");
      return res.redirect("/admin/perfumes");
    }

    res.render("admin/perfume-form", {
      pageTitle: "Edit Perfume",
      path: "/admin/perfumes",
      editing: true,
      perfume,
      brands,
      targetOptions: Object.values(TargetAudience),
      concentrationOptions: Object.values(PerfumeConcentration),
      errorMessage,
      successMessage,
      validationErrors: [],
      oldInput: req.oldInput,
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Error fetching perfume");
    res.redirect("/admin/perfumes");
  }
};

const postAddPerfume = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const brands = await Brand.find().sort({ brandName: 1 });
    return res.status(422).render("admin/perfume-form", {
      pageTitle: "Add Perfume",
      path: "/admin/perfumes",
      editing: false,
      perfume: null,
      brands,
      targetOptions: Object.values(TargetAudience),
      concentrationOptions: Object.values(PerfumeConcentration),
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      successMessage: null,
      oldInput: req.oldInput,
    });
  }
  const {
    perfumeName,
    uri,
    price,
    concentration,
    description,
    ingredients,
    volume,
    targetAudience,
    brand,
  } = req.body;

  try {
    const perfume = new Perfume({
      perfumeName,
      uri,
      price: parseFloat(price),
      concentration,
      description,
      ingredients,
      volume: parseFloat(volume),
      targetAudience,
      brand,
      comments: [],
    });

    await perfume.save();

    req.flash("success", "Perfume added successfully");
  } catch (error) {
    console.error(error);
    req.flash("error", "Error adding perfume");
  } finally {
    res.redirect("/admin/perfumes");
  }
};

const postEditPerfume = async (req, res) => {
  const perfumeId = req.params.perfumeId;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const brands = await Brand.find().sort({ brandName: 1 });
    return res.status(422).render("admin/perfume-form", {
      pageTitle: "Add Perfume",
      path: "/admin/perfumes",
      editing: true,
      perfume: {
        _id: perfumeId,
      },
      brands,
      targetOptions: Object.values(TargetAudience),
      concentrationOptions: Object.values(PerfumeConcentration),
      errorMessage: errors.array()[0].msg,
      successMessage: null,
      validationErrors: errors.array(),
      oldInput: req.oldInput,
    });
  }
  const {
    perfumeName,
    uri,
    price,
    concentration,
    description,
    ingredients,
    volume,
    targetAudience,
    brand,
  } = req.body;

  try {
    await Perfume.findByIdAndUpdate(perfumeId, {
      perfumeName,
      uri,
      price: parseFloat(price),
      concentration,
      description,
      ingredients,
      volume: parseFloat(volume),
      targetAudience,
      brand,
    });

    req.flash("success", "Perfume updated successfully");
  } catch (error) {
    console.error(error);
    req.flash("error", "Error updating perfume");
  } finally {
    res.redirect("/admin/perfumes");
  }
};

const deletePerfume = async (req, res) => {
  const perfumeId = req.params.perfumeId;
  try {
    await Perfume.findByIdAndDelete(perfumeId);

    req.flash("success", "Perfume deleted successfully");
  } catch (error) {
    console.error(error);
    req.flash("error", "Error deleting perfume");
  } finally {
    res.redirect("/admin/perfumes");
  }
};

// Member operations
const getMembers = async (req, res) => {
  const errorMessage = extractFlashMessage(req, "error");
  const successMessage = extractFlashMessage(req, "success");

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    
    // Add role filter functionality
    const roleFilter = req.query.role;
    let filterQuery = {};
    
    if (roleFilter === 'admin') {
      filterQuery = { isAdmin: true };
    } else if (roleFilter === 'member') {
      filterQuery = { isAdmin: false };
    }
    
    // Apply filters to the query
    const members = await Member.find(filterQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Count with the same filter for pagination
    const totalMembers = await Member.countDocuments(filterQuery);
    const totalPages = Math.ceil(totalMembers / limit);

    res.render("admin/members", {
      pageTitle: "Admin: Manage Members",
      path: "/admin/collectors",
      members,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      errorMessage,
      successMessage,
      activeRole: roleFilter || 'all' // Track the active filter
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Error fetching members");
    res.redirect("/");
  }
};

export default {
  getBrands,
  getBrandForm,
  getEditBrand,
  postAddBrand,
  postEditBrand,
  deleteBrand,
  getPerfumes,
  getPerfumeForm,
  getEditPerfume,
  postAddPerfume,
  postEditPerfume,
  deletePerfume,
  getMembers,
};
