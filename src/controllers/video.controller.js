const { uploadOnCloudinary } = require("../utils/cloudinary");
const mongoose = require("mongoose");
const { asyncHandler } = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { Video } = require("../models/video.model");
const { User } = require("../models/user.model");
const ApiResponse = require("../utils/ApiResponse");

// 🎥 1. Publish A Video (CLOUD VERSION)
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    
    // 1. Validation
    if ([title, description].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Title and Description are required")
    }

    // 2. Files Local Path Get karo
    const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoFileLocalPath) {
        throw new ApiError(400, "Video file is required")
    }
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail file is required")
    }
    
    // 3. ☁️ CLOUDINARY UPLOAD (Yeh naya hissa hai)
    // Hum wait karenge jab tak file internet par upload na ho jaye
    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoFile) {
        throw new ApiError(500, "Video upload failed on Cloudinary");
    }
    if (!thumbnail) {
        throw new ApiError(500, "Thumbnail upload failed on Cloudinary");
    }

    // 4. Owner ID Fix
    const ownerId = req.user ? req.user._id : new mongoose.Types.ObjectId();

    // 5. Database Save (Ab hum Cloudinary URL save karenge, Local Path nahi)
    const video = await Video.create({
        title,
        description,
        videoFile: videoFile.url, // 👈 Cloud URL
        thumbnail: thumbnail.url, // 👈 Cloud URL
        duration: videoFile.duration || 100, 
        owner: ownerId, 
        isPublished: true
    })

    const createdVideo = await Video.findById(video._id)

    if (!createdVideo) {
        throw new ApiError(500, "Something went wrong while uploading the video")
    }

    return res.status(201).json(
        new ApiResponse(200, createdVideo, "Video published successfully")
    )
})

// 📺 2. Get Video By ID
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId).populate("owner", "username avatar");

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Video fetched successfully")
    )
})

// ✏️ 3. Update Video Details
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const thumbnailLocalPath = req.file?.path;
    
    const updateFields = {
        $set: {
            title,
            description,
        }
    };

    if (thumbnailLocalPath) {
        // Agar nayi thumbnail upload hui hai, to usey bhi Cloudinary par bhejna chahiye
        // (Filhal hum simple path logic rakh rahe hain taake complexity na badhe, 
        // lekin future mein yahan bhi uploadOnCloudinary lagana behtar hoga)
        updateFields.$set.thumbnail = thumbnailLocalPath; 
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        updateFields,
        { new: true }
    );

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Video updated successfully")
    )
})

// 🗑️ 4. Delete Video
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findByIdAndDelete(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Video deleted successfully")
    )
})

// 🔄 5. Toggle Publish Status
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    video.isPublished = !video.isPublished;
    await video.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, video, "Video publish status toggled")
    )
})

// 🔍 6. Get All Videos (With Search & Pagination)
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    
    // 1. Search Logic
    const pipeline = [];

    // Agar 'query' (search text) aaya hai, to Title aur Description mein dhoondo
    if (query) {
        pipeline.push({
            $match: {
                $or: [
                    { title: { $regex: query, $options: "i" } },       // 'i' means case-insensitive (A = a)
                    { description: { $regex: query, $options: "i" } }
                ]
            }
        });
    }

    // Sirf Published videos dikhao
    pipeline.push({ $match: { isPublished: true } });

    // Agar userId diya hai, to sirf us user ki videos dikhao
    if (userId) {
        pipeline.push({
            $match: { owner: new mongoose.Types.ObjectId(userId) }
        });
    }

    // Sort karo (Newest first by default)
    pipeline.push({
        $sort: { [sortBy || "createdAt"]: sortType === "asc" ? 1 : -1 }
    });

    // Owner ki details bhi lao
    pipeline.push({
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
            pipeline: [
                {
                    $project: {
                        username: 1,
                        fullName: 1,
                        avatar: 1
                    }
                }
            ]
        }
    });

    pipeline.push({ $unwind: "$owner" });

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };

    const videos = await Video.aggregatePaginate(Video.aggregate(pipeline), options);

    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    );
});

module.exports = {
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getAllVideos
}