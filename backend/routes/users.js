const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get all users (Admin only)
router.get('/', authenticateToken, authorizeRoles('Admin/Dispatcher'), async (req, res) => {
  try {
    const [users] = await db.promise().query(
      'SELECT id, name, email, phone, role, status, avatar, expertise, address, created_at FROM users ORDER BY created_at DESC'
    );

    res.json({ users });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await db.promise().query(
      'SELECT id, name, email, phone, role, status, avatar, expertise, address, created_at FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.json({ user: users[0] });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Create user (Admin only)
router.post('/', authenticateToken, authorizeRoles('Admin/Dispatcher'), async (req, res) => {
  try {
    const { name, email, phone, role, password, expertise, address } = req.body;

    if (!name || !email || !role || !password) {
      return res.status(400).json({ message: 'Name, email, role, dan password diperlukan' });
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
      'INSERT INTO users (name, email, phone, role, password_hash, expertise, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email.toLowerCase(), phone, role, hashedPassword, expertise, address]
    );

    // Get the created user
    const [newUsers] = await db.promise().query(
      'SELECT id, name, email, phone, role, status, avatar, expertise, address, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'User berhasil dibuat',
      user: newUsers[0]
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Update user (Admin only)
router.put('/:id', authenticateToken, authorizeRoles('Admin/Dispatcher'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, status, expertise, address } = req.body;

    // Check if email is taken by another user
    const [existingUsers] = await db.promise().query(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email.toLowerCase(), id]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Email sudah digunakan user lain' });
    }

    await db.promise().query(
      'UPDATE users SET name = ?, email = ?, phone = ?, role = ?, status = ?, expertise = ?, address = ? WHERE id = ?',
      [name, email.toLowerCase(), phone, role, status, expertise, address, id]
    );

    // Get updated user
    const [users] = await db.promise().query(
      'SELECT id, name, email, phone, role, status, avatar, expertise, address FROM users WHERE id = ?',
      [id]
    );

    res.json({
      message: 'User berhasil diperbarui',
      user: users[0]
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Delete user (Admin only)
router.delete('/:id', authenticateToken, authorizeRoles('Admin/Dispatcher'), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const [users] = await db.promise().query(
      'SELECT id FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    await db.promise().query('DELETE FROM users WHERE id = ?', [id]);

    res.json({ message: 'User berhasil dihapus' });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

module.exports = router;