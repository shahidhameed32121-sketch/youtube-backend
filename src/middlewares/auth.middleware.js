const { asyncHandler } = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // 1. Token dhoondo (Cookie mein ya Header mein)
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        // 2. Agar token nahi mila to error do
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // 3. Token verify karo (Secret key se)
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // 4. User ko database mein dhoondo
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        // 5. Request mein user add kar do (Taake agle function ko pata ho kaun login hai)
        req.user = user;
        next();
        
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});

module.exports = { verifyJWT };