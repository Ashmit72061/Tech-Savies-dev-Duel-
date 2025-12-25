const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const ConsumptionRecord = require('../models/consumptionRecord');
const User = require('../models/user');

// ============================================================================
// POST /api/consumption/submit
// Submit new consumption record
// ============================================================================
router.post('/submit', fetchUser, async (req, res) => {
    try {
        const { building, flatNumber, billingPeriod, electricity, water, wasteSegregation } = req.body;
        
        console.log('Consumption submit request:', { 
            userId: req.user?.id, 
            billingPeriod, 
            electricity, 
            water 
        });
        
        // Validate required fields
        if (!billingPeriod || electricity === undefined || water === undefined) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                required: ['billingPeriod', 'electricity', 'water']
            });
        }
        
        // Get user's society (optional)
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        console.log('User found:', { userId: user._id, flat: user.flat, society: user.society });
        
        // Check for duplicate submission
        const existing = await ConsumptionRecord.findOne({
            user: req.user.id,
            billingPeriod: billingPeriod
        });
        
        if (existing) {
            return res.status(400).json({ 
                error: 'Record already exists for this billing period',
                existingRecord: existing._id
            });
        }
        
        // Create new record - society is optional
        const recordData = {
            user: req.user.id,
            building: building || '',
            flatNumber: flatNumber || user.flat,
            billingPeriod,
            electricity: Number(electricity),
            water: Number(water),
            wasteSegregation: wasteSegregation || 'yes',
            status: 'pending'
        };
        
        // Only add society if user has one
        if (user.society) {
            recordData.society = user.society;
        }
        
        console.log('Creating record:', recordData);
        
        const record = new ConsumptionRecord(recordData);
        await record.save();
        
        console.log('Record saved successfully:', record._id);
        
        res.status(201).json({
            success: true,
            record: record,
            message: 'Consumption record submitted successfully'
        });
        
    } catch (error) {
        console.error('Submit consumption error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// ============================================================================
// GET /api/consumption/history
// Get user's consumption history
// ============================================================================
router.get('/history', fetchUser, async (req, res) => {
    try {
        const { limit = 10, status, period } = req.query;
        
        // Build query
        const query = { user: req.user.id };
        if (status) query.status = status;
        if (period) query.billingPeriod = period;
        
        const records = await ConsumptionRecord.find(query)
            .sort({ billingPeriod: -1, createdAt: -1 })
            .limit(parseInt(limit));
        
        res.json({
            success: true,
            records: records,
            count: records.length
        });
        
    } catch (error) {
        console.error('Get history error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ============================================================================
// GET /api/consumption/latest
// Get user's latest consumption record
// ============================================================================
router.get('/latest', fetchUser, async (req, res) => {
    try {
        const record = await ConsumptionRecord.findOne({ user: req.user.id })
            .sort({ billingPeriod: -1, createdAt: -1 });
        
        if (!record) {
            return res.status(404).json({ 
                error: 'No consumption records found',
                record: null
            });
        }
        
        res.json({
            success: true,
            record: record
        });
        
    } catch (error) {
        console.error('Get latest error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ============================================================================
// GET /api/consumption/:id
// Get consumption record by ID
// ============================================================================
router.get('/:id', fetchUser, async (req, res) => {
    try {
        const record = await ConsumptionRecord.findById(req.params.id);
        
        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }
        
        // Check ownership
        if (record.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        res.json({
            success: true,
            record: record
        });
        
    } catch (error) {
        console.error('Get record error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ============================================================================
// PUT /api/consumption/:id
// Update consumption record (only if pending)
// ============================================================================
router.put('/:id', fetchUser, async (req, res) => {
    try {
        const record = await ConsumptionRecord.findById(req.params.id);
        
        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }
        
        // Check ownership
        if (record.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        // Only allow updates to pending records
        if (record.status !== 'pending') {
            return res.status(400).json({ 
                error: 'Cannot modify approved or rejected records',
                status: record.status
            });
        }
        
        // Update allowed fields
        const { electricity, water, wasteSegregation, building, flatNumber } = req.body;
        
        if (electricity !== undefined) record.electricity = Number(electricity);
        if (water !== undefined) record.water = Number(water);
        if (wasteSegregation !== undefined) record.wasteSegregation = wasteSegregation;
        if (building !== undefined) record.building = building;
        if (flatNumber !== undefined) record.flatNumber = flatNumber;
        
        await record.save();
        
        res.json({
            success: true,
            record: record,
            message: 'Record updated successfully'
        });
        
    } catch (error) {
        console.error('Update record error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ============================================================================
// GET /api/consumption/trends (Society-level aggregation)
// Get consumption trends for charts
// ============================================================================
router.get('/society/trends', fetchUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.society) {
            return res.status(400).json({ error: 'User not in a society' });
        }
        
        const { months = 6 } = req.query;
        
        // Aggregate monthly data
        const trends = await ConsumptionRecord.aggregate([
            { 
                $match: { 
                    society: user.society,
                    status: 'approved'
                } 
            },
            {
                $group: {
                    _id: '$billingPeriod',
                    totalElectricity: { $sum: '$electricity' },
                    totalWater: { $sum: '$water' },
                    recordCount: { $sum: 1 }
                }
            },
            { $sort: { _id: -1 } },
            { $limit: parseInt(months) }
        ]);
        
        // Format for charts
        const formattedTrends = trends.reverse().map(t => ({
            month: formatPeriodShort(t._id),
            period: t._id,
            energy: t.totalElectricity,
            water: t.totalWater,
            participants: t.recordCount
        }));
        
        res.json({
            success: true,
            trends: formattedTrends
        });
        
    } catch (error) {
        console.error('Get trends error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Helper to format period (2023-10 → Oct)
function formatPeriodShort(period) {
    if (!period) return '';
    const [year, month] = period.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short' });
}

module.exports = router;
