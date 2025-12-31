const { Router } = require("express");
const { 
    getChannelStats, 
    getChannelVideos 
} = require("../controllers/dashboard.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = Router();

// Dashboard secured hai
router.use(verifyJWT);

// 1. Stats (Views, Subs count)
router.route("/stats").get(getChannelStats);

// 2. Videos (My uploaded videos)
router.route("/videos").get(getChannelVideos);

module.exports = router;