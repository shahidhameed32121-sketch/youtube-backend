const multer = require("multer");

// Hum file ko disk (hard drive) par save karenge temporary taur par
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp") // File yahan save hogi
    },
    filename: function (req, file, cb) {
      // File ka original naam hi rakho
      cb(null, file.originalname)
    }
  })
  
const upload = multer({ 
    storage: storage, 
})

module.exports = { upload }