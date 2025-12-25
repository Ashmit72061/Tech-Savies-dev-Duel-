const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const User = require('../models/user');

// ============================================================================
// GET /api/user/profile
// Get current user's profile
// ============================================================================
router.get('/profile', fetchUser, async (req, res) => {
    try {
        // Fetch user without password
        const user = await User.findById(req.user.id)
            .select('-password')
            .populate('society', 'name address');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
            success: true,
            user: user
        });
        
    } catch (error) {
        console.error('Get profile error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ============================================================================
// PUT /api/user/profile
// Update user profile
// ============================================================================
router.put('/profile', fetchUser, async (req, res) => {
    try {
        const { name, phone, avatarUrl, flat } = req.body;
        
        // Build update object with only provided fields
        const updateFields = {};
        if (name) updateFields.name = name;
        if (phone !== undefined) updateFields.phone = phone;
        if (avatarUrl !== undefined) updateFields.avatarUrl = avatarUrl;
        if (flat) updateFields.flat = flat;
        
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateFields },
            { new: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
            success: true,
            user: user,
            message: 'Profile updated successfully'
        });
        
    } catch (error) {
        console.error('Update profile error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ============================================================================
// GET /api/user/settings
// Get user settings
// ============================================================================
router.get('/settings', fetchUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('settings');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
            success: true,
            settings: user.settings
        });
        
    } catch (error) {
        console.error('Get settings error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ============================================================================
// PUT /api/user/settings
// Update user settings
// ============================================================================
router.put('/settings', fetchUser, async (req, res) => {
    try {
        const { settings } = req.body;
        
        if (!settings) {
            return res.status(400).json({ error: 'Settings object required' });
        }
        
        // Build nested update for settings
        const updateFields = {};
        
        if (settings.notifications) {
            if (settings.notifications.email !== undefined) {
                updateFields['settings.notifications.email'] = settings.notifications.email;
            }
            if (settings.notifications.push !== undefined) {
                updateFields['settings.notifications.push'] = settings.notifications.push;
            }
            if (settings.notifications.weeklyReport !== undefined) {
                updateFields['settings.notifications.weeklyReport'] = settings.notifications.weeklyReport;
            }
        }
        
        if (settings.privacy) {
            if (settings.privacy.showOnLeaderboard !== undefined) {
                updateFields['settings.privacy.showOnLeaderboard'] = settings.privacy.showOnLeaderboard;
            }
            if (settings.privacy.shareUsageData !== undefined) {
                updateFields['settings.privacy.shareUsageData'] = settings.privacy.shareUsageData;
            }
        }
        
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateFields },
            { new: true }
        ).select('settings');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
            success: true,
            settings: user.settings,
            message: 'Settings updated successfully'
        });
        
    } catch (error) {
        console.error('Update settings error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ============================================================================
// POST /api/user/change-password
// Change user password
// ============================================================================
router.post('/change-password', fetchUser, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new password required' });
        }
        
        const bcrypt = require('bcryptjs');
        
        // Get user with password
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }
        
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Update password
        user.password = hashedPassword;
        await user.save();
        
        res.json({
            success: true,
            message: 'Password changed successfully'
        });
        
    } catch (error) {
        console.error('Change password error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
