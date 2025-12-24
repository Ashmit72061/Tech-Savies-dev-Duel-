const jwt = require('jsonwebtoken');

const fetchUser = (req, res, next) => {
    // Get the token from header
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ error: "Access Denied. Please authenticate." });
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Invalid Token" });
    }
}

module.exports = fetchUser;