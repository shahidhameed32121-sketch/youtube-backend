const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    subscriber: {
        type: mongoose.Schema.Types.ObjectId, // wo user jo subscribe kar raha hai
        ref: "User"
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId, // wo user jisko subscribe kiya ja raha hai
        ref: "User"
    }
}, {timestamps: true})

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = { Subscription }