require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./config/logger');

const app = express();

// Security & parsing
app.use(helmet());
app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    'https://study-sync-eight-psi.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Rate limiting
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/search', require('./routes/search'));
app.use('/api/tags', require('./routes/tags'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/upload', require('./routes/upload'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Keep-alive ping for Render free tier
if (process.env.NODE_ENV === 'production') {
  setInterval(() => {
    const url = process.env.RENDER_EXTERNAL_URL || `http://localhost:${process.env.PORT || 5001}`;
    fetch(`${url}/health`).catch(() => {});
  }, 10 * 60 * 1000); // every 10 minutes
}

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => logger.info(`Server running on port ${PORT}`));

module.exports = app;
