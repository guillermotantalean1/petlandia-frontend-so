const mongoose = require('mongoose');

const associationSchema = new mongoose.Schema({
    name: String,
    description: String,
    status: {
        type: String,
        default: 'active'
    }
});

module.exports = mongoose.model('Association', associationSchema);