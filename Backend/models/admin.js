const mongoose = require('mongoose');

/**
 * Admin Schema
 * Represents an admin user who manages societies.
 * Used in: AdminDashboard, CreateSocietyPage
 */
const AdminSchema = new mongoose.Schema({
    // Core auth fields
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },

    // Profile fields
    phone: { type: String },
    avatarUrl: { type: String },

    // Society management (societies this admin manages)
    societies: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Society' 
    }],

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', AdminSchema);