const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const registerValidation = [
    body('username').isLength({ min: 3 }).withMessage('Username minimal 3 karakter'),
    body('email').isEmail().withMessage('Format email tidak valid'),
    body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
    body('nama_lengkap').notEmpty().withMessage('Nama lengkap harus diisi'),
    body('role').optional().isIn(['masyarakat', 'bidang', 'admin']).withMessage('Role tidak valid')
];

const loginValidation = [
    body('email').isEmail().withMessage('Format email tidak valid'),
    body('password').notEmpty().withMessage('Password harus diisi')
];

const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const { username, email, password, nama_lengkap, role = 'masyarakat', bidang_id } = req.body;

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email sudah terdaftar'
            });
        }

        const existingUsername = await User.findByUsername(username);
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: 'Username sudah digunakan'
            });
        }

        const user = await User.create({
            username,
            email,
            password,
            nama_lengkap,
            role,
            bidang_id: role === 'bidang' ? bidang_id : null
        });

        const token = User.generateToken(user);

        res.status(201).json({
            success: true,
            message: 'User berhasil terdaftar',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        const user = await User.authenticate(email, password);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah'
            });
        }

        const token = User.generateToken(user);

        res.json({
            success: true,
            message: 'Login berhasil',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { username, nama_lengkap, email } = req.body;
        const userId = req.user.id;

        if (email && email !== req.user.email) {
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email sudah terdaftar'
                });
            }
        }

        if (username && username !== req.user.username) {
            const existingUsername = await User.findByUsername(username);
            if (existingUsername) {
                return res.status(400).json({
                    success: false,
                    message: 'Username sudah digunakan'
                });
            }
        }

        const updatedUser = await User.update(userId, {
            username,
            nama_lengkap,
            email
        });

        res.json({
            success: true,
            message: 'Profile berhasil diperbarui',
            data: updatedUser
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { current_password, new_password } = req.body;
        const userId = req.user.id;

        if (!current_password || !new_password) {
            return res.status(400).json({
                success: false,
                message: 'Current password dan new password harus diisi'
            });
        }

        if (new_password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password minimal 6 karakter'
            });
        }

        const user = await User.authenticate(req.user.email, current_password);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Current password salah'
            });
        }

        await User.update(userId, { password: new_password });

        res.json({
            success: true,
            message: 'Password berhasil diubah'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    registerValidation,
    loginValidation
};
