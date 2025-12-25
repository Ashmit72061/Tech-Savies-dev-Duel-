const mongoose = require('mongoose');

/**
 * CommunityGoal Schema
 * Represents community challenges and goals shown on CommunityGoalsPage.
 * Tracks progress, participants, and completion status.
 */
const CommunityGoalSchema = new mongoose.Schema({
    // Reference
    society: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Society', 
        required: true 
    },

    // Goal details
    title: { type: String, required: true },
    description: { type: String },
    
    // Type and target
    type: { 
        type: String, 
        enum: ['energy', 'water', 'waste', 'event'], 
        required: true 
    },
    targetValue: { type: Number },
    targetUnit: { type: String },  // "kWh", "participants", "Liters", etc.

    // Progress tracking
    currentValue: { type: Number, default: 0 },
    participants: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],

    // Timeline
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    // Priority flag (for featured goal display)
    isPriority: { type: Boolean, default: false },

    // Status
    status: { 
        type: String, 
        enum: ['active', 'completed', 'expired'], 
        default: 'active' 
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Index for efficient queries by society and status
CommunityGoalSchema.index({ society: 1, status: 1 });

// Virtual for completion percentage
CommunityGoalSchema.virtual('completionPercentage').get(function() {
    if (!this.targetValue || this.targetValue === 0) return 0;
    return Math.min(100, Math.round((this.currentValue / this.targetValue) * 100));
});

// Virtual for days remaining
CommunityGoalSchema.virtual('daysRemaining').get(function() {
    const now = new Date();
    const diffTime = this.endDate - now;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
});

// Include virtuals in JSON output
CommunityGoalSchema.set('toJSON', { virtuals: true });
CommunityGoalSchema.set('toObject', { virtuals: true });

// Update timestamp on save
CommunityGoalSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('CommunityGoal', CommunityGoalSchema);
