const { Router } = require("express");
const {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet
} = require("../controllers/tweet.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = Router();

// Saare routes par login zaroori hai
router.use(verifyJWT);

// 1. Create Tweet (Nayi post lagana)
router.route("/").post(createTweet);

// 2. Get User Tweets (Kisi user ki posts dekhna)
router.route("/user/:userId").get(getUserTweets);

// 3. Update/Delete Tweet (Apni post edit/delete karna)
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

module.exports = router;
