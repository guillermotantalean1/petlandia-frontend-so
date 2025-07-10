const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    stock: Number,
    status: {
        type: String,
        default: 'active'
    }
});

module.exports = mongoose.model('Product', productSchema);