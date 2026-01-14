const { Router } = require("express");
const { getChannelStats, getChannelVideos } = require("../controllers/dashboard.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = Router();

router.use(verifyJWT); // Dashboard sirf Login wale dekh sakte hain

router.route("/stats").get(getChannelStats);   // Stats ke liye
router.route("/videos").get(getChannelVideos); // Videos list ke liye

module.exports = router;