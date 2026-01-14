const mongoose = require("mongoose");
const { Like } = require("../models/like.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse"); // ✅ Fixed: Braces { } hata diye hain
const { asyncHandler } = require("../utils/asyncHandler");

// 👍 Toggle Video Like
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // Check karo pehle se Like kiya hai ya nahi
    const alreadyLiked = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    });

    if (alreadyLiked) {
        // Agar hai, to remove karo (Unlike)
        await Like.findByIdAndDelete(alreadyLiked._id);
        
        return res.status(200).json(
            new ApiResponse(200, { isLiked: false }, "Unliked successfully")
        );
    } else {
        // Agar nahi hai, to add karo (Like)
        await Like.create({
            video: videoId,
            likedBy: req.user._id
        });

        return res.status(200).json(
            new ApiResponse(200, { isLiked: true }, "Liked successfully")
        );
    }
});

module.exports = {
    toggleVideoLike
};