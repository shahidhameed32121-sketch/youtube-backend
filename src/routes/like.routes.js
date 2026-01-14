const { Router } = require("express");
const { toggleVideoLike } = require("../controllers/like.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = Router();

// Saare routes par Login zaroori hai
router.use(verifyJWT);

// Route: /api/v1/likes/toggle/v/:videoId
router.route("/toggle/v/:videoId").post(toggleVideoLike);

module.exports = router;