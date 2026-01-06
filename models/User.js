const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

class User {
    static async create(userData) {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

            const { rows } = await db.query(
                `
                    INSERT INTO users (username, email, password_hash, nama_lengkap, role, bidang_id, kode_bidang, is_active)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, true))
                    RETURNING *
                `,
                [
                    userData.username,
                    userData.email,
                    hashedPassword,
                    userData.nama_lengkap,
                    userData.role,
                    userData.bidang_id || null,
                    userData.kode_bidang || null,
                    userData.is_active
                ]
            );

            const data = rows[0];
            const { password_hash, ...userWithoutPassword } = data;
            return userWithoutPassword;
        } catch (error) {
            throw new Error('Error creating user: ' + error.message);
        }
    }

    static async findByEmail(email) {
        try {
            const { rows } = await db.query(
                'SELECT * FROM users WHERE email = $1 LIMIT 1',
                [email]
            );
            return rows[0];
        } catch (error) {
            throw new Error('Error finding user by email: ' + error.message);
        }
    }

    static async findByUsername(username) {
        try {
            const { rows } = await db.query(
                'SELECT * FROM users WHERE username = $1 LIMIT 1',
                [username]
            );
            return rows[0];
        } catch (error) {
            throw new Error('Error finding user by username: ' + error.message);
        }
    }

    static async findById(id) {
        try {
            const { rows } = await db.query(
                `
                    SELECT u.*, b.nama_bidang, b.kode_bidang, b.email_bidang
                    FROM users u
                    LEFT JOIN bidang b ON b.id = u.bidang_id
                    WHERE u.id = $1
                    LIMIT 1
                `,
                [id]
            );

            const data = rows[0];
            if (data) {
                const { password_hash, ...userWithoutPassword } = data;
                return userWithoutPassword;
            }
            return null;
        } catch (error) {
            throw new Error('Error finding user by ID: ' + error.message);
        }
    }

    static async findAll(page = 1, limit = 10, filters = {}) {
        try {
            const offset = (page - 1) * limit;
            const conditions = [];
            const params = [];

            if (filters.role) {
                params.push(filters.role);
                conditions.push(`u.role = $${params.length}`);
            }
            if (filters.bidang_id) {
                params.push(filters.bidang_id);
                conditions.push(`u.bidang_id = $${params.length}`);
            }
            if (filters.is_active !== undefined) {
                params.push(filters.is_active);
                conditions.push(`u.is_active = $${params.length}`);
            }

            const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

            const countResult = await db.query(
                `SELECT COUNT(*)::text AS count FROM users u ${whereClause}`,
                params
            );
            const total = parseInt(countResult.rows[0]?.count || '0', 10);

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

            return {
                data: usersWithoutPasswords,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            throw new Error('Error finding all users: ' + error.message);
        }
    }

    static async update(id, userData) {
        try {
            const updates = [];
            const params = [];

            for (const [key, value] of Object.entries(userData)) {
                if (key === 'password') {
                    continue;
                }
                params.push(value);
                updates.push(`${key} = $${params.length}`);
            }

            if (userData.password) {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
                params.push(hashedPassword);
                updates.push(`password_hash = $${params.length}`);
            }

            params.push(id);

            const { rows } = await db.query(
                `
                    UPDATE users
                    SET ${updates.join(', ')}, updated_at = NOW()
                    WHERE id = $${params.length}
                    RETURNING *
                `,
                params
            );

            const data = rows[0];
            const { password_hash, ...userWithoutPassword } = data;
            return userWithoutPassword;
        } catch (error) {
            throw new Error('Error updating user: ' + error.message);
        }
    }

    static async delete(id) {
        try {
            await db.query('DELETE FROM users WHERE id = $1', [id]);
            return true;
        } catch (error) {
            throw new Error('Error deleting user: ' + error.message);
        }
    }

    static async authenticate(email, password) {
        try {
            const user = await this.findByEmail(email);
            if (!user || !user.is_active) {
                return null;
            }

            const isValidPassword = await bcrypt.compare(password, user.password_hash);
            if (!isValidPassword) {
                return null;
            }

            const { password_hash, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            throw new Error('Error authenticating user: ' + error.message);
        }
    }

    static generateToken(user) {
        return jwt.sign(
            { 
                userId: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { 
                expiresIn: process.env.JWT_EXPIRES_IN || '7d' 
            }
        );
    }

    static async findByBidang(bidangId) {
        try {
            const { rows } = await db.query(
                `
                    SELECT id, username, email, nama_lengkap, role
                    FROM users
                    WHERE bidang_id = $1
                      AND is_active = true
                `,
                [bidangId]
            );
            return rows;
        } catch (error) {
            throw new Error('Error finding users by bidang: ' + error.message);
        }
    }
}

module.exports = User;
