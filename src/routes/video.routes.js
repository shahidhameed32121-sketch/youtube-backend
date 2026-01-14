const { Router } = require("express");
const { verifyJWT } = require("../middlewares/auth.middleware"); // 👈 Guard ko bulaya
const { upload } = require("../middlewares/multer.middleware");
const { 
    publishAVideo, 
    getVideoById, 
    updateVideo, 
    deleteVideo, 
    togglePublishStatus,
    getAllVideos
} = require("../controllers/video.controller");

const router = Router();

// 🎥 1. Home Page (Sab dekh sakein) & Upload (Sirf Login wale)
router.route("/")
    .get(getAllVideos) // 👀 Videos dekhne ke liye Login zaroori NAHI hai
    .post(
        verifyJWT, // 👈 🛑 Yahan Guard laga diya (Sirf Upload par)
        upload.fields([
            { name: "videoFile", maxCount: 1 },
            { name: "thumbnail", maxCount: 1 },
        ]),
        publishAVideo
    );

// 📺 2. Single Video Operations
router.route("/:videoId")
    .get(getVideoById) // Video dekhna sabke liye free
    .delete(verifyJWT, deleteVideo) // Delete sirf Login wala kare
    .patch(verifyJWT, upload.single("thumbnail"), updateVideo); // Update bhi sirf Login wala

// 🔄 3. Status Toggle
router.route("/toggle/publish/:videoId").patch(verifyJWT, togglePublishStatus);

module.exports = router;