const { Router } = require("express");
const {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment
} = require("../controllers/comment.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = Router();

// Saare routes par login zaroori hai
router.use(verifyJWT);

// 1. Video ID wale routes (List dekhna aur Comment karna)
router.route("/:videoId").get(getVideoComments).post(addComment);

// 2. Comment ID wale routes (Delete aur Edit karna)
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

module.exports = router;