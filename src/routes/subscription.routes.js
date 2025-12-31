const { Router } = require("express");
const { 
    toggleSubscription, 
    getUserChannelSubscribers, 
    getSubscribedChannels 
} = require("../controllers/subscription.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = Router();

// Saare routes secure hain
router.use(verifyJWT);

router
    .route("/c/:channelId")
    .get(getUserChannelSubscribers) // Subscribers ki list dekho
    .post(toggleSubscription);      // Subscribe/Unsubscribe karo

router.route("/u/:subscriberId").get(getSubscribedChannels); // User ne kisko subscribe kiya

module.exports = router;