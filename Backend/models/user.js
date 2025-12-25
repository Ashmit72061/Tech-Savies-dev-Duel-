const mongoose = require('mongoose');

/**
 * User Schema
 * Represents a resident user in the system.
 * Used in: ResidentDashboard, SettingsPage, CommunityGoalsPage (leaderboard)
 */
const UserSchema = new mongoose.Schema({
    // Core auth fields
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Profile fields
    phone: { type: String },
    avatarUrl: { type: String },

    // Residence info
    flat: { type: String, required: true },
    society: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Society' 
    },

    // User settings (for SettingsPage)
    settings: {
        notifications: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true },
            weeklyReport: { type: Boolean, default: true }
        },
        privacy: {
            showOnLeaderboard: { type: Boolean, default: true },
            shareUsageData: { type: Boolean, default: false }
        }
    },

    // Score tracking (updated by backend job after consumption records)
    currentScore: { type: Number, default: 0 },
    lifetimeScore: { type: Number, default: 0 },
    scoreHistory: [{
        period: { type: String },           // "2023-10"
        score: { type: Number },            // Total monthly score
        breakdown: {
            electricity: { type: Number },  // 0-40
            water: { type: Number },        // 0-40
            waste: { type: Number }         // 0-20
        },
        improvementBonus: { type: Number, default: 0 },
        challengePoints: { type: Number, default: 0 },
        completedChallenges: [{ type: String }],
        zone: { type: String },             // 'green', 'improving', 'high_impact'
        rank: { type: Number },
        _id: false                          // Don't create _id for subdocs
    }],

    dateJoined: { type: Date, default: Date.now }
});

// Index for efficient lookups
UserSchema.index({ society: 1 });
UserSchema.index({ email: 1 });

module.exports = mongoose.model('User', UserSchema);