const { Router } = require("express");
const { verifyJWT } = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/multer.middleware");
const { 
    publishAVideo, 
    getVideoById, 
    updateVideo, 
    deleteVideo, 
    togglePublishStatus 
} = require("../controllers/video.controller");

const router = Router();

// 🔒 Security: Saare routes par Login zaroori hai
router.use(verifyJWT); 

// 🎥 1. Publish Video Route (Already Done)
router.route("/").post(
    upload.fields([
        { name: "videoFile", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 },
    ]),
    publishAVideo
);

// 📺 2. Get, Update, Delete Video Routes
// Ek hi URL par 3 alag methods
router.route("/:videoId")
    .get(getVideoById)                              // Video details dekhne ke liye
    .delete(deleteVideo)                            // Video delete karne ke liye
    .patch(upload.single("thumbnail"), updateVideo); // Video update karne ke liye (Thumbnail update ho sakti hai)

// 🔄 3. Toggle Publish Status
router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

module.exports = router;