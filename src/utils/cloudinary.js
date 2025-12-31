const cloudinary = require('cloudinary').v2;
const fs = require('fs'); // Node ka file system (File read/write karne ke liye)

// Configuration (Keys hum .env mein rakhenge)
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // 1. File Cloudinary par upload karo
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto" // Image ho ya Video, khud detect karlo
        })

        // 2. Upload ho gaya - Success message
        // console.log("File is uploaded on cloudinary ", response.url);
        
        // 3. Local file delete kar do (Server saaf rakhne ke liye)
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        // Agar upload fail ho jaye, tab bhi local file delete kar do
        // taake server par kachra na jama ho
        fs.unlinkSync(localFilePath) 
        return null;
    }
}

module.exports = { uploadOnCloudinary }