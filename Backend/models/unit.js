const mongoose = require('mongoose');

const UnitSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    electricityUsage: { type: Number, required: true },
    waterUsage: { type: Number, required: true }, // Assuming 'usage' implies water or similar
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Unit', UnitSchema);