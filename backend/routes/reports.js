const express = require('express');
const db = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get all reports
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userRole = req.user.role;
    let query = `
      SELECT r.*, u.name as assigned_volunteer_name
      FROM reports r
      LEFT JOIN users u ON r.assigned_volunteer_id = u.id
    `;
    let params = [];

    // Filter based on role
    if (userRole === 'Warga/Pemohon') {
      // Warga only see their own reports
      query += ' WHERE r.reporter_name = ?';
      params.push(req.user.name);
    } else if (userRole === 'Tim Ambulance') {
      // Ambulance team see assigned reports or all if admin
      query += ' WHERE r.assigned_volunteer_id = ? OR r.status IN ("Menunggu Triase", "Disetujui/Diteruskan")';
      params.push(req.user.id);
    }
    // Admin/Pimpinan see all

    query += ' ORDER BY r.created_at DESC';

    const [reports] = await db.promise().query(query, params);

    res.json({ reports });

  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Get report by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [reports] = await db.promise().query(
      `SELECT r.*, u.name as assigned_volunteer_name
       FROM reports r
       LEFT JOIN users u ON r.assigned_volunteer_id = u.id
       WHERE r.id = ?`,
      [id]
    );

    if (reports.length === 0) {
      return res.status(404).json({ message: 'Laporan tidak ditemukan' });
    }

    const report = reports[0];

    // Check permissions
    if (req.user.role === 'Warga/Pemohon' && report.reporter_name !== req.user.name) {
      return res.status(403).json({ message: 'Tidak memiliki akses ke laporan ini' });
    }

    res.json({ report });

  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Create report (Warga only)
router.post('/', authenticateToken, authorizeRoles('Warga/Pemohon'), async (req, res) => {
  try {
    const {
      patientName,
      patientAge,
      eventDate,
      eventTime,
      category,
      location,
      locationLink,
      coordinatesLat,
      coordinatesLng,
      urgentNeeds,
      description,
      chronology,
      evidencePhoto
    } = req.body;

    if (!patientName || !location || !description) {
      return res.status(400).json({ message: 'Nama pasien, lokasi, dan deskripsi diperlukan' });
    }

    // Generate report ID
    const reportId = `MED-${new Date().getFullYear()}${(Math.floor(Math.random() * 900) + 100).toString()}`;

    // Insert report
    const [result] = await db.promise().query(
      `INSERT INTO reports (
        id, reporter_name, whatsapp, patient_name, patient_age, event_date, event_time,
        category, location, location_link, coordinates_lat, coordinates_lng,
        urgent_needs, description, chronology, evidence_photo, status, urgency
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        reportId,
        req.user.name,
        req.user.phone || '',
        patientName,
        patientAge,
        eventDate,
        eventTime,
        category,
        location,
        locationLink,
        coordinatesLat,
        coordinatesLng,
        JSON.stringify(urgentNeeds || []),
        description,
        chronology,
        evidencePhoto,
        'Menunggu Triase',
        'Merah (Kritis)'
      ]
    );

    // Get the created report
    const [reports] = await db.promise().query(
      'SELECT * FROM reports WHERE id = ?',
      [reportId]
    );

    res.status(201).json({
      message: 'Laporan berhasil dibuat',
      report: reports[0]
    });

  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Update report (Admin/Ambulance team)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    const updates = req.body;

    // Check permissions
    if (userRole === 'Warga/Pemohon') {
      return res.status(403).json({ message: 'Warga tidak dapat mengupdate laporan' });
    }

    // Build update query
    const allowedFields = [
      'status', 'urgency', 'admin_notes', 'assigned_volunteer_id',
      'target_hospital', 'volunteer_report'
    ];

    const updateData = {};
    const params = [];

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
        params.push(updates[field]);
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'Tidak ada field yang diupdate' });
    }

    params.push(id);

    const setClause = Object.keys(updateData).map(field => `${field} = ?`).join(', ');
    const query = `UPDATE reports SET ${setClause} WHERE id = ?`;

    await db.promise().query(query, params);

    // Get updated report
    const [reports] = await db.promise().query(
      `SELECT r.*, u.name as assigned_volunteer_name
       FROM reports r
       LEFT JOIN users u ON r.assigned_volunteer_id = u.id
       WHERE r.id = ?`,
      [id]
    );

    res.json({
      message: 'Laporan berhasil diperbarui',
      report: reports[0]
    });

  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Delete report (Admin only)
router.delete('/:id', authenticateToken, authorizeRoles('Admin/Dispatcher'), async (req, res) => {
  try {
    const { id } = req.params;

    const [reports] = await db.promise().query(
      'SELECT id FROM reports WHERE id = ?',
      [id]
    );

    if (reports.length === 0) {
      return res.status(404).json({ message: 'Laporan tidak ditemukan' });
    }

    await db.promise().query('DELETE FROM reports WHERE id = ?', [id]);

    res.json({ message: 'Laporan berhasil dihapus' });

  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

module.exports = router;