const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Vercel par sirf /tmp folder allowed hota hai
        cb(null, "/tmp")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ 
    storage, 
});

module.exports = { upload };   
//vercel fix update