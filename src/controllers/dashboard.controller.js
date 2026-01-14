const mongoose = require("mongoose");
const { Video } = require("../models/video.model");
const { Subscription } = require("../models/subscription.model");
const { Like } = require("../models/like.model");
const ApiResponse = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

// 📊 1. Get Channel Stats (Views, Subs, Likes, Total Videos)
const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // 1. Total Videos & Total Views nikalo
    const videoStats = await Video.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: null,
                totalVideos: { $sum: 1 },
                totalViews: { $sum: "$views" }
            }
        }
    ]);

    // 2. Total Subscribers nikalo
    const subscribers = await Subscription.countDocuments({ channel: userId });

    // 3. Total Likes nikalo (Saari videos ke likes mila kar)
    // Pehle user ki saari videos dhoondo
    const userVideos = await Video.find({ owner: userId }).select("_id");
    const videoIds = userVideos.map(video => video._id);
    
    const totalLikes = await Like.countDocuments({ video: { $in: videoIds } });

    const stats = {
        totalVideos: videoStats[0]?.totalVideos || 0,
        totalViews: videoStats[0]?.totalViews || 0,
        subscribers: subscribers || 0,
        totalLikes: totalLikes || 0
    };

    return res.status(200).json(
        new ApiResponse(200, stats, "Dashboard stats fetched successfully")
    );
});

// 📹 2. Get All Videos of Channel (For Table)
const getChannelVideos = asyncHandler(async (req, res) => {
    const videos = await Video.find({ owner: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    );
});

module.exports = {
    getChannelStats,
    getChannelVideos
};