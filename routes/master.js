const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/kategori', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('kategori_pengaduan')
            .select('*')
            .order('nama_kategori');

        if (error) throw error;

        res.json({
            success: true,
            data: data
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
        const { data, error } = await supabase
            .from('bidang')
            .select('*')
            .order('nama_bidang');

        if (error) throw error;

        res.json({
            success: true,
            data: data
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

            const { data, error } = await supabase
                .from('kategori_pengaduan')
                .insert([{ nama_kategori, deskripsi }])
                .select()
                .single();

            if (error) throw error;

            res.status(201).json({
                success: true,
                message: 'Kategori berhasil ditambahkan',
                data: data
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

            const { data, error } = await supabase
                .from('kategori_pengaduan')
                .update({ nama_kategori, deskripsi, updated_at: new Date() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: 'Kategori tidak ditemukan'
                });
            }

            res.json({
                success: true,
                message: 'Kategori berhasil diperbarui',
                data: data
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

            const { error } = await supabase
                .from('kategori_pengaduan')
                .delete()
                .eq('id', id);

            if (error) throw error;

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
            let query = supabase
                .from('users')
                .select(`
                    *,
                    bidang (nama_bidang, kode_bidang)
                `, { count: 'exact' })
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);

            if (role) query = query.eq('role', role);
            if (bidang_id) query = query.eq('bidang_id', bidang_id);
            if (is_active !== undefined) query = query.eq('is_active', is_active);

            const { data, error, count } = await query;

            if (error) throw error;

            const usersWithoutPasswords = data.map(user => {
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
