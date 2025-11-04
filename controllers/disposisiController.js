const { body, validationResult } = require('express-validator');
const Disposisi = require('../models/Disposisi');
const Pengaduan = require('../models/Pengaduan');
const { sendEmail, generateDisposisiEmailTemplate } = require('../config/email');
const supabase = require('../config/database');

const disposisiValidation = [
    body('pengaduan_id').isUUID().withMessage('Pengaduan ID harus UUID'),
    body('ke_bidang_id').isInt().withMessage('Bidang ID harus integer'),
    body('keterangan').optional().isString()
];

const createDisposisi = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const { pengaduan_id, ke_bidang_id, keterangan } = req.body;
        const userId = req.user.id;

        const pengaduan = await Pengaduan.findById(pengaduan_id);
        if (!pengaduan) {
            return res.status(404).json({
                success: false,
                message: 'Pengaduan tidak ditemukan'
            });
        }

        if (req.user.role === 'bidang' && pengaduan.bidang_id !== req.user.bidang_id) {
            return res.status(403).json({
                success: false,
                message: 'Anda hanya bisa mendisposisikan pengaduan dari bidang Anda'
            });
        }

        if (req.user.role === 'masyarakat') {
            return res.status(403).json({
                success: false,
                message: 'Masyarakat tidak bisa melakukan disposisi'
            });
        }

        const dari_bidang_id = req.user.role === 'admin' ? null : req.user.bidang_id;

        if (dari_bidang_id === ke_bidang_id) {
            return res.status(400).json({
                success: false,
                message: 'Tidak bisa mendisposisikan ke bidang yang sama'
            });
        }

        const disposisiData = {
            pengaduan_id,
            dari_bidang_id,
            ke_bidang_id,
            keterangan,
            user_id: userId
        };

        const disposisi = await Disposisi.create(disposisiData);

        await Disposisi.updatePengaduanBidang(pengaduan_id, ke_bidang_id);

        try {
            const { data: bidangData } = await supabase
                .from('bidang')
                .select('email_bidang, nama_bidang')
                .eq('id', ke_bidang_id)
                .single();

            if (bidangData && bidangData.email_bidang) {
                const dariBidangName = dari_bidang_id ? 
                    (await supabase.from('bidang').select('nama_bidang').eq('id', dari_bidang_id).single()).data?.nama_bidang || 'Admin' 
                    : 'Admin';
                
                const emailTemplate = generateDisposisiEmailTemplate(pengaduan, dariBidangName, bidangData.nama_bidang);
                await sendEmail(bidangData.email_bidang, `Disposisi Pengaduan - ${pengaduan.kode_pengaduan}`, emailTemplate);
            }
        } catch (emailError) {
            console.error('Failed to send email:', emailError);
        }

        res.status(201).json({
            success: true,
            message: 'Disposisi berhasil dibuat',
            data: disposisi
        });
    } catch (error) {
        console.error('Create disposisi error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getDisposisiByPengaduan = async (req, res) => {
    try {
        const { pengaduan_id } = req.params;

        const pengaduan = await Pengaduan.findById(pengaduan_id);
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

        const disposisi = await Disposisi.findByPengaduanId(pengaduan_id);

        res.json({
            success: true,
            data: disposisi
        });
    } catch (error) {
        console.error('Get disposisi by pengaduan error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getBidangDisposisi = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await Disposisi.findByBidang(req.user.bidang_id, page, limit);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Get bidang disposisi error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllDisposisi = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { dari_bidang_id, ke_bidang_id } = req.query;

        const filters = {};
        if (dari_bidang_id) filters.dari_bidang_id = parseInt(dari_bidang_id);
        if (ke_bidang_id) filters.ke_bidang_id = parseInt(ke_bidang_id);

        const result = await Disposisi.findAll(page, limit, filters);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Get all disposisi error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getBidangList = async (req, res) => {
    try {
        const bidangList = await Disposisi.getBidangList();

        res.json({
            success: true,
            data: bidangList
        });
    } catch (error) {
        console.error('Get bidang list error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteDisposisi = async (req, res) => {
    try {
        const { id } = req.params;

        const disposisi = await Disposisi.findByPengaduanId(req.body.pengaduan_id);
        const targetDisposisi = disposisi.find(d => d.id === parseInt(id));
        
        if (!targetDisposisi) {
            return res.status(404).json({
                success: false,
                message: 'Disposisi tidak ditemukan'
            });
        }

        if (req.user.role === 'bidang' && targetDisposisi.dari_bidang_id !== req.user.bidang_id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        await Disposisi.delete(id);

        res.json({
            success: true,
            message: 'Disposisi berhasil dihapus'
        });
    } catch (error) {
        console.error('Delete disposisi error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createDisposisi,
    getDisposisiByPengaduan,
    getBidangDisposisi,
    getAllDisposisi,
    getBidangList,
    deleteDisposisi,
    disposisiValidation
};
