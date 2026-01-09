const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password diperlukan' });
    }

    // Find user
    const [users] = await db.promise().query(
      'SELECT * FROM users WHERE email = ? AND status = "Aktif"',
      [email.toLowerCase()]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Email tidak ditemukan' });
    }

    const user = users[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Password salah' });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      message: 'Login berhasil',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Semua field diperlukan' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password minimal 6 karakter' });
    }

    // Check if email already exists
    const [existingUsers] = await db.promise().query(
      'SELECT id FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const [result] = await db.promise().query(
      'INSERT INTO users (name, email, phone, role, password_hash) VALUES (?, ?, ?, "Warga/Pemohon", ?)',
      [name, email.toLowerCase(), phone, hashedPassword]
    );

    // Get the created user
    const [newUsers] = await db.promise().query(
      'SELECT id, name, email, phone, role, status, avatar, expertise, address, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    const user = newUsers[0];

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      message: 'Registrasi berhasil',
      token,
      user
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    // This will be protected by auth middleware
    const userId = req.user.id;

    const [users] = await db.promise().query(
      'SELECT id, name, email, phone, role, status, avatar, expertise, address, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.json({ user: users[0] });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Update profile
router.put('/profile', async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, avatar } = req.body;

    await db.promise().query(
      'UPDATE users SET name = ?, phone = ?, avatar = ? WHERE id = ?',
      [name, phone, avatar, userId]
    );

    // Get updated user
    const [users] = await db.promise().query(
      'SELECT id, name, email, phone, role, status, avatar, expertise, address FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      message: 'Profile berhasil diperbarui',
      user: users[0]
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

module.exports = router;