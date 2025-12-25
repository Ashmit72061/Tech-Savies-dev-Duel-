/**
 * Points Service
 * 
 * API calls for points, scores, and leaderboard data.
 * Used by: ResidentDashboard, CommunityGoalsPage
 */

import api, { validateResponse } from './api';

// =============================================================================
// DATA TRANSFORMERS
// =============================================================================

/**
 * Transform points response for dashboard display
 */
export function transformCurrentPoints(backendPoints) {
    if (!backendPoints) {
        return {
            currentScore: 0,
            breakdown: { electricity: 0, water: 0, waste: 0 },
            improvementBonus: 0,
            challengePoints: 0,
            completedChallenges: [],
            zone: 'improving',
            billingPeriod: null,
        };
    }
    
    return {
        currentScore: backendPoints.currentScore || backendPoints.totalMonthlyScore || 0,
        breakdown: {
            electricity: backendPoints.breakdown?.electricity || backendPoints.scores?.electricity || 0,
            water: backendPoints.breakdown?.water || backendPoints.scores?.water || 0,
            waste: backendPoints.breakdown?.waste || backendPoints.scores?.waste || 0,
        },
        improvementBonus: backendPoints.improvementBonus || 0,
        challengePoints: backendPoints.challengePoints || 0,
        completedChallenges: backendPoints.completedChallenges || [],
        zone: backendPoints.zone || 'improving',
        billingPeriod: backendPoints.billingPeriod || null,
    };
}

/**
 * Format billing period for display
 * "2023-10" → "October 2023"
 */
export function formatBillingPeriod(period) {
    if (!period) return 'Current Period';
    
    const [year, month] = period.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    
    return date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });
}

/**
 * Get zone display info
 */
export function getZoneInfo(zone) {
    const zones = {
        green: {
            label: 'Green Zone',
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            description: 'Excellent! You are in the sustainable zone.',
        },
        improving: {
            label: 'Improving',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100',
            description: 'Good progress! Keep improving.',
        },
        high_impact: {
            label: 'High Impact',
            color: 'text-red-600',
            bgColor: 'bg-red-100',
            description: 'Needs attention. See tips to improve.',
        },
    };
    
    return zones[zone] || zones.improving;
}

/**
 * Transform leaderboard entry
 */
export function transformLeaderboardEntry(entry, index) {
    return {
        rank: entry.rank || index + 1,
        userId: entry.userId || entry._id,
        name: entry.userName || entry.name || `Flat ${entry.flatNumber}`,
        flatNumber: entry.flatNumber || entry.flat,
        score: entry.currentMonthScore || entry.currentScore || 0,
        zone: entry.zone || 'improving',
    };
}

// =============================================================================
// API CALLS
// =============================================================================

/**
 * Get current user's latest points
 * @returns {Promise<Object>} Current points breakdown
 */
export async function getCurrentPoints() {
    const response = await api.get('/api/points/current');
    return transformCurrentPoints(response);
}

/**
 * Get user's points history
 * @returns {Promise<Array>} Array of monthly points records
 */
export async function getPointsHistory() {
    const response = await api.get('/api/points/history');
    
    return (response.history || []).map(record => ({
        period: record.billingPeriod,
        periodFormatted: formatBillingPeriod(record.billingPeriod),
        score: record.totalMonthlyScore,
        breakdown: record.scores,
        zone: record.zone,
    }));
}

/**
 * Get lifetime score and statistics
 * @returns {Promise<Object>} Lifetime statistics
 */
export async function getLifetimeStats() {
    const response = await api.get('/api/points/lifetime');
    
    return {
        lifetimeScore: response.lifetimeScore || 0,
        monthsTracked: response.monthsTracked || 0,
        averageScore: response.averageMonthlyScore || 0,
        zoneDistribution: response.zoneDistribution || {},
    };
}

/**
 * Get society leaderboard
 * @param {string} societyId - Society ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Leaderboard data
 */
export async function getLeaderboard(societyId, options = {}) {
    const { period, limit = 10 } = options;
    
    let endpoint = `/api/points/leaderboard/${societyId}?limit=${limit}`;
    if (period) {
        endpoint += `&period=${period}`;
    }
    
    const response = await api.get(endpoint);
    
    return {
        period: response.period,
        periodFormatted: formatBillingPeriod(response.period),
        leaderboard: (response.leaderboard || []).map(transformLeaderboardEntry),
        totalParticipants: response.totalParticipants || 0,
    };
}

/**
 * Calculate points for a consumption record (admin use)
 * @param {string} recordId - Consumption record ID
 * @param {Object} options - Calculation options
 * @returns {Promise<Object>} Calculated points
 */
export async function calculatePoints(recordId, options = {}) {
    return api.post(`/api/points/calculate/${recordId}`, options);
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
    getCurrentPoints,
    getPointsHistory,
    getLifetimeStats,
    getLeaderboard,
    calculatePoints,
    transformCurrentPoints,
    formatBillingPeriod,
    getZoneInfo,
};
