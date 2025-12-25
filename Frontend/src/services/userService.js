/**
 * User Service
 * 
 * API calls for user profile and settings.
 * Used by: SettingsPage, ResidentDashboard (welcome message)
 */

import api, { validateResponse } from './api';

// =============================================================================
// DATA TRANSFORMERS
// =============================================================================

/**
 * Transform backend user response to frontend format
 */
export function transformUserProfile(backendUser) {
    if (!backendUser) return null;
    
    return {
        id: backendUser._id || backendUser.id,
        name: backendUser.name || '',
        username: backendUser.username || '',
        email: backendUser.email || '',
        phone: backendUser.phone || '',
        avatarUrl: backendUser.avatarUrl || null,
        flat: backendUser.flat || '',
        society: backendUser.society || null,
        currentScore: backendUser.currentScore || 0,
        lifetimeScore: backendUser.lifetimeScore || 0,
        dateJoined: backendUser.dateJoined || null,
        settings: {
            notifications: {
                email: backendUser.settings?.notifications?.email ?? true,
                push: backendUser.settings?.notifications?.push ?? true,
                weeklyReport: backendUser.settings?.notifications?.weeklyReport ?? true,
            },
            privacy: {
                showOnLeaderboard: backendUser.settings?.privacy?.showOnLeaderboard ?? true,
                shareUsageData: backendUser.settings?.privacy?.shareUsageData ?? false,
            },
        },
    };
}

/**
 * Get user initials for avatar
 */
export function getUserInitials(name) {
    if (!name) return '??';
    return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

// =============================================================================
// API CALLS
// =============================================================================

/**
 * Get current user's profile
 * @returns {Promise<Object>} User profile
 */
export async function getProfile() {
    const response = await api.get('/api/user/profile');
    
    if (!validateResponse(response, ['user'])) {
        throw new Error('Invalid profile response');
    }
    
    return transformUserProfile(response.user);
}

/**
 * Update user profile
 * @param {Object} profileData - Updated profile fields
 * @returns {Promise<Object>} Updated user profile
 */
export async function updateProfile(profileData) {
    const response = await api.put('/api/user/profile', profileData);
    
    if (!validateResponse(response, ['user'])) {
        throw new Error('Invalid update response');
    }
    
    return transformUserProfile(response.user);
}

/**
 * Update user settings (notifications, privacy)
 * @param {Object} settings - Updated settings
 * @returns {Promise<Object>} Updated settings
 */
export async function updateSettings(settings) {
    const response = await api.put('/api/user/settings', { settings });
    
    return response.settings;
}

/**
 * Change user password
 * @param {string} currentPassword 
 * @param {string} newPassword 
 * @returns {Promise<Object>}
 */
export async function changePassword(currentPassword, newPassword) {
    return api.post('/api/user/change-password', {
        currentPassword,
        newPassword,
    });
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
    getProfile,
    updateProfile,
    updateSettings,
    changePassword,
    transformUserProfile,
    getUserInitials,
};
