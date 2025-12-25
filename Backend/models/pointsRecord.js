const mongoose = require('mongoose');

/**
 * PointsRecord Schema
 * Stores monthly points calculations for each user based on their consumption data.
 * Points are calculated using the EcoScore algorithm from points-allocation-algo.md
 */
const PointsRecordSchema = new mongoose.Schema({
    // References
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    society: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Society', 
        required: true 
    },
    consumptionRecord: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ConsumptionRecord', 
        required: true 
    },

    // Period
    billingPeriod: { type: String, required: true },  // Format: "YYYY-MM"

    // Input data snapshot (for audit trail)
    inputData: {
        electricity: { type: Number },    // kWh
        water: { type: Number },          // Liters
        wasteStatus: { type: String },    // 'compliant', 'partial', 'non-compliant'
        residents: { type: Number, default: 4 }  // Number of residents in flat
    },

    // Score breakdown (0-100 base)
    scores: {
        electricity: { type: Number, default: 0 },  // 0-40
        water: { type: Number, default: 0 },        // 0-40
        waste: { type: Number, default: 0 },        // 0-20
        base: { type: Number, default: 0 }          // 0-100 (sum of above)
    },

    // Bonuses
    improvementBonus: { type: Number, default: 0 },  // 0-10

    // Challenge rewards
    challengePoints: { type: Number, default: 0 },
    completedChallenges: [{ type: String }],  // e.g., ['electricity_reduction_10', 'society_goal_achieved']

    // Final score
    totalMonthlyScore: { type: Number, default: 0 },

    // Zone classification
    zone: { 
        type: String, 
        enum: ['green', 'improving', 'high_impact'], 
        default: 'improving' 
    },

    // Validation flags
    validation: {
        isValid: { type: Boolean, default: true },
        warnings: [{ type: String }]
    },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Compound index for efficient queries
PointsRecordSchema.index({ user: 1, billingPeriod: 1 }, { unique: true });
PointsRecordSchema.index({ society: 1, billingPeriod: 1 });
PointsRecordSchema.index({ user: 1, createdAt: -1 });

// Update timestamp on save
PointsRecordSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('PointsRecord', PointsRecordSchema);
