const express = require('express');
const router = express.Router();
const {
    createPengaduan,
    getPengaduanById,
    getPengaduanByKode,
    getUserPengaduan,
    getBidangPengaduan,
    getAllPengaduan,
    updateStatus,
    deletePengaduan,
    pengaduanValidation
} = require('../controllers/pengaduanController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { uploadSingle, handleUploadError } = require('../middleware/upload');

router.post('/', 
    authenticateToken, 
    authorizeRoles('masyarakat', 'admin'), 
    uploadSingle, 
    handleUploadError, 
    pengaduanValidation, 
    createPengaduan
);

router.get('/my', authenticateToken, authorizeRoles('masyarakat'), getUserPengaduan);
router.get('/bidang', authenticateToken, authorizeRoles('bidang'), getBidangPengaduan);
router.get('/all', authenticateToken, authorizeRoles('admin'), getAllPengaduan);
router.get('/kode/:kode', authenticateToken, getPengaduanByKode);
router.get('/:id', authenticateToken, getPengaduanById);

router.put('/:id/status', 
    authenticateToken, 
    authorizeRoles('bidang', 'admin'), 
    updateStatus
);

router.delete('/:id', 
    authenticateToken, 
    authorizeRoles('masyarakat', 'admin'), 
    deletePengaduan
);

module.exports = router;
