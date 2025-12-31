const { Router } = require("express");
const {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} = require("../controllers/playlist.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = Router();

router.use(verifyJWT); // Saare routes secure hain

// 1. Create Playlist (Nayi Playlist banana)
router.route("/").post(createPlaylist);

// 2. Get User Playlists (User ki sari playlists)
router.route("/user/:userId").get(getUserPlaylists);

// 3. Get, Update, Delete Playlist (Playlist ID ke sath)
router.route("/:playlistId")
    .get(getPlaylistById)
    .patch(updatePlaylist)
    .delete(deletePlaylist);

// 4. Add/Remove Video (Video Playlist mein dalna ya nikalna)
router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist);

module.exports = router;