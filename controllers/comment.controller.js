import { validationResult } from "express-validator";
import Perfume from "../models/perfume.model.js";

const addComment = async (req, res) => {
  const errors = validationResult(req);
  const { perfumeId } = req.params;
  const { rating, content } = req.body;

  const perfume = await Perfume.findById(perfumeId);

  if (!perfume) {
    req.flash("error", "Perfume not found");
    return res.redirect("/");
  }

  if (!errors.isEmpty()) {
    req.flash("error", errors.array()[0].msg);
    return res.redirect(`/perfumes/${perfumeId}`);
  }

  // Check if user already commented on this perfume
  const existingComment = perfume.comments.find(
    (comment) => comment.author.toString() === req.user._id.toString()
  );

  if (existingComment) {
    req.flash("error", "You have already commented on this perfume");
    return res.redirect(`/perfumes/${perfumeId}`);
  }

  try {
    // Add new comment
    perfume.comments.push({
      rating: parseInt(rating),
      content,
      author: req.user._id,
    });

    await perfume.save();
    req.flash("success", "Comment added successfully");
  } catch (error) {
    console.error(error);
    req.flash("error", "Error adding comment");
  } finally {
    res.redirect(`/perfumes/${perfumeId}`);
  }
};

const editComment = async (req, res) => {
  const errors = validationResult(req);
  const { perfumeId, commentId } = req.params;
  const { rating, content } = req.body;

  const perfume = await Perfume.findById(perfumeId);
  if (!perfume) {
    req.flash("error", "Perfume not found");
    return res.redirect("/");
  }

  if (!errors.isEmpty()) {
    req.flash("error", errors.array()[0].msg);
    return res.redirect(`/perfumes/${perfumeId}`);
  }

  // Find the comment
  const comment = perfume.comments.id(commentId);
  if (!comment) {
    req.flash("error", "Comment not found");
    return res.redirect(`/perfumes/${perfumeId}`);
  }

  // Check if user is the author of the comment
  if (comment.author.toString() !== req.user._id.toString()) {
    req.flash("error", "You can only edit your own comments");
    return res.redirect(`/perfumes/${perfumeId}`);
  }

  try {
    // Update comment
    comment.rating = parseInt(rating);
    comment.content = content;

    await perfume.save();
    req.flash("success", "Comment updated successfully");
  } catch (error) {
    console.error(error);
    req.flash("error", "Error updating comment");
  } finally {
    res.redirect(`/perfumes/${perfumeId}`);
  }
};

const deleteComment = async (req, res) => {
  const { perfumeId, commentId } = req.params;

  const perfume = await Perfume.findById(perfumeId);
  if (!perfume) {
    req.flash("error", "Perfume not found");
    return res.redirect("/");
  }

  // Find the comment
  const comment = perfume.comments.id(commentId);
  if (!comment) {
    req.flash("error", "Comment not found");
    return res.redirect(`/perfumes/${perfumeId}`);
  }

  // Check if user is the author of the comment
  if (comment.author.toString() !== req.user._id.toString()) {
    req.flash("error", "You can only delete your own comments");
    return res.redirect(`/perfumes/${perfumeId}`);
  }

  try {
    // Remove comment
    await Perfume.updateOne(
      { _id: perfumeId },
      { $pull: { comments: { _id: commentId } } }
    );

    req.flash("success", "Comment deleted successfully");
  } catch (error) {
    console.error(error);
    req.flash("error", "Error deleting comment");
  } finally {
    res.redirect(`/perfumes/${perfumeId}`);
  }
};

export default {
  addComment,
  editComment,
  deleteComment,
};
