const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // Mongoose 6+ aur 9+ mein options ki zaroorat nahi hoti, bas URI pass karein
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        
        console.log(`\n✅ MongoDB Connected! DB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("❌ MONGODB Connection Failed: ", error);
        process.exit(1);
    }
};

module.exports = connectDB;