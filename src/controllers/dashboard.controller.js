const mongoose = require("mongoose");
const { Video } = require("../models/video.model");
const { Subscription } = require("../models/subscription.model");
const { Like } = require("../models/like.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

// 📊 1. Get Channel Stats (Views, Subs, Videos, Likes)
const getChannelStats = asyncHandler(async (req, res) => {
    // 1. Total Videos aur Total Views nikalo
    const videoStats = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $group: {
                _id: null,
                totalVideos: { $sum: 1 },
                totalViews: { $sum: "$views" }
            }
        }
    ]);

    // 2. Total Subscribers nikalo
    const subscribers = await Subscription.countDocuments({
        channel: req.user._id
    });

    // 3. Total Likes nikalo (Thora complex hai: Pehle video dhundo, phir likes)
    const likes = await Like.aggregate([
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoInfo"
            }
        },
        {
            $match: {
                "videoInfo.owner": new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $count: "totalLikes"
        }
    ]);

    const stats = {
        totalVideos: videoStats[0]?.totalVideos || 0,
        totalViews: videoStats[0]?.totalViews || 0,
        totalSubscribers: subscribers || 0,
        totalLikes: likes[0]?.totalLikes || 0
    };

    return res.status(200).json(
        new ApiResponse(200, stats, "Dashboard stats fetched successfully")
    );
});

// 📹 2. Get Channel Videos (All videos uploaded by user)
const getChannelVideos = asyncHandler(async (req, res) => {
    const videos = await Video.find({ owner: req.user._id });

    return res.status(200).json(
        new ApiResponse(200, videos, "Channel videos fetched successfully")
    );
});

module.exports = {
    getChannelStats,
    getChannelVideos
};