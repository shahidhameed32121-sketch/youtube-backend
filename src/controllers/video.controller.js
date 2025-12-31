const mongoose = require("mongoose");
const { asyncHandler } = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const Video = require("../models/video.model");
const User = require("../models/user.model");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const ApiResponse = require("../utils/ApiResponse");

// 🎥 1. Publish A Video (Upload Video & Thumbnail)
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    
    // 1. Validation: Title aur Desc zaroori hain
    if (
        [title, description].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // 2. Files Get karo (Multer se)
    const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoFileLocalPath) {
        throw new ApiError(400, "Video file is required")
    }
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail file is required")
    }

    // 3. Cloudinary Upload
    const videoFile = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!videoFile) {
        throw new ApiError(400, "Video file failed to upload on cloud")
    }
    if (!thumbnail) {
        throw new ApiError(400, "Thumbnail file failed to upload on cloud")
    }

    // 4. Database mein Create karo
    const video = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        duration: videoFile.duration, // Cloudinary duration deta hai
        owner: req.user._id
    })

    const createdVideo = await Video.findById(video._id)

    if (!createdVideo) {
        throw new ApiError(500, "Something went wrong while uploading the video")
    }

    return res.status(201).json(
        new ApiResponse(200, createdVideo, "Video published successfully")
    )
})

// 📺 2. Get Video By ID (Video Dekhna)
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    // Valid ID check
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Video fetched successfully")
    )
})

// ✏️ 3. Update Video Details (Title, Desc, Thumbnail)
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // Agar naya thumbnail upload hua hai
    const thumbnailLocalPath = req.file?.path;
    let thumbnailUrl;

    if (thumbnailLocalPath) {
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        if (!thumbnail.url) {
            throw new ApiError(400, "Error while updating thumbnail");
        }
        thumbnailUrl = thumbnail.url;
    }

    // Update Query Logic
    const updateFields = {
        $set: {
            title,
            description,
        }
    };

    // Agar thumbnail hai to usay bhi update karo
    if (thumbnailUrl) {
        updateFields.$set.thumbnail = thumbnailUrl;
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        updateFields,
        { new: true } // Return new updated video
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

// 🔄 5. Toggle Publish Status (Public/Private)
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Status ko ulta kar do (True hai to False, False hai to True)
    video.isPublished = !video.isPublished;
    await video.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, video, "Video publish status toggled")
    )
})

// 👇 Exports (Ab yahan 5 functions hain)
module.exports = {
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}