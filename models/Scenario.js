const mongoose = require('mongoose');

const ScenarioSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    selectedItems: {
        fruitsAndVegetables: [{ type: String }],
        cereals: [{ type: String }],
        beans: [{ type: String }]
    },
    foodMix: {
        diesel: { type: Number, default: 0 },
        gasoline: { type: Number, default: 0 }
    },
    waterMix: {
        groundWater: { type: Number, default: 0 },
        surfaceWater: { type: Number, default: 0 },
        treatedWasteWater: { type: Number, default: 0 }
    },
    energyMix: [
        {
            waterSource: { type: String, enum: ["Ground Water", "Surface Water", "Treated Water"], required: true },
            diesel: { type: Number, default: 0 },
            gasoline: { type: Number, default: 0 },
            wind: { type: Number, default: 0 },
            solar: { type: Number, default: 0 }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Scenario', ScenarioSchema);
