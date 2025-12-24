const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Array to store usage data within User schema as requested
    usageHistory: [{
        unitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
        date: { type: Date },
        electricityUsage: { type: Number },
        waterUsage: { type: Number }
    }],
    dateJoined: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);