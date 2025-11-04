const supabase = require('../config/database');

class Pengaduan {
    static async create(data) {
        try {
            const { data: result, error } = await supabase
                .from('pengaduan')
                .insert([data])
                .select()
                .single();

            if (error) throw error;
            return result;
        } catch (error) {
            throw new Error('Error creating pengaduan: ' + error.message);
        }
    }

    static async findById(id) {
        try {
            const { data, error } = await supabase
                .from('pengaduan')
                .select(`
                    *,
                    kategori_pengaduan (*),
                    users (username, email, nama_lengkap),
                    bidang (nama_bidang, kode_bidang)
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error('Error finding pengaduan: ' + error.message);
        }
    }

    static async findByKode(kode) {
        try {
            const { data, error } = await supabase
                .from('pengaduan')
                .select(`
                    *,
                    kategori_pengaduan (*),
                    users (username, email, nama_lengkap),
                    bidang (nama_bidang, kode_bidang)
                `)
                .eq('kode_pengaduan', kode)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error('Error finding pengaduan: ' + error.message);
        }
    }

    static async findByUserId(userId, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            
            const { data, error, count } = await supabase
                .from('pengaduan')
                .select(`
                    *,
                    kategori_pengaduan (*),
                    bidang (nama_bidang, kode_bidang)
                `, { count: 'exact' })
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);

            if (error) throw error;
            
            return {
                data,
                total: count,
                page,
                totalPages: Math.ceil(count / limit)
            };
        } catch (error) {
            throw new Error('Error finding pengaduan by user: ' + error.message);
        }
    }

    static async findByBidang(bidangId, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            
            const { data, error, count } = await supabase
                .from('pengaduan')
                .select(`
                    *,
                    kategori_pengaduan (*),
                    users (username, email, nama_lengkap)
                `, { count: 'exact' })
                .eq('bidang_id', bidangId)
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);

            if (error) throw error;
            
            return {
                data,
                total: count,
                page,
                totalPages: Math.ceil(count / limit)
            };
        } catch (error) {
            throw new Error('Error finding pengaduan by bidang: ' + error.message);
        }
    }

    static async findAll(page = 1, limit = 10, filters = {}) {
        try {
            const offset = (page - 1) * limit;
            let query = supabase
                .from('pengaduan')
                .select(`
                    *,
                    kategori_pengaduan (*),
                    users (username, email, nama_lengkap),
                    bidang (nama_bidang, kode_bidang)
                `, { count: 'exact' })
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);

            if (filters.status) {
                query = query.eq('status', filters.status);
            }
            if (filters.kategori_id) {
                query = query.eq('kategori_id', filters.kategori_id);
            }
            if (filters.bidang_id) {
                query = query.eq('bidang_id', filters.bidang_id);
            }

            const { data, error, count } = await query;

            if (error) throw error;
            
            return {
                data,
                total: count,
                page,
                totalPages: Math.ceil(count / limit)
            };
        } catch (error) {
            throw new Error('Error finding all pengaduan: ' + error.message);
        }
    }

    static async updateStatus(id, status, userId, keterangan = '') {
        try {
            const { data: pengaduan, error: updateError } = await supabase
                .from('pengaduan')
                .update({ status, updated_at: new Date() })
                .eq('id', id)
                .select()
                .single();

            if (updateError) throw updateError;

            const { error: statusError } = await supabase
                .from('pengaduan_status')
                .insert([{
                    pengaduan_id: id,
                    status,
                    keterangan,
                    user_id: userId
                }]);

            if (statusError) throw statusError;

            return pengaduan;
        } catch (error) {
            throw new Error('Error updating pengaduan status: ' + error.message);
        }
    }

    static async update(id, data) {
        try {
            const { data: result, error } = await supabase
                .from('pengaduan')
                .update({ ...data, updated_at: new Date() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return result;
        } catch (error) {
            throw new Error('Error updating pengaduan: ' + error.message);
        }
    }

    static async delete(id) {
        try {
            const { error } = await supabase
                .from('pengaduan')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            throw new Error('Error deleting pengaduan: ' + error.message);
        }
    }
}

module.exports = Pengaduan;
