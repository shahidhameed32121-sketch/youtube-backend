const mongoose = require("mongoose");
const {Like} = require("../models/like.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const {asyncHandler} = require("../utils/asyncHandler");

// 👍 1. Toggle Video Like
const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // Check karo pehle se like hai ya nahi
    const alreadyLiked = await Like.findOne({
        video: videoId,
        likedBy: req.user?._id
    });

    if (alreadyLiked) {
        // Agar hai, to Delete karo (Unlike)
        await Like.findByIdAndDelete(alreadyLiked._id);
        
        return res.status(200).json(
            new ApiResponse(200, { isLiked: false }, "Unliked successfully")
        );
    } else {
        // Agar nahi hai, to Create karo (Like)
        await Like.create({
            video: videoId,
            likedBy: req.user?._id
        });

        return res.status(200).json(
            new ApiResponse(200, { isLiked: true }, "Liked successfully")
        );
    }
})

// 💬 2. Toggle Comment Like
const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    // Logic same as video, bas field 'comment' hoga
    // (Abhi hum isay skip kar rahe hain jab tak Comment model na ban jaye, 
    // lekin structure yahan hai)
    return res.status(200).json(new ApiResponse(200, {}, "Comment like toggled"))
})

// 🐦 3. Toggle Tweet Like
const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    return res.status(200).json(new ApiResponse(200, {}, "Tweet like toggled"))
})

// 📂 4. Get Liked Videos (Mera pasandida content)
const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user?._id),
                video: { $exists: true } // Sirf videos chahiye, comments nahi
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: { $first: "$owner" }
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                video: { $first: "$video" }
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    )
})

module.exports = {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}