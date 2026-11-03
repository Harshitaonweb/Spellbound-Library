require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const app = express();

// Simple username generator - no DB needed
const HOGWARTS_FIRST_NAMES = [
  'Harry', 'Hermione', 'Ron', 'Draco', 'Luna', 'Neville', 'Ginny', 'Fred',
  'George', 'Remus', 'Sirius', 'Albus', 'Severus', 'Minerva', 'Rubeus',
  'Dobby', 'Bellatrix', 'Narcissa', 'Lucius', 'Cedric', 'Cho', 'Fleur',
  'Viktor', 'Oliver', 'Percy', 'Charlie', 'Bill', 'Molly', 'Arthur', 'James'
];

const HOGWARTS_TITLES = [
  'Seeker', 'Keeper', 'Chaser', 'Beater', 'Auror', 'Prefect', 'Professor',
  'Marauder', 'Animagus', 'Healer', 'Quidditch', 'Wizard', 'Witch', 'Knight'
];

const generateRandomUsername = () => {
  const firstName = HOGWARTS_FIRST_NAMES[Math.floor(Math.random() * HOGWARTS_FIRST_NAMES.length)];
  const useTitle = Math.random() > 0.5;
  if (useTitle) {
    const title = HOGWARTS_TITLES[Math.floor(Math.random() * HOGWARTS_TITLES.length)];
    const number = Math.floor(Math.random() * 999) + 1;
    return `${firstName}_${title}_${number}`;
  } else {
    const number = Math.floor(Math.random() * 9999) + 1;
    return `${firstName}_${number}`;
  }
};

// Middleware
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

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/search', require('./routes/search'));
app.use('/api/tags', require('./routes/tags'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/upload', require('./routes/upload'));

// Generate username endpoint - no DB needed
app.get('/api/auth/generate-username', (req, res) => {
  const username = generateRandomUsername();
  res.json({ username });
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;