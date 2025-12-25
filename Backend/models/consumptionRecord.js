const mongoose = require('mongoose');

/**
 * ConsumptionRecord Schema
 * Stores monthly usage data submitted via InputDataPage.
 * Replaces the old Unit model with more complete fields.
 * Used in: InputDataPage, ResidentDashboard, AdminDashboard (pending approvals)
 */
const ConsumptionRecordSchema = new mongoose.Schema({
    // References
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    society: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Society'
        // Not required - user may not be in a society yet
    },

    // Target info (from form)
    building: { type: String },
    flatNumber: { type: String },
    billingPeriod: { type: String, required: true },  // Format: "YYYY-MM" e.g. "2023-10"

    // Usage metrics
    electricity: { type: Number, required: true },    // kWh
    water: { type: Number, required: true },          // Liters
    wasteSegregation: { 
        type: String, 
        enum: ['yes', 'partial', 'no'], 
        default: 'yes' 
    },

    // Admin review workflow
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending' 
    },
    reviewedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Admin' 
    },
    reviewedAt: { type: Date },
    reviewNotes: { type: String },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Compound index for efficient queries
ConsumptionRecordSchema.index({ user: 1, billingPeriod: 1 });
ConsumptionRecordSchema.index({ society: 1, status: 1 });

// Update timestamp on save - using async style
ConsumptionRecordSchema.pre('save', async function() {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('ConsumptionRecord', ConsumptionRecordSchema);
