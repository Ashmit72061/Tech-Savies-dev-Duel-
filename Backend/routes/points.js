const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const PointsRecord = require('../models/pointsRecord');
const ConsumptionRecord = require('../models/consumptionRecord');
const User = require('../models/user');
const CommunityGoal = require('../models/communityGoal');
const pointsService = require('../services/pointsService');

// ============================================================================
// POST /api/points/calculate/:recordId
// Calculate points for an approved consumption record
// ============================================================================
router.post('/calculate/:recordId', fetchUser, async (req, res) => {
    try {
        const { recordId } = req.params;
        const { residents } = req.body;  // Optional: override resident count
        
        // 1. Get the consumption record
        const consumptionRecord = await ConsumptionRecord.findById(recordId);
        if (!consumptionRecord) {
            return res.status(404).json({ error: 'Consumption record not found' });
        }
        
        // 2. Verify the record is approved
        if (consumptionRecord.status !== 'approved') {
            return res.status(400).json({ 
                error: 'Only approved consumption records can be scored',
                currentStatus: consumptionRecord.status
            });
        }
        
        // 3. Check if points already calculated for this record
        const existingPoints = await PointsRecord.findOne({ 
            consumptionRecord: recordId 
        });
        if (existingPoints) {
            return res.status(400).json({ 
                error: 'Points already calculated for this record',
                pointsRecord: existingPoints
            });
        }
        
        // 4. Get previous month's points record for improvement calculation
        const previousPoints = await PointsRecord.findOne({
            user: consumptionRecord.user,
            billingPeriod: { $lt: consumptionRecord.billingPeriod }
        }).sort({ billingPeriod: -1 });
        
        // 5. Get points history for challenge calculations
        const pointsHistory = await PointsRecord.find({
            user: consumptionRecord.user
        }).sort({ billingPeriod: 1 });
        
        // 6. Check society goal status
        const societyGoal = await CommunityGoal.findOne({
            society: consumptionRecord.society,
            status: 'completed'
        }).sort({ updatedAt: -1 });
        
        const societyData = {
            monthly_goal_achieved: societyGoal ? true : false
        };
        
        // 7. Prepare consumption data for scoring
        const numResidents = residents || 4;  // Default to 4 if not provided
        const currentData = {
            electricity_kwh: consumptionRecord.electricity,
            water_liters: consumptionRecord.water,
            waste_status: pointsService.normalizeWasteStatus(consumptionRecord.wasteSegregation),
            residents: numResidents
        };
        
        // 8. Calculate total score
        const scoreResult = pointsService.calculateTotalScore(
            currentData,
            previousPoints,
            pointsHistory,
            societyData
        );
        
        // 9. Create points record
        const pointsRecord = new PointsRecord({
            user: consumptionRecord.user,
            society: consumptionRecord.society,
            consumptionRecord: consumptionRecord._id,
            billingPeriod: consumptionRecord.billingPeriod,
            inputData: {
                electricity: consumptionRecord.electricity,
                water: consumptionRecord.water,
                wasteStatus: pointsService.normalizeWasteStatus(consumptionRecord.wasteSegregation),
                residents: numResidents
            },
            scores: {
                electricity: scoreResult.breakdown.electricity,
                water: scoreResult.breakdown.water,
                waste: scoreResult.breakdown.waste,
                base: scoreResult.baseScore
            },
            improvementBonus: scoreResult.improvementBonus,
            challengePoints: scoreResult.challengePoints,
            completedChallenges: scoreResult.completedChallenges,
            totalMonthlyScore: scoreResult.totalMonthlyScore,
            zone: scoreResult.zone,
            validation: scoreResult.validation
        });
        
        await pointsRecord.save();
        
        // 10. Update user's current score and score history
        const allUserPoints = await PointsRecord.find({ 
            user: consumptionRecord.user 
        });
        const lifetimeScore = pointsService.calculateLifetimeScore(allUserPoints);
        
        await User.findByIdAndUpdate(consumptionRecord.user, {
            currentScore: scoreResult.totalMonthlyScore,
            lifetimeScore: lifetimeScore,
            $push: {
                scoreHistory: {
                    period: consumptionRecord.billingPeriod,
                    score: scoreResult.totalMonthlyScore,
                    breakdown: scoreResult.breakdown,
                    improvementBonus: scoreResult.improvementBonus,
                    challengePoints: scoreResult.challengePoints,
                    completedChallenges: scoreResult.completedChallenges,
                    zone: scoreResult.zone
                }
            }
        });
        
        res.json({
            success: true,
            pointsRecord: pointsRecord,
            lifetimeScore: lifetimeScore
        });
        
    } catch (error) {
        console.error('Points calculation error:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// ============================================================================
// GET /api/points/current
// Get current user's latest points
// ============================================================================
router.get('/current', fetchUser, async (req, res) => {
    try {
        const latestPoints = await PointsRecord.findOne({ 
            user: req.user.id 
        }).sort({ billingPeriod: -1 });
        
        if (!latestPoints) {
            return res.json({ 
                message: 'No points records found',
                currentScore: 0,
                zone: 'improving'
            });
        }
        
        res.json({
            currentScore: latestPoints.totalMonthlyScore,
            breakdown: latestPoints.scores,
            improvementBonus: latestPoints.improvementBonus,
            challengePoints: latestPoints.challengePoints,
            completedChallenges: latestPoints.completedChallenges,
            zone: latestPoints.zone,
            billingPeriod: latestPoints.billingPeriod
        });
        
    } catch (error) {
        console.error('Get current points error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ============================================================================
// GET /api/points/history
// Get user's points history
// ============================================================================
router.get('/history', fetchUser, async (req, res) => {
    try {
        const pointsHistory = await PointsRecord.find({ 
            user: req.user.id 
        }).sort({ billingPeriod: -1 });
        
        res.json({
            history: pointsHistory,
            count: pointsHistory.length
        });
        
    } catch (error) {
        console.error('Get points history error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ============================================================================
// GET /api/points/lifetime
// Get lifetime score for current user
// ============================================================================
router.get('/lifetime', fetchUser, async (req, res) => {
    try {
        const allPoints = await PointsRecord.find({ 
            user: req.user.id 
        });
        
        const lifetimeScore = pointsService.calculateLifetimeScore(allPoints);
        
        // Get some stats
        const monthCount = allPoints.length;
        const avgScore = monthCount > 0 
            ? Math.round(lifetimeScore / monthCount) 
            : 0;
        
        // Count zones
        const zoneCount = allPoints.reduce((acc, p) => {
            acc[p.zone] = (acc[p.zone] || 0) + 1;
            return acc;
        }, {});
        
        res.json({
            lifetimeScore,
            monthsTracked: monthCount,
            averageMonthlyScore: avgScore,
            zoneDistribution: zoneCount
        });
        
    } catch (error) {
        console.error('Get lifetime score error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ============================================================================
// GET /api/points/leaderboard/:societyId
// Get society leaderboard (societyId can be 'default' to use user's society)
// ============================================================================
router.get('/leaderboard/:societyId', async (req, res) => {
    try {
        let { societyId } = req.params;
        const { period, limit = 10 } = req.query;
        
        // Handle 'default' societyId - return empty leaderboard if no society
        if (societyId === 'default') {
            return res.json({ 
                leaderboard: [],
                period: null,
                totalParticipants: 0,
                message: 'No society specified'
            });
        }
        
        // Build query
        const query = { society: societyId };
        if (period) {
            query.billingPeriod = period;
        }
        
        // Get latest period if not specified
        let targetPeriod = period;
        if (!targetPeriod) {
            const latestRecord = await PointsRecord.findOne({ society: societyId })
                .sort({ billingPeriod: -1 });
            targetPeriod = latestRecord?.billingPeriod;
        }
        
        if (!targetPeriod) {
            return res.json({ 
                leaderboard: [],
                message: 'No points records found for this society'
            });
        }
        
        // Get all points for the period
        const pointsRecords = await PointsRecord.find({
            society: societyId,
            billingPeriod: targetPeriod
        }).populate('user', 'name flat');
        
        // Build leaderboard data
        const leaderboardData = pointsRecords.map(record => ({
            userId: record.user._id,
            userName: record.user.name,
            flatNumber: record.user.flat,
            currentScore: record.totalMonthlyScore,
            zone: record.zone,
            breakdown: record.scores
        }));
        
        // Sort and limit
        const leaderboard = pointsService.getSocietyLeaderboard(
            leaderboardData.map(d => ({
                ...d,
                currentMonthScore: d.currentScore
            })), 
            parseInt(limit)
        );
        
        // Add ranks
        leaderboard.forEach((entry, index) => {
            entry.rank = index + 1;
        });
        
        res.json({
            period: targetPeriod,
            leaderboard,
            totalParticipants: pointsRecords.length
        });
        
    } catch (error) {
        console.error('Get leaderboard error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ============================================================================
// GET /api/points/user/:userId
// Get points history for a specific user (admin use)
// ============================================================================
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const pointsHistory = await PointsRecord.find({ 
            user: userId 
        }).sort({ billingPeriod: -1 });
        
        const lifetimeScore = pointsService.calculateLifetimeScore(pointsHistory);
        
        res.json({
            userId,
            lifetimeScore,
            history: pointsHistory,
            count: pointsHistory.length
        });
        
    } catch (error) {
        console.error('Get user points error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
