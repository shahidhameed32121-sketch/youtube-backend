const { Router } = require("express");
const { toggleSubscription, getUserChannelSubscribers } = require("../controllers/subscription.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = Router();

// 🔒 Subscribe karne ke liye Login zaroori hai
router.use(verifyJWT);

// URL Aisa hoga: /api/v1/subscriptions/c/CHANNEL_ID_HERE
router.route("/c/:channelId")
    .post(toggleSubscription)      // Subscribe/Unsubscribe button ke liye
    .get(getUserChannelSubscribers); // Subscribers dekhne ke liye

module.exports = router;