const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/kategori', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM kategori_pengaduan ORDER BY nama_kategori');

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Get kategori error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get('/bidang', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM bidang ORDER BY nama_bidang');

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Get bidang error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.post('/kategori',
    authenticateToken,
    authorizeRoles('admin'),
    async (req, res) => {
        try {
            const { nama_kategori, deskripsi } = req.body;

            if (!nama_kategori) {
                return res.status(400).json({
                    success: false,
                    message: 'Nama kategori harus diisi'
                });
            }

            const { rows } = await db.query(
                `
                    INSERT INTO kategori_pengaduan (nama_kategori, deskripsi)
                    VALUES ($1, $2)
                    RETURNING *
                `,
                [nama_kategori, deskripsi || null]
            );

            res.status(201).json({
                success: true,
                message: 'Kategori berhasil ditambahkan',
                data: rows[0]
            });
        } catch (error) {
            console.error('Create kategori error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
);

router.put('/kategori/:id',
    authenticateToken,
    authorizeRoles('admin'),
    async (req, res) => {
        try {
            const { id } = req.params;
            const { nama_kategori, deskripsi } = req.body;

            const { rows } = await db.query(
                `
                    UPDATE kategori_pengaduan
                    SET nama_kategori = $1,
                        deskripsi = $2,
                        updated_at = NOW()
                    WHERE id = $3
                    RETURNING *
                `,
                [nama_kategori, deskripsi || null, id]
            );

            if (!rows[0]) {
                return res.status(404).json({
                    success: false,
                    message: 'Kategori tidak ditemukan'
                });
            }

            res.json({
                success: true,
                message: 'Kategori berhasil diperbarui',
                data: rows[0]
            });
        } catch (error) {
            console.error('Update kategori error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
);

router.delete('/kategori/:id',
    authenticateToken,
    authorizeRoles('admin'),
    async (req, res) => {
        try {
            const { id } = req.params;

            await db.query('DELETE FROM kategori_pengaduan WHERE id = $1', [id]);

            res.json({
                success: true,
                message: 'Kategori berhasil dihapus'
            });
        } catch (error) {
            console.error('Delete kategori error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
);

router.get('/users',
    authenticateToken,
    authorizeRoles('admin'),
    async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const { role, bidang_id, is_active } = req.query;

            const offset = (page - 1) * limit;
            const conditions = [];
            const params = [];

            if (role) {
                params.push(role);
                conditions.push(`u.role = $${params.length}`);
            }
            if (bidang_id) {
                params.push(bidang_id);
                conditions.push(`u.bidang_id = $${params.length}`);
            }
            if (is_active !== undefined) {
                params.push(is_active);
                conditions.push(`u.is_active = $${params.length}`);
            }

            const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

            const countResult = await db.query(
                `SELECT COUNT(*)::text AS count FROM users u ${whereClause}`,
                params
            );
            const count = parseInt(countResult.rows[0]?.count || '0', 10);

            const listParams = [...params, limit, offset];
            const { rows } = await db.query(
                `
                    SELECT u.*, b.nama_bidang, b.kode_bidang
                    FROM users u
                    LEFT JOIN bidang b ON b.id = u.bidang_id
                    ${whereClause}
                    ORDER BY u.created_at DESC
                    LIMIT $${listParams.length - 1} OFFSET $${listParams.length}
                `,
                listParams
            );

            const usersWithoutPasswords = rows.map(user => {
                const { password_hash, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });

            res.json({
                success: true,
                data: {
                    data: usersWithoutPasswords,
                    total: count,
                    page,
                    totalPages: Math.ceil(count / limit)
                }
            });
        } catch (error) {
            console.error('Get users error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
);

module.exports = router;
