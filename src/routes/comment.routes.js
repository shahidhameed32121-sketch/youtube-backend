const { Router } = require("express");
const { addComment, getVideoComments } = require("../controllers/comment.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = Router();

// URL: /api/v1/comments/:videoId

router.route("/:videoId")
    .get(getVideoComments)          // 👀 Dekhna: Public (No Login Required)
    .post(verifyJWT, addComment);   // ✍️ Likhna: Private (Login Required)

module.exports = router;