/**
 * Points Service
 * Implements the EcoScore Points Algorithm from points-allocation-algo.md
 * 
 * Core Philosophy:
 * - Goal: Reward improvement and sustainability, not punish consumption
 * - Principle: Points should feel achievable (10-100 range)
 * - Focus: Month-over-month progress matters more than absolute values
 */

// ============================================================================
// CONSTANTS
// ============================================================================

const BASELINES = {
    ELECTRICITY_KWH_PER_PERSON: 100,  // National average (India context)
    WATER_LITERS_PER_PERSON: 3000     // National average (India context)
};

const CHALLENGES = {
    zero_waste_week: {
        points: 15,
        description: 'Maintain compliant waste segregation during Zero Waste Week',
        frequency: 'monthly'
    },
    electricity_reduction_10: {
        points: 10,
        description: 'Reduce electricity usage by 10% from previous month',
        frequency: 'monthly'
    },
    water_reduction_10: {
        points: 10,
        description: 'Reduce water usage by 10% from previous month',
        frequency: 'monthly'
    },
    green_zone_streak_3: {
        points: 25,
        description: 'Stay in Green Zone for 3 consecutive months',
        frequency: 'quarterly'
    },
    society_goal_achieved: {
        points: 20,
        description: 'Society monthly goal achieved',
        frequency: 'varies'
    },
    first_perfect_score: {
        points: 30,
        description: 'Achieve a perfect base score of 100 for the first time',
        frequency: 'one-time'
    },
    consistent_improver_6: {
        points: 40,
        description: 'Improve score for 6 consecutive months',
        frequency: 'bi-annual'
    }
};

// ============================================================================
// SCORE CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate electricity score (0-40 points)
 * Uses efficiency bands based on per-capita usage
 * 
 * @param {number} kWh - Total electricity usage in kWh
 * @param {number} residents - Number of residents in flat
 * @returns {number} Score between 0-40
 */
function calculateElectricityScore(kWh, residents) {
    if (!kWh || !residents || residents <= 0) return 0;
    
    const normalized = kWh / residents;
    const ratio = normalized / BASELINES.ELECTRICITY_KWH_PER_PERSON;
    
    if (ratio <= 0.60) return 40;  // Excellent
    if (ratio <= 0.80) return 35;  // Good
    if (ratio <= 1.00) return 30;  // Average
    if (ratio <= 1.20) return 25;  // High
    if (ratio <= 1.50) return 15;  // Very High
    return 10;                      // Excessive
}

/**
 * Calculate water score (0-40 points)
 * Uses efficiency bands based on per-capita usage
 * 
 * @param {number} liters - Total water usage in liters
 * @param {number} residents - Number of residents in flat
 * @returns {number} Score between 0-40
 */
function calculateWaterScore(liters, residents) {
    if (!liters || !residents || residents <= 0) return 0;
    
    const normalized = liters / residents;
    const ratio = normalized / BASELINES.WATER_LITERS_PER_PERSON;
    
    if (ratio <= 0.60) return 40;  // Excellent
    if (ratio <= 0.80) return 35;  // Good
    if (ratio <= 1.00) return 30;  // Average
    if (ratio <= 1.20) return 25;  // High
    if (ratio <= 1.50) return 15;  // Very High
    return 10;                      // Excessive
}

/**
 * Calculate waste segregation score (0-20 points)
 * Simple categorical scoring
 * 
 * @param {string} status - 'compliant', 'partial', or 'non-compliant' (or 'yes', 'partial', 'no')
 * @returns {number} Score between 0-20
 */
function calculateWasteScore(status) {
    const normalizedStatus = normalizeWasteStatus(status);
    const scores = {
        'compliant': 20,
        'partial': 10,
        'non-compliant': 0
    };
    return scores[normalizedStatus] || 0;
}

/**
 * Normalize waste status from different input formats
 * @param {string} status - Input status
 * @returns {string} Normalized status
 */
