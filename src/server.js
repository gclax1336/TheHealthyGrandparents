require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// CORS configuration for production
const allowedOrigins = [
    'http://localhost:3000',
    'http://thehealthygrandparent-frontend-20250621202452.s3-website-us-east-1.amazonaws.com'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Import and use your routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));