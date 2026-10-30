const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/userRepository');

const signup = async ({ username, name, email, password }) => {
  console.log('[AUTH] Signup attempt for:', email, 'username:', username);
  
  const existingEmail = await userRepo.findByEmail(email);
  if (existingEmail) {
    console.log('[AUTH] Email already in use:', email);
    throw Object.assign(new Error('Email already in use'), { status: 409 });
  }

  // Check username only if provided
  if (username) {
    const existingUsername = await userRepo.findByUsername(username);
    if (existingUsername) {
      console.log('[AUTH] Username already taken:', username);
      throw Object.assign(new Error('Username already taken'), { status: 409 });
    }
  }

  console.log('[AUTH] Hashing password...');
  const password_hash = await bcrypt.hash(password, 12);
  console.log('[AUTH] Creating user...');
  
  const user = await userRepo.create({ username, name, email, password_hash });
  console.log('[AUTH] User created with id:', user.id);
  
  return { user, token: signToken(user.id) };
};

const login = async ({ email, password }) => {
  console.log('[AUTH] Login attempt for:', email);
  
  const user = await userRepo.findByEmail(email);
  console.log('[AUTH] User found:', user ? 'yes' : 'no');
  
  if (!user) {
    console.log('[AUTH] No user with email:', email);
    throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  }

  console.log('[AUTH] User password_hash exists:', !!user.password_hash);
  
  const valid = await bcrypt.compare(password, user.password_hash);
  console.log('[AUTH] Password valid:', valid);

  if (!valid) {
    console.log('[AUTH] Password incorrect for:', email);
    throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  }

  const { password_hash, ...safeUser } = user;
  return { user: safeUser, token: signToken(user.id) };
};

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

module.exports = { signup, login };
