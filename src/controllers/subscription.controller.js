const mongoose = require("mongoose");
const { Subscription } = require("../models/subscription.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse"); // 👈 FIX: Braces hata diye
const { asyncHandler } = require("../utils/asyncHandler");

// 🔔 Toggle Subscription (Subscribe / Unsubscribe)
const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    // Check karo ke kya pehle se subscribe kiya hua hai?
    const isSubscribed = await Subscription.findOne({
        subscriber: req.user?._id,
        channel: channelId
    });

    if (isSubscribed) {
        // Agar pehle se hai, to DELETE kar do (Unsubscribe)
        await Subscription.findByIdAndDelete(isSubscribed._id);
        
        return res.status(200).json(
            new ApiResponse(200, { subscribed: false }, "Unsubscribed successfully")
        );
    } else {
        // Agar nahi hai, to CREATE kar do (Subscribe)
        await Subscription.create({
            subscriber: req.user?._id,
            channel: channelId
        });

        return res.status(200).json(
            new ApiResponse(200, { subscribed: true }, "Subscribed successfully")
        );
    }
});

// 📋 Channel ke Subscribers ki list lao
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const subscribers = await Subscription.find({ channel: channelId })
                                        .populate("subscriber", "username fullName avatar");

    return res.status(200).json(
        new ApiResponse(200, subscribers, "Subscribers fetched successfully")
    );
});

module.exports = {
    toggleSubscription,
    getUserChannelSubscribers
};