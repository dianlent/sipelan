const { body, validationResult } = require('express-validator');
const Pengaduan = require('../models/Pengaduan');
const { sendEmail, generatePengaduanEmailTemplate } = require('../config/email');

const pengaduanValidation = [
    body('kategori_id').isInt().withMessage('Kategori ID harus integer'),
    body('judul_pengaduan').notEmpty().withMessage('Judul pengaduan harus diisi'),
    body('isi_pengaduan').notEmpty().withMessage('Isi pengaduan harus diisi'),
    body('lokasi_kejadian').optional().isString(),
    body('tanggal_kejadian').optional().isDate().withMessage('Format tanggal tidak valid')
];

const createPengaduan = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const { kategori_id, judul_pengaduan, isi_pengaduan, lokasi_kejadian, tanggal_kejadian } = req.body;
        const userId = req.user.id;

        let file_bukti = null;
        if (req.file) {
            file_bukti = req.file.filename;
        }

        const pengaduanData = {
            user_id: userId,
            kategori_id,
            judul_pengaduan,
            isi_pengaduan,
            lokasi_kejadian,
            tanggal_kejadian,
            file_bukti
        };

        const pengaduan = await Pengaduan.create(pengaduanData);

        try {
            const emailTemplate = generatePengaduanEmailTemplate(pengaduan, 'diterima');
            await sendEmail(req.user.email, `Pengaduan Diterima - ${pengaduan.kode_pengaduan}`, emailTemplate);
        } catch (emailError) {
            console.error('Failed to send email:', emailError);
        }

        res.status(201).json({
            success: true,
            message: 'Pengaduan berhasil dibuat',
            data: pengaduan
        });
    } catch (error) {
        console.error('Create pengaduan error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getPengaduanById = async (req, res) => {
    try {
        const { id } = req.params;
        const pengaduan = await Pengaduan.findById(id);

        if (!pengaduan) {
            return res.status(404).json({
                success: false,
                message: 'Pengaduan tidak ditemukan'
            });
        }

        if (req.user.role === 'masyarakat' && pengaduan.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        if (req.user.role === 'bidang' && pengaduan.bidang_id !== req.user.bidang_id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.json({
            success: true,
            data: pengaduan
        });
    } catch (error) {
        console.error('Get pengaduan error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getPengaduanByKode = async (req, res) => {
    try {
        const { kode } = req.params;
        const pengaduan = await Pengaduan.findByKode(kode);

        if (!pengaduan) {
            return res.status(404).json({
                success: false,
                message: 'Pengaduan tidak ditemukan'
            });
        }

        if (req.user.role === 'masyarakat' && pengaduan.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        if (req.user.role === 'bidang' && pengaduan.bidang_id !== req.user.bidang_id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.json({
            success: true,
            data: pengaduan
        });
    } catch (error) {
        console.error('Get pengaduan by kode error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getUserPengaduan = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;

        const filters = {};
        if (status) filters.status = status;

        const result = await Pengaduan.findByUserId(req.user.id, page, limit, filters);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Get user pengaduan error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getBidangPengaduan = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;

        const filters = {};
        if (status) filters.status = status;

        const result = await Pengaduan.findByBidang(req.user.bidang_id, page, limit, filters);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Get bidang pengaduan error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllPengaduan = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { status, kategori_id, bidang_id } = req.query;

        const filters = {};
        if (status) filters.status = status;
        if (kategori_id) filters.kategori_id = parseInt(kategori_id);
        if (bidang_id) filters.bidang_id = parseInt(bidang_id);

        const result = await Pengaduan.findAll(page, limit, filters);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Get all pengaduan error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, keterangan } = req.body;

        if (!['diterima', 'di proses', 'selesai'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status tidak valid'
            });
        }

        const pengaduan = await Pengaduan.findById(id);
        if (!pengaduan) {
            return res.status(404).json({
                success: false,
                message: 'Pengaduan tidak ditemukan'
            });
        }

        if (req.user.role === 'bidang' && pengaduan.bidang_id !== req.user.bidang_id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const updatedPengaduan = await Pengaduan.updateStatus(id, status, req.user.id, keterangan);

        try {
            const user = await require('../models/User').findById(pengaduan.user_id);
            if (user) {
                const emailTemplate = generatePengaduanEmailTemplate(updatedPengaduan, status);
                await sendEmail(user.email, `Update Status Pengaduan - ${updatedPengaduan.kode_pengaduan}`, emailTemplate);
            }
        } catch (emailError) {
            console.error('Failed to send email:', emailError);
        }

        res.json({
            success: true,
            message: 'Status pengaduan berhasil diperbarui',
            data: updatedPengaduan
        });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deletePengaduan = async (req, res) => {
    try {
        const { id } = req.params;

        const pengaduan = await Pengaduan.findById(id);
        if (!pengaduan) {
            return res.status(404).json({
                success: false,
                message: 'Pengaduan tidak ditemukan'
            });
        }

        if (req.user.role === 'masyarakat' && pengaduan.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        await Pengaduan.delete(id);

        res.json({
            success: true,
            message: 'Pengaduan berhasil dihapus'
        });
    } catch (error) {
        console.error('Delete pengaduan error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createPengaduan,
    getPengaduanById,
    getPengaduanByKode,
    getUserPengaduan,
    getBidangPengaduan,
    getAllPengaduan,
    updateStatus,
    deletePengaduan,
    pengaduanValidation
};
