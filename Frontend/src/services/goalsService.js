/**
 * Goals Service
 * 
 * API calls for community goals and challenges.
 * Used by: CommunityGoalsPage
 */

import api, { validateResponse } from './api';

// =============================================================================
// DATA TRANSFORMERS
// =============================================================================

/**
 * Transform goal for display
 */
export function transformGoal(goal) {
    if (!goal) return null;
    
    const completionPercentage = goal.targetValue > 0
        ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
        : 0;
    
    const daysRemaining = calculateDaysRemaining(goal.endDate);
    
    return {
        id: goal._id || goal.id,
        title: goal.title,
        description: goal.description || '',
        type: goal.type,
        typeIcon: getTypeIcon(goal.type),
        targetValue: goal.targetValue,
        targetUnit: goal.targetUnit || '',
        currentValue: goal.currentValue || 0,
        completionPercentage,
        participantCount: goal.participants?.length || 0,
        startDate: goal.startDate,
        endDate: goal.endDate,
        daysRemaining,
        isPriority: goal.isPriority || false,
        status: goal.status || 'active',
        isJoined: goal.isJoined || false,
    };
}

/**
 * Calculate days remaining until end date
 */
function calculateDaysRemaining(endDate) {
    if (!endDate) return 0;
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

/**
 * Get icon name for goal type
 */
function getTypeIcon(type) {
    const icons = {
        energy: 'bolt',
        water: 'water_drop',
        waste: 'recycling',
        event: 'event',
    };
    return icons[type] || 'eco';
}

/**
 * Get type color classes
 */
export function getTypeColors(type) {
    const colors = {
        energy: { bg: 'bg-yellow-100', text: 'text-yellow-600', dark: 'dark:bg-yellow-900/20' },
        water: { bg: 'bg-blue-100', text: 'text-blue-600', dark: 'dark:bg-blue-900/20' },
        waste: { bg: 'bg-green-100', text: 'text-green-600', dark: 'dark:bg-green-900/20' },
        event: { bg: 'bg-purple-100', text: 'text-purple-600', dark: 'dark:bg-purple-900/20' },
    };
    return colors[type] || colors.event;
}

// =============================================================================
// API CALLS
// =============================================================================

/**
 * Get active community goals for user's society
 * @returns {Promise<Object>} Goals data with priority and active lists
 */
export async function getActiveGoals() {
    const response = await api.get('/api/goals/active');
    
    const goals = (response.goals || []).map(transformGoal);
    
    // Separate priority and regular goals
    const priorityGoal = goals.find(g => g.isPriority) || goals[0] || null;
    const activeGoals = goals.filter(g => !g.isPriority || g.id !== priorityGoal?.id);
    
    return {
        priorityGoal,
        activeGoals,
        totalCount: goals.length,
    };
}

/**
 * Get goal by ID
 * @param {string} goalId - Goal ID
 * @returns {Promise<Object>} Goal details
 */
export async function getGoalById(goalId) {
    const response = await api.get(`/api/goals/${goalId}`);
    return transformGoal(response.goal);
}

/**
 * Join a community goal
 * @param {string} goalId - Goal ID
 * @returns {Promise<Object>} Updated goal
 */
export async function joinGoal(goalId) {
    const response = await api.post(`/api/goals/${goalId}/join`);
    return transformGoal(response.goal);
}

/**
 * Leave a community goal
 * @param {string} goalId - Goal ID
 * @returns {Promise<Object>} Updated goal
 */
export async function leaveGoal(goalId) {
    const response = await api.post(`/api/goals/${goalId}/leave`);
    return transformGoal(response.goal);
}

/**
 * Get goal progress/participants
 * @param {string} goalId - Goal ID
 * @returns {Promise<Object>} Progress details
 */
export async function getGoalProgress(goalId) {
    const response = await api.get(`/api/goals/${goalId}/progress`);
    
    return {
        currentValue: response.currentValue || 0,
        targetValue: response.targetValue || 0,
        percentage: response.percentage || 0,
        participants: response.participants || [],
        recentContributions: response.recentContributions || [],
    };
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
    getActiveGoals,
    getGoalById,
    joinGoal,
    leaveGoal,
    getGoalProgress,
    transformGoal,
    getTypeColors,
};