function normalizeWasteStatus(status) {
    if (!status) return 'non-compliant';
    const lower = status.toLowerCase();
    if (lower === 'yes' || lower === 'compliant') return 'compliant';
    if (lower === 'partial') return 'partial';
    return 'non-compliant';
}

/**
 * Determine zone classification based on base score
 * 
 * @param {number} score - Base score (0-100)
 * @returns {string} Zone: 'green', 'improving', or 'high_impact'
 */
function determineZone(score) {
    if (score >= 80) return 'green';       // 80-100: Sustainable
    if (score >= 60) return 'improving';   // 60-79: On the right track
    return 'high_impact';                  // 0-59: Needs attention
}

/**
 * Calculate monthly base score (0-100 points)
 * Combines electricity, water, and waste scores
 * 
 * @param {Object} data - Consumption data
 * @param {number} data.electricity_kwh - Electricity in kWh
 * @param {number} data.water_liters - Water in liters
 * @param {string} data.waste_status - Waste segregation status
 * @param {number} data.residents - Number of residents
 * @returns {Object} Score breakdown
 */
function calculateMonthlyBaseScore(data) {
    const electricityScore = calculateElectricityScore(
        data.electricity_kwh || data.electricity,
        data.residents
    );
    
    const waterScore = calculateWaterScore(
        data.water_liters || data.water,
        data.residents
    );
    
    const wasteScore = calculateWasteScore(data.waste_status || data.wasteStatus);
    
    const baseScore = electricityScore + waterScore + wasteScore;
    
    return {
        electricity: electricityScore,
        water: waterScore,
        waste: wasteScore,
        total: baseScore,
        zone: determineZone(baseScore)
    };
}

// ============================================================================
// IMPROVEMENT BONUS
// ============================================================================

/**
 * Calculate improvement bonus based on month-over-month comparison
 * Max bonus: 10 points
 * 
 * @param {Object} currentMonth - Current month's score breakdown
 * @param {Object} previousMonth - Previous month's score breakdown
 * @returns {number} Bonus points (0-10)
 */
function calculateImprovementBonus(currentMonth, previousMonth) {
    if (!previousMonth) return 0;
    
    let bonus = 0;
    
    // Electricity improvement (max +5 bonus)
    const elecImprovement = currentMonth.electricity - (previousMonth.electricity || 0);
    if (elecImprovement > 0) {
        bonus += Math.min(5, Math.floor(elecImprovement / 2));
    }
    
    // Water improvement (max +5 bonus)
    const waterImprovement = currentMonth.water - (previousMonth.water || 0);
    if (waterImprovement > 0) {
        bonus += Math.min(5, Math.floor(waterImprovement / 2));
    }
    
    // Waste improvement (fixed +3 bonus)
    if (currentMonth.waste > (previousMonth.waste || 0)) {
        bonus += 3;
    }
    
    return Math.min(bonus, 10); // Cap at 10 bonus points
}

// ============================================================================
// CHALLENGE POINTS
// ============================================================================

/**
 * Check and calculate challenge points
 * 
 * @param {Object} currentData - Current month's consumption data
 * @param {Object} previousData - Previous month's consumption data (optional)
 * @param {Array} history - Array of past points records
 * @param {Object} societyData - Society-level data (optional)
 * @returns {Object} Challenge points and completed challenges list
 */
function calculateChallengePoints(currentData, previousData, history = [], societyData = {}) {
    let challengePoints = 0;
    const completedChallenges = [];
    
    // 1. Zero Waste Week (if special event flag is set)
    if (currentData.waste_status === 'compliant' && currentData.special_event === 'zero_waste_week') {
        challengePoints += CHALLENGES.zero_waste_week.points;
        completedChallenges.push('zero_waste_week');
    }
    
    // 2. Electricity Reduction 10%
    if (previousData && previousData.electricity_kwh > 0) {
        const elecReduction = (previousData.electricity_kwh - currentData.electricity_kwh) / previousData.electricity_kwh;
        if (elecReduction >= 0.10) {
            challengePoints += CHALLENGES.electricity_reduction_10.points;
            completedChallenges.push('electricity_reduction_10');
        }
    }
    
    // 3. Water Reduction 10%
    if (previousData && previousData.water_liters > 0) {
        const waterReduction = (previousData.water_liters - currentData.water_liters) / previousData.water_liters;
        if (waterReduction >= 0.10) {
            challengePoints += CHALLENGES.water_reduction_10.points;
            completedChallenges.push('water_reduction_10');
        }
    }
    
    // 4. Green Zone Streak (3 months)
    if (history.length >= 2) {
        const last3 = history.slice(-2);
        const allGreen = last3.every(month => month.zone === 'green');
        const currentGreen = currentData.zone === 'green';
        if (allGreen && currentGreen) {
            // Check if not already awarded recently
            const recentlyAwarded = history.slice(-3).some(
                h => h.completedChallenges && h.completedChallenges.includes('green_zone_streak_3')
            );
            if (!recentlyAwarded) {
                challengePoints += CHALLENGES.green_zone_streak_3.points;
                completedChallenges.push('green_zone_streak_3');
            }
        }
    }
    
    // 5. Society Goal Achieved
    if (societyData && societyData.monthly_goal_achieved === true) {
        challengePoints += CHALLENGES.society_goal_achieved.points;
        completedChallenges.push('society_goal_achieved');
    }
    
    // 6. First Perfect Score (one-time)
    const currentBaseScore = currentData.baseScore || currentData.total || 0;
    if (currentBaseScore === 100) {
        const previousPerfect = history.some(m => (m.scores?.base || m.total) === 100);
        if (!previousPerfect) {
            challengePoints += CHALLENGES.first_perfect_score.points;
            completedChallenges.push('first_perfect_score');
        }
    }
    
    // 7. Consistent Improver (6 months)
    if (history.length >= 5) {
        const last5 = history.slice(-5);
        let allImproving = true;
        for (let i = 1; i < 5; i++) {
            const prev = last5[i - 1].totalMonthlyScore || last5[i - 1].total || 0;
            const curr = last5[i].totalMonthlyScore || last5[i].total || 0;
            if (curr <= prev) {
                allImproving = false;
                break;
            }
        }
        const currentTotal = currentData.totalMonthlyScore || currentData.total || 0;
        const lastTotal = last5[4].totalMonthlyScore || last5[4].total || 0;
        if (allImproving && currentTotal > lastTotal) {
            challengePoints += CHALLENGES.consistent_improver_6.points;
            completedChallenges.push('consistent_improver_6');
        }
    }
    
    return { challengePoints, completedChallenges };
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate entry for suspicious changes (anti-gaming)
 * Flags entries with >50% change from previous month
 * 
 * @param {Object} current - Current consumption data
 * @param {Object} previous - Previous consumption data
 * @returns {Object} Validation result with warnings
 */
function validateEntry(current, previous) {
    const warnings = [];
    
    if (!previous) {
        return { valid: true, warnings };
    }
    
    // Check for suspicious electricity change
    if (previous.electricity_kwh && previous.electricity_kwh > 0) {
        const elecChange = Math.abs(current.electricity_kwh - previous.electricity_kwh) / previous.electricity_kwh;
        if (elecChange > 0.50) {
            warnings.push('Electricity usage changed by >50%');
        }
    }
    
    // Check for suspicious water change
    if (previous.water_liters && previous.water_liters > 0) {
        const waterChange = Math.abs(current.water_liters - previous.water_liters) / previous.water_liters;
        if (waterChange > 0.50) {
            warnings.push('Water usage changed by >50%');
        }
    }
    
    return {
        valid: warnings.length === 0,
        warnings
    };
}

// ============================================================================
// TOTAL SCORE CALCULATION
// ============================================================================

/**
 * Calculate complete score for a month
 * Combines base score, improvement bonus, and challenge points
 * 
 * @param {Object} currentData - Current consumption data
 * @param {Object} previousData - Previous consumption data (optional)
 * @param {Array} history - Array of past points records
 * @param {Object} societyData - Society-level data (optional)
 * @returns {Object} Complete score breakdown
 */
function calculateTotalScore(currentData, previousData, history = [], societyData = {}) {
    // 1. Calculate base score (0-100)
    const baseScore = calculateMonthlyBaseScore(currentData);
    
    // 2. Get previous month's scores for improvement calculation
    const previousScores = previousData ? {
        electricity: previousData.scores?.electricity || 0,
        water: previousData.scores?.water || 0,
        waste: previousData.scores?.waste || 0
    } : null;
    
    // 3. Calculate improvement bonus (0-10)
    const improvementBonus = calculateImprovementBonus(baseScore, previousScores);
    
    // 4. Prepare data for challenge calculation
    const dataForChallenges = {
        ...currentData,
        zone: baseScore.zone,
        baseScore: baseScore.total
    };
    
    const prevDataForChallenges = previousData ? {
        electricity_kwh: previousData.inputData?.electricity || 0,
        water_liters: previousData.inputData?.water || 0
    } : null;
    
    // 5. Calculate challenge points
    const { challengePoints, completedChallenges } = calculateChallengePoints(
        dataForChallenges,
        prevDataForChallenges,
        history,
        societyData
    );
    
    // 6. Validate entry
    const prevInputData = previousData ? {
        electricity_kwh: previousData.inputData?.electricity || 0,
        water_liters: previousData.inputData?.water || 0
    } : null;
    
    const validation = validateEntry({
        electricity_kwh: currentData.electricity_kwh || currentData.electricity,
        water_liters: currentData.water_liters || currentData.water
    }, prevInputData);
    
    // 7. Calculate total monthly score
    const totalMonthlyScore = baseScore.total + improvementBonus + challengePoints;
    
    return {
        baseScore: baseScore.total,
        breakdown: {
            electricity: baseScore.electricity,
            water: baseScore.water,
            waste: baseScore.waste
        },
        improvementBonus,
        challengePoints,
        completedChallenges,
        totalMonthlyScore,
        zone: baseScore.zone,
        validation
    };
}

// ============================================================================
// LIFETIME SCORE
// ============================================================================

/**
 * Calculate lifetime cumulative score
 * 
 * @param {Array} monthlyScores - Array of monthly score records
 * @returns {number} Total lifetime score
 */
function calculateLifetimeScore(monthlyScores) {
    if (!monthlyScores || !Array.isArray(monthlyScores)) return 0;
    return monthlyScores.reduce((sum, month) => {
        return sum + (month.totalMonthlyScore || month.score || 0);
    }, 0);
}

// ============================================================================
// LEADERBOARD
// ============================================================================

/**
 * Generate society leaderboard
 * 
 * @param {Array} flats - Array of flat data with scores
 * @param {number} limit - Number of top performers to show (default 10)
 * @returns {Array} Sorted leaderboard
 */
function getSocietyLeaderboard(flats, limit = 10) {
    return flats
        .map(flat => ({
            flatNumber: flat.flatNumber || flat.flat,
            userId: flat.userId || flat._id,
            userName: flat.userName || flat.name,
            currentMonthScore: flat.currentScore || flat.totalMonthlyScore || 0,
            lifetimeScore: flat.lifetimeScore || 0,
            zone: flat.zone || 'improving',
            improvement: flat.improvement || 0
        }))
        .sort((a, b) => b.currentMonthScore - a.currentMonthScore)
        .slice(0, limit);
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
    // Constants
    BASELINES,
    CHALLENGES,
    
    // Core scoring functions
    calculateElectricityScore,
    calculateWaterScore,
    calculateWasteScore,
    normalizeWasteStatus,
    determineZone,
    calculateMonthlyBaseScore,
    
    // Bonus and challenge functions
    calculateImprovementBonus,
    calculateChallengePoints,
    
    // Validation
    validateEntry,
    
    // Main calculation
    calculateTotalScore,
    
    // Lifetime and leaderboard
    calculateLifetimeScore,
    getSocietyLeaderboard
};
