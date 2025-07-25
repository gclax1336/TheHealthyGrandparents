    require('dotenv').config();
    const express = require('express');
    const cors = require('cors');
    const app = express();

    // CORS configuration for production
    const allowedOrigins = [
        'http://localhost:3000',
        'https://thehealthygrandparent.com',
        'https://www.thehealthygrandparent.com'
    ];

    app.use(cors({
        origin: function (origin, callback) {
            // allow requests with no origin (like mobile apps, curl, etc.)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) !== -1) {
                return callback(null, true);
            } else {
                return callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    }));
    app.use(express.json());

    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/users', require('./routes/users'));
    app.use('/api/payment', require('./routes/payment'));

    // Health check
    app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));