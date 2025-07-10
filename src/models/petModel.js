const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        species: { type: String, required: true },
        breed: { type: String },
        age: { type: Number },
        description: { type: String },
        images: [{ type: String }],
        status: { type: String, enum: ['available', 'adopted', 'pending'], default: 'available' },
        association_id: { type: mongoose.Schema.Types.ObjectId, ref: 'associations' }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const PetModel = mongoose.model("pets", petSchema);

module.exports = PetModel;