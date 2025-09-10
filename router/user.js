import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';

import { createUser, getUserByCredentials } from '#db/queries/userQueries.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10', 10);

// POST /users/register
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body || {};

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'Email and Password are both Required' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    let user;
    try {
      user = await createUser(
        firstName ?? null,
        lastName ?? null,
        email,
        passwordHash
      );
    } catch (e) {
      if (e && e.code === '23505') {
        return res
          .status(409)
          .json({ error: 'This email address is already registered' });
      }
      throw e;
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'internal server error' });
  }
});

// POST /users/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const user = await getUserByCredentials(email, password);
    if (!user) {
      return res.status(401).json({ error: 'invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'internal server error' });
  }
});

export default router;