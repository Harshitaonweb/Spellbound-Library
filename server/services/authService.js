const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/userRepository');
const { generateUniqueUsername } = require('../utils/usernameGenerator');

const signup = async ({ name, email, password }) => {
  const existing = await userRepo.findByEmail(email);
  if (existing) throw Object.assign(new Error('Email already in use'), { status: 409 });

  // Generate unique Hogwarts-themed username
  const username = await generateUniqueUsername();

  const password_hash = await bcrypt.hash(password, 12);
  const user = await userRepo.create({ username, name, email, password_hash });
  return { user, token: signToken(user.id) };
};

const login = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const { password_hash, ...safeUser } = user;
  return { user: safeUser, token: signToken(user.id) };
};

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

module.exports = { signup, login };
