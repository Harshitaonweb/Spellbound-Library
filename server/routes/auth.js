const router = require('express').Router();
const { signup, login, me, logout } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { z } = require('zod');
const { generateRandomUsername } = require('../utils/usernameGenerator');

const signupSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores').optional(),
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, me);
router.post('/logout', logout);

// Generate random Hogwarts username
router.get('/generate-username', (req, res) => {
  const username = generateRandomUsername();
  res.json({ username });
});

module.exports = router;
