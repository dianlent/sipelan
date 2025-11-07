const supabase = require('../config/database');

class Pengaduan {
    static async create(data) {
        const maxRetries = 5;
        let lastError = null;

        // Remove kode_pengaduan if it exists to let trigger generate it
        const insertData = { ...data };
        delete insertData.kode_pengaduan;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const { data: result, error } = await supabase
                    .from('pengaduan')
                    .insert([insertData])
                    .select()
                    .single();

                if (error) {
                    // Handle duplicate key error specifically
                    if (error.code === '23505' && error.message.includes('kode_pengaduan')) {
                        lastError = new Error('duplicate_key_pengaduan');
                        
                        // Only retry if not the last attempt
                        if (attempt < maxRetries - 1) {
                            // Exponential backoff: 50ms, 100ms, 200ms, 400ms
                            const delay = 50 * Math.pow(2, attempt);
                            await new Promise(resolve => setTimeout(resolve, delay));
                            continue;
                        }
                        
                        throw new Error('Gagal membuat kode pengaduan setelah beberapa percobaan. Silakan coba lagi.');
                    }
                    throw error;
                }
                
                return result;
            } catch (error) {
                if (error.message === 'duplicate_key_pengaduan' && attempt < maxRetries - 1) {
                    continue;
                }
                
                lastError = error;
                
                // If it's not a duplicate key error, throw immediately
                if (!error.message.includes('kode_pengaduan') && !error.message.includes('duplicate')) {
                    throw new Error('Error creating pengaduan: ' + error.message);
                }
            }
        }

        // If we get here, all retries failed
        throw new Error('Error creating pengaduan: ' + (lastError?.message || 'Unknown error'));
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
