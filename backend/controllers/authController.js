const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: 'Email dan password diperlukan'
        });
      }

      const [users] = await db.promise().query(
        'SELECT * FROM users WHERE email = ? AND status = "Aktif" LIMIT 1',
        [email.toLowerCase()]
      );

      if (users.length === 0) {
        return res.status(401).json({ message: 'Email tidak ditemukan' });
      }

      const user = users[0];

      const isValidPassword = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!isValidPassword) {
        return res.status(401).json({ message: 'Password salah' });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '1d' }
      );

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
  }

  async register(req, res) {
    try {
      const { name, email, phone, password } = req.body;

      if (!name || !email || !phone || !password) {
        return res.status(400).json({
          message: 'Semua field diperlukan'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          message: 'Password minimal 6 karakter'
        });
      }

      const [existingUsers] = await db.promise().query(
        'SELECT id FROM users WHERE email = ?',
        [email.toLowerCase()]
      );

      if (existingUsers.length > 0) {
        return res.status(409).json({
          message: 'Email sudah terdaftar'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await db.promise().query(
        `INSERT INTO users
         (name, email, phone, role, password_hash)
         VALUES (?, ?, ?, 'warga', ?)`,
        [name, email.toLowerCase(), phone, hashedPassword]
      );

      const [users] = await db.promise().query(
        `SELECT id, name, email, phone, role, status, created_at
         FROM users
         WHERE id = ?`,
        [result.insertId]
      );

      const user = users[0];

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '1d' }
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
  }

  async getProfile(req, res) {
    try {
      const userId = req.user.id;

      const [users] = await db.promise().query(
        `SELECT id, name, email, phone, role, status, avatar, expertise, address, created_at, updated_at
         FROM users
         WHERE id = ?`,
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({ message: 'User tidak ditemukan' });
      }

      res.json(users[0]);
    } catch (error) {
      console.error('Profile error:', error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { name, phone, avatar } = req.body;

      await db.promise().query(
        'UPDATE users SET name = ?, phone = ?, avatar = ? WHERE id = ?',
        [name, phone || null, avatar || null, userId]
      );

      const [users] = await db.promise().query(
        `SELECT id, name, email, phone, role, status, avatar, expertise, address
         FROM users
         WHERE id = ?`,
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
  }
}

module.exports = new AuthController();