const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// --- USER AUTHENTICATION ---

// POST: /api/auth/createuser
router.post('/createuser', async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).json({ error: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            username: req.body.email.split('@')[0], // auto-generate from email
            email: req.body.email,
            password: secPassword,
            flat: req.body.flat,
            society: req.body.society
        });

        const data = { user: { id: user.id } };
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ authtoken, id: user.id });
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

// GET: /api/auth/resident
router.get('/resident', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

// POST: /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid Credentials" });

        const passCompare = await bcrypt.compare(password, user.password);
        if (!passCompare) return res.status(400).json({ error: "Invalid Credentials" });

        const data = { user: { id: user.id } };
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ authtoken, id: user.id });
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

// --- ADMIN AUTHENTICATION ---

// POST: /api/auth/admin/register
router.post('/admin/register', async (req, res) => {
    try {
        let admin = await Admin.findOne({ email: req.body.email });
        if (admin) return res.status(400).json({ error: "Admin already exists" });

        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(req.body.password, salt);

        admin = await Admin.create({
            username: req.body.username,
            password: secPassword,
            email: req.body.email,
        });

        const data = { admin: { id: admin.id } };
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ authtoken });
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

// POST: /api/auth/admin/login
router.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({ error: "Invalid Admin Credentials" });

        const passCompare = await bcrypt.compare(password, admin.password);
        if (!passCompare) return res.status(400).json({ error: "Invalid Admin Credentials" });

        const data = { admin: { id: admin.id } };
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ authtoken, id: admin.id });
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;