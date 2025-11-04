const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/database');

class User {
    static async create(userData) {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
            
            const { data, error } = await supabase
                .from('users')
                .insert([{
                    ...userData,
                    password_hash: hashedPassword
                }])
                .select()
                .single();

            if (error) throw error;
            
            const { password_hash, ...userWithoutPassword } = data;
            return userWithoutPassword;
        } catch (error) {
            throw new Error('Error creating user: ' + error.message);
        }
    }

    static async findByEmail(email) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return data;
        } catch (error) {
            throw new Error('Error finding user by email: ' + error.message);
        }
    }

    static async findByUsername(username) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('username', username)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return data;
        } catch (error) {
            throw new Error('Error finding user by username: ' + error.message);
        }
    }

    static async findById(id) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select(`
                    *,
                    bidang (nama_bidang, kode_bidang, email_bidang)
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            
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
            let query = supabase
                .from('users')
                .select(`
                    *,
                    bidang (nama_bidang, kode_bidang)
                `, { count: 'exact' })
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);

            if (filters.role) {
                query = query.eq('role', filters.role);
            }
            if (filters.bidang_id) {
                query = query.eq('bidang_id', filters.bidang_id);
            }
            if (filters.is_active !== undefined) {
                query = query.eq('is_active', filters.is_active);
            }

            const { data, error, count } = await query;

            if (error) throw error;
            
            const usersWithoutPasswords = data.map(user => {
                const { password_hash, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });
            
            return {
                data: usersWithoutPasswords,
                total: count,
                page,
                totalPages: Math.ceil(count / limit)
            };
        } catch (error) {
            throw new Error('Error finding all users: ' + error.message);
        }
    }

    static async update(id, userData) {
        try {
            let updateData = { ...userData, updated_at: new Date() };
            
            if (userData.password) {
                const saltRounds = 10;
                updateData.password_hash = await bcrypt.hash(userData.password, saltRounds);
                delete updateData.password;
            }

            const { data, error } = await supabase
                .from('users')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            
            const { password_hash, ...userWithoutPassword } = data;
            return userWithoutPassword;
        } catch (error) {
            throw new Error('Error updating user: ' + error.message);
        }
    }

    static async delete(id) {
        try {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', id);

            if (error) throw error;
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
            const { data, error } = await supabase
                .from('users')
                .select('id, username, email, nama_lengkap, role')
                .eq('bidang_id', bidangId)
                .eq('is_active', true);

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error('Error finding users by bidang: ' + error.message);
        }
    }
}

module.exports = User;
