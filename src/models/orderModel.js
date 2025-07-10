const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
        products: [{
            product_id: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }],
        total: { type: Number, required: true },
        status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
        shipping_address: { type: String, required: true },
        payment_method: { type: String, required: true }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const OrderModel = mongoose.model("orders", orderSchema);

module.exports = OrderModel;