const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/simpletest', async (req, res) => {
    try {
        const user = await User.find({});
        res.json(user);
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;