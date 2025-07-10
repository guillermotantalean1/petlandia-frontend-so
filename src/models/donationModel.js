const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
        association_id: { type: mongoose.Schema.Types.ObjectId, ref: "associations", required: true },
        amount: { type: Number, required: true },
        payment_method: { type: String, required: true },
        status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
        message: { type: String },
        order_id: { type: mongoose.Schema.Types.ObjectId, ref: "orders" }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const DonationModel = mongoose.model("donations", donationSchema);

module.exports = DonationModel;