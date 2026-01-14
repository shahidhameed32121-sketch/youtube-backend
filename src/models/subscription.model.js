const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    subscriber: {
        type: mongoose.Schema.Types.ObjectId, // Jo subscribe kar raha hai (Main)
        ref: "User"
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId, // Jisko subscribe kiya ja raha hai (Wo)
        ref: "User"
    }
}, { timestamps: true });

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = { Subscription };