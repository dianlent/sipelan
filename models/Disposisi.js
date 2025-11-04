const supabase = require('../config/database');

class Disposisi {
    static async create(data) {
        try {
            const { data: result, error } = await supabase
                .from('disposisi')
                .insert([data])
                .select(`
                    *,
                    pengaduan (kode_pengaduan, judul_pengaduan),
                    dari_bidang:bidang!disposisi_dari_bidang_id_fkey (nama_bidang, kode_bidang),
                    ke_bidang:bidang!disposisi_ke_bidang_id_fkey (nama_bidang, kode_bidang),
                    users (username, nama_lengkap)
                `)
                .single();

            if (error) throw error;
            return result;
        } catch (error) {
            throw new Error('Error creating disposisi: ' + error.message);
        }
    }

    static async findByPengaduanId(pengaduanId) {
        try {
            const { data, error } = await supabase
                .from('disposisi')
                .select(`
                    *,
                    pengaduan (kode_pengaduan, judul_pengaduan),
                    dari_bidang:bidang!disposisi_dari_bidang_id_fkey (nama_bidang, kode_bidang),
                    ke_bidang:bidang!disposisi_ke_bidang_id_fkey (nama_bidang, kode_bidang),
                    users (username, nama_lengkap)
                `)
                .eq('pengaduan_id', pengaduanId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error('Error finding disposisi by pengaduan: ' + error.message);
        }
    }

    static async findByBidang(bidangId, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            
            const { data, error, count } = await supabase
                .from('disposisi')
                .select(`
                    *,
                    pengaduan (kode_pengaduan, judul_pengaduan, status),
                    dari_bidang:bidang!disposisi_dari_bidang_id_fkey (nama_bidang, kode_bidang),
                    ke_bidang:bidang!disposisi_ke_bidang_id_fkey (nama_bidang, kode_bidang),
                    users (username, nama_lengkap)
                `, { count: 'exact' })
                .eq('ke_bidang_id', bidangId)
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
            throw new Error('Error finding disposisi by bidang: ' + error.message);
        }
    }

    static async findAll(page = 1, limit = 10, filters = {}) {
        try {
            const offset = (page - 1) * limit;
            let query = supabase
                .from('disposisi')
                .select(`
                    *,
                    pengaduan (kode_pengaduan, judul_pengaduan, status),
                    dari_bidang:bidang!disposisi_dari_bidang_id_fkey (nama_bidang, kode_bidang),
                    ke_bidang:bidang!disposisi_ke_bidang_id_fkey (nama_bidang, kode_bidang),
                    users (username, nama_lengkap)
                `, { count: 'exact' })
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);

            if (filters.dari_bidang_id) {
                query = query.eq('dari_bidang_id', filters.dari_bidang_id);
            }
            if (filters.ke_bidang_id) {
                query = query.eq('ke_bidang_id', filters.ke_bidang_id);
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
            throw new Error('Error finding all disposisi: ' + error.message);
        }
    }

    static async updatePengaduanBidang(pengaduanId, bidangId) {
        try {
            const { data, error } = await supabase
                .from('pengaduan')
                .update({ 
                    bidang_id: bidangId,
                    updated_at: new Date()
                })
                .eq('id', pengaduanId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error('Error updating pengaduan bidang: ' + error.message);
        }
    }

    static async delete(id) {
        try {
            const { error } = await supabase
                .from('disposisi')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            throw new Error('Error deleting disposisi: ' + error.message);
        }
    }

    static async getBidangList() {
        try {
            const { data, error } = await supabase
                .from('bidang')
                .select('*')
                .order('nama_bidang');

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error('Error getting bidang list: ' + error.message);
        }
    }
}

module.exports = Disposisi;
