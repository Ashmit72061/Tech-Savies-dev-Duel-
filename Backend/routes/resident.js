const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const Unit = require('../models/unit');
const User = require('../models/user');

// POST: /api/resident/input
router.post('/input', fetchUser, async (req, res) => {
    try {
        const { date, electricityUsage, waterUsage } = req.body;

        // 1. Save data to Unit Schema
        const newUnit = new Unit({
            user: req.user.id,
            date,
            electricityUsage,
            waterUsage
        });
        const savedUnit = await newUnit.save();

        // 2. Store the data of usage and user info in User Schema (as requested)
        await User.findByIdAndUpdate(req.user.id, {
            $push: { 
                usageHistory: {
                    unitId: savedUnit._id,
                    date: savedUnit.date,
                    electricityUsage: savedUnit.electricityUsage,
                    waterUsage: savedUnit.waterUsage
                } 
            }
        });

        res.json({ success: true, unit: savedUnit });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;