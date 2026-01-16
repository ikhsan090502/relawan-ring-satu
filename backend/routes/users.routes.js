const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/verifyToken');

const router = express.Router();

/**
 * GET ALL USERS (Admin only)
 */
router.get(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const [users] = await db.promise().query(
        `SELECT id, name, email, phone, role, status, avatar, expertise, address, created_at
         FROM users
         ORDER BY created_at DESC`
      );

      res.json({ users });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }
);

/**
 * GET USER BY ID
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await db.promise().query(
      `SELECT id, name, email, phone, role, status, avatar, expertise, address, created_at
       FROM users
       WHERE id = ?`,
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

/**
 * CREATE USER (Admin only)
 */
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const { name, email, phone, role, password, expertise, address } = req.body;

      if (!name || !email || !role || !password) {
        return res.status(400).json({
          message: 'Name, email, role, dan password diperlukan'
        });
      }

      const [existingUsers] = await db.promise().query(
        'SELECT id FROM users WHERE email = ?',
        [email.toLowerCase()]
      );

      if (existingUsers.length > 0) {
        return res.status(409).json({ message: 'Email sudah terdaftar' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await db.promise().query(
        `INSERT INTO users
         (name, email, phone, role, password_hash, expertise, address)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          email.toLowerCase(),
          phone || null,
          role,
          hashedPassword,
          expertise || null,
          address || null
        ]
      );

      const [newUsers] = await db.promise().query(
        `SELECT id, name, email, phone, role, status, avatar, expertise, address, created_at
         FROM users
         WHERE id = ?`,
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
  }
);

/**
 * UPDATE USER (Admin only)
 */
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phone, role, status, expertise, address } = req.body;

      const [existingUsers] = await db.promise().query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email.toLowerCase(), id]
      );

      if (existingUsers.length > 0) {
        return res.status(409).json({ message: 'Email sudah digunakan user lain' });
      }

      await db.promise().query(
        `UPDATE users
         SET name = ?, email = ?, phone = ?, role = ?, status = ?, expertise = ?, address = ?
         WHERE id = ?`,
        [
          name,
          email.toLowerCase(),
          phone || null,
          role,
          status,
          expertise || null,
          address || null,
          id
        ]
      );

      const [users] = await db.promise().query(
        `SELECT id, name, email, phone, role, status, avatar, expertise, address
         FROM users
         WHERE id = ?`,
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
  }
);

/**
 * DELETE USER (Admin only)
 */
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const { id } = req.params;

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
  }
);

module.exports = router;
