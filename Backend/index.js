const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: "*",
    credentials: true,
}));
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/resident', require('./routes/resident'));
app.use('/api/test', require('./routes/test'));

app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
});