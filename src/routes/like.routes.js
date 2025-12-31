const { Router } = require("express");
const { 
    toggleCommentLike, 
    toggleVideoLike, 
    toggleTweetLike, 
    getLikedVideos 
} = require("../controllers/like.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = Router();

// Saare routes par login zaroori hai
router.use(verifyJWT);

// 👍 Toggle Like Routes
router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);

// 📂 Get Liked Videos
router.route("/videos").get(getLikedVideos);

module.exports = router;