const express = require('express');
const router = express.Router();
const {
    createDisposisi,
    getDisposisiByPengaduan,
    getBidangDisposisi,
    getAllDisposisi,
    getBidangList,
    deleteDisposisi,
    disposisiValidation
} = require('../controllers/disposisiController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.post('/', 
    authenticateToken, 
    authorizeRoles('bidang', 'admin'), 
    disposisiValidation, 
    createDisposisi
);

router.get('/pengaduan/:pengaduan_id', authenticateToken, getDisposisiByPengaduan);
router.get('/bidang', authenticateToken, authorizeRoles('bidang'), getBidangDisposisi);
router.get('/all', authenticateToken, authorizeRoles('admin'), getAllDisposisi);
router.get('/bidang-list', authenticateToken, authorizeRoles('bidang', 'admin'), getBidangList);

router.delete('/:id', 
    authenticateToken, 
    authorizeRoles('bidang', 'admin'), 
    deleteDisposisi
);

module.exports = router;
