const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const CommunityGoal = require('../models/communityGoal');
const User = require('../models/user');

// ============================================================================
// GET /api/goals/active
// Get active community goals for user's society
// ============================================================================
router.get('/active', fetchUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        // If user has no society, return empty goals array gracefully
        if (!user || !user.society) {
            return res.json({
                success: true,
                goals: [],
                count: 0,
                message: 'User not associated with a society'
            });
        }
        
        const goals = await CommunityGoal.find({
            society: user.society,
            status: 'active'
        }).sort({ isPriority: -1, endDate: 1 });
        
        // Add isJoined flag for current user
        const goalsWithJoinStatus = goals.map(goal => {
            const goalObj = goal.toObject({ virtuals: true });
            goalObj.isJoined = goal.participants.some(
                p => p.toString() === req.user.id
            );
            return goalObj;
        });
        
        res.json({
            success: true,
            goals: goalsWithJoinStatus,
            count: goals.length
        });
        
    } catch (error) {
        console.error('Get active goals error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ============================================================================
// GET /api/goals/:id
// Get goal by ID
// ============================================================================
router.get('/:id', fetchUser, async (req, res) => {
    try {
        const goal = await CommunityGoal.findById(req.params.id)
            .populate('participants', 'name flat');
        
        if (!goal) {
            return res.status(404).json({ error: 'Goal not found' });
        }
        
        const goalObj = goal.toObject({ virtuals: true });
        goalObj.isJoined = goal.participants.some(
            p => p._id.toString() === req.user.id
        );
        
        res.json({
            success: true,
            goal: goalObj
        });
        
    } catch (error) {
        console.error('Get goal error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ============================================================================
// POST /api/goals/:id/join
// Join a community goal
// ============================================================================
router.post('/:id/join', fetchUser, async (req, res) => {
    try {
        const goal = await CommunityGoal.findById(req.params.id);
        
        if (!goal) {
            return res.status(404).json({ error: 'Goal not found' });
        }
        
        if (goal.status !== 'active') {
            return res.status(400).json({ error: 'Cannot join inactive goal' });
        }
        
        // Check if already joined
        const alreadyJoined = goal.participants.some(
            p => p.toString() === req.user.id
        );
        
        if (alreadyJoined) {
            return res.status(400).json({ error: 'Already participating in this goal' });
        }
        
        // Add user to participants
        goal.participants.push(req.user.id);
        await goal.save();
        
        const goalObj = goal.toObject({ virtuals: true });
        goalObj.isJoined = true;
        
        res.json({
            success: true,
            goal: goalObj,
            message: 'Successfully joined the goal'
        });
        
    } catch (error) {
        console.error('Join goal error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ============================================================================
// POST /api/goals/:id/leave
// Leave a community goal
// ============================================================================
router.post('/:id/leave', fetchUser, async (req, res) => {
    try {
        const goal = await CommunityGoal.findById(req.params.id);
        
        if (!goal) {
            return res.status(404).json({ error: 'Goal not found' });
        }
        
        // Remove user from participants
        goal.participants = goal.participants.filter(
            p => p.toString() !== req.user.id
        );
        await goal.save();
        
        const goalObj = goal.toObject({ virtuals: true });
        goalObj.isJoined = false;
        
        res.json({
            success: true,
            goal: goalObj,
            message: 'Successfully left the goal'
        });
        
    } catch (error) {
        console.error('Leave goal error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ============================================================================
// GET /api/goals/:id/progress
// Get goal progress details
// ============================================================================
router.get('/:id/progress', fetchUser, async (req, res) => {
    try {
        const goal = await CommunityGoal.findById(req.params.id)
            .populate('participants', 'name flat currentScore');
        
        if (!goal) {
            return res.status(404).json({ error: 'Goal not found' });
        }
        
        res.json({
            success: true,
            currentValue: goal.currentValue,
            targetValue: goal.targetValue,
            percentage: goal.completionPercentage,
            participants: goal.participants,
            daysRemaining: goal.daysRemaining
        });
        
    } catch (error) {
        console.error('Get progress error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
