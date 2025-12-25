const mongoose = require('mongoose');

/**
 * Society Schema
 * Represents a housing society/community managed by an admin.
 * Used in: AdminDashboard, CreateSocietyPage, SocietyImpactPage
 */
const SocietySchema = new mongoose.Schema({
    // Identity
    name: { type: String, required: true },
    registrationNumber: { type: String },
    logoUrl: { type: String },

    // Location
    address: {
        line1: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String }
    },

    // Setup
    totalUnits: { type: Number, default: 0 },
    scoringCycle: { 
        type: String, 
        enum: ['monthly', 'quarterly', 'annually'], 
        default: 'monthly' 
    },

    // Status
    status: { 
        type: String, 
        enum: ['submitting', 'audit_pending', 'active', 'inactive'], 
        default: 'submitting' 
    },

    // Computed metrics (updated by backend jobs/aggregation)
    metrics: {
        averageScore: { type: Number, default: 0 },
        totalResidents: { type: Number, default: 0 },
        co2Footprint: { type: Number },      // Tons
        waterSaved: { type: Number },         // Liters
        wasteDiverted: { type: Number }       // Percentage
    },

    // References
    admin: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Admin', 
        required: true 
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
SocietySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Society', SocietySchema);
