const mongoose = require("mongoose");
const { Comment } = require("../models/comment.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse"); // ✅ Sahi Import
const { asyncHandler } = require("../utils/asyncHandler");

// ➕ 1. Add a Comment
const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Comment content is required");
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(200, comment, "Comment added successfully")
    );
});

// 📜 2. Get All Comments for a Video
const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // Database se comments dhoondo aur owner ki details bhi lao
    const comments = await Comment.find({ video: videoId })
        .populate("owner", "username avatar") // Owner ka naam aur photo lao
        .sort({ createdAt: -1 }); // Naya comment sabse upar

    return res.status(200).json(
        new ApiResponse(200, comments, "Comments fetched successfully")
    );
});

module.exports = {
    getVideoComments,
    addComment
};