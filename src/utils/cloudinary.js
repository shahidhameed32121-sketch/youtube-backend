const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// 1. Configuration (Aapki Details)
cloudinary.config({ 
  cloud_name: "dxxqw87xd", 
  api_key: "982196935344779", 
  api_secret: "Dtug6Jq0aRSg2iE65zA6zA109aI" 
});

// 2. Upload Function
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto" // Video, Image, Audio sab khud detect karega
        });

        // Upload hone ke baad local file delete kar do (Safayi)
        fs.unlinkSync(localFilePath);
        
        return response;

    } catch (error) {
        // Agar fail ho jaye, tab bhi local file delete kar do
        fs.unlinkSync(localFilePath); 
        return null;
    }
}

module.exports = { uploadOnCloudinary };