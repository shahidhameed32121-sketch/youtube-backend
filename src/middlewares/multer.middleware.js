const multer = require("multer"); // 'import' ki jagah 'require'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Folder ka path
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    // File ka naam wahi rakho jo asli hai
    cb(null, file.originalname);
  }
});

const upload = multer({ 
  storage, 
});

// 'export' ki jagah 'module.exports'
module.exports = { upload };