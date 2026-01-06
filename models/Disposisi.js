const db = require('../config/database');

class Disposisi {
    static async create(data) {
        try {
            const { rows } = await db.query(
                `
                    INSERT INTO disposisi (pengaduan_id, dari_bidang_id, ke_bidang_id, keterangan, user_id, created_at)
                    VALUES ($1, $2, $3, $4, $5, NOW())
                    RETURNING *
                `,
                [
                    data.pengaduan_id,
                    data.dari_bidang_id || null,
                    data.ke_bidang_id,
                    data.keterangan,
                    data.user_id || null
                ]
            );

            const disposisi = rows[0];

            const detailResult = await db.query(
                `
                    SELECT
                        d.*,
                        json_build_object('kode_pengaduan', p.kode_pengaduan, 'judul_pengaduan', p.judul_pengaduan) AS pengaduan,
                        json_build_object('nama_bidang', dbi.nama_bidang, 'kode_bidang', dbi.kode_bidang) AS dari_bidang,
                        json_build_object('nama_bidang', kbi.nama_bidang, 'kode_bidang', kbi.kode_bidang) AS ke_bidang,
                        json_build_object('username', u.username, 'nama_lengkap', u.nama_lengkap) AS users
                    FROM disposisi d
                    LEFT JOIN pengaduan p ON p.id = d.pengaduan_id
                    LEFT JOIN bidang dbi ON dbi.id = d.dari_bidang_id
                    LEFT JOIN bidang kbi ON kbi.id = d.ke_bidang_id
                    LEFT JOIN users u ON u.id = d.user_id
                    WHERE d.id = $1
                    LIMIT 1
                `,
                [disposisi.id]
            );

            return detailResult.rows[0];
        } catch (error) {
            throw new Error('Error creating disposisi: ' + error.message);
        }
    }

    static async findByPengaduanId(pengaduanId) {
        try {
            const { rows } = await db.query(
                `
                    SELECT
                        d.*,
                        json_build_object('kode_pengaduan', p.kode_pengaduan, 'judul_pengaduan', p.judul_pengaduan) AS pengaduan,
                        json_build_object('nama_bidang', dbi.nama_bidang, 'kode_bidang', dbi.kode_bidang) AS dari_bidang,
                        json_build_object('nama_bidang', kbi.nama_bidang, 'kode_bidang', kbi.kode_bidang) AS ke_bidang,
                        json_build_object('username', u.username, 'nama_lengkap', u.nama_lengkap) AS users
                    FROM disposisi d
                    LEFT JOIN pengaduan p ON p.id = d.pengaduan_id
                    LEFT JOIN bidang dbi ON dbi.id = d.dari_bidang_id
                    LEFT JOIN bidang kbi ON kbi.id = d.ke_bidang_id
                    LEFT JOIN users u ON u.id = d.user_id
                    WHERE d.pengaduan_id = $1
                    ORDER BY d.created_at ASC
                `,
                [pengaduanId]
            );

            return rows;
        } catch (error) {
            throw new Error('Error finding disposisi by pengaduan: ' + error.message);
        }
    }

    static async findByBidang(bidangId, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;

            const countResult = await db.query(
                'SELECT COUNT(*)::text AS count FROM disposisi WHERE ke_bidang_id = $1',
                [bidangId]
            );
            const count = parseInt(countResult.rows[0]?.count || '0', 10);

            const { rows } = await db.query(
                `
                    SELECT
                        d.*,
                        json_build_object('kode_pengaduan', p.kode_pengaduan, 'judul_pengaduan', p.judul_pengaduan, 'status', p.status) AS pengaduan,
                        json_build_object('nama_bidang', dbi.nama_bidang, 'kode_bidang', dbi.kode_bidang) AS dari_bidang,
                        json_build_object('nama_bidang', kbi.nama_bidang, 'kode_bidang', kbi.kode_bidang) AS ke_bidang,
                        json_build_object('username', u.username, 'nama_lengkap', u.nama_lengkap) AS users
                    FROM disposisi d
                    LEFT JOIN pengaduan p ON p.id = d.pengaduan_id
                    LEFT JOIN bidang dbi ON dbi.id = d.dari_bidang_id
                    LEFT JOIN bidang kbi ON kbi.id = d.ke_bidang_id
                    LEFT JOIN users u ON u.id = d.user_id
                    WHERE d.ke_bidang_id = $1
                    ORDER BY d.created_at DESC
                    LIMIT $2 OFFSET $3
                `,
                [bidangId, limit, offset]
            );

            return {
                data: rows,
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
            const conditions = [];
            const params = [];

            if (filters.dari_bidang_id) {
                params.push(filters.dari_bidang_id);
                conditions.push(`d.dari_bidang_id = $${params.length}`);
            }
            if (filters.ke_bidang_id) {
                params.push(filters.ke_bidang_id);
                conditions.push(`d.ke_bidang_id = $${params.length}`);
            }

            const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

            const countResult = await db.query(
                `SELECT COUNT(*)::text AS count FROM disposisi d ${whereClause}`,
                params
            );
            const count = parseInt(countResult.rows[0]?.count || '0', 10);

            const listParams = [...params, limit, offset];
            const { rows } = await db.query(
                `
                    SELECT
                        d.*,
                        json_build_object('kode_pengaduan', p.kode_pengaduan, 'judul_pengaduan', p.judul_pengaduan, 'status', p.status) AS pengaduan,
                        json_build_object('nama_bidang', dbi.nama_bidang, 'kode_bidang', dbi.kode_bidang) AS dari_bidang,
                        json_build_object('nama_bidang', kbi.nama_bidang, 'kode_bidang', kbi.kode_bidang) AS ke_bidang,
                        json_build_object('username', u.username, 'nama_lengkap', u.nama_lengkap) AS users
                    FROM disposisi d
                    LEFT JOIN pengaduan p ON p.id = d.pengaduan_id
                    LEFT JOIN bidang dbi ON dbi.id = d.dari_bidang_id
                    LEFT JOIN bidang kbi ON kbi.id = d.ke_bidang_id
                    LEFT JOIN users u ON u.id = d.user_id
                    ${whereClause}
                    ORDER BY d.created_at DESC
                    LIMIT $${listParams.length - 1} OFFSET $${listParams.length}
                `,
                listParams
            );

            return {
                data: rows,
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
            const { rows } = await db.query(
                `
                    UPDATE pengaduan
                    SET bidang_id = $1, updated_at = NOW()
                    WHERE id = $2
                    RETURNING *
                `,
                [bidangId, pengaduanId]
            );
            return rows[0];
        } catch (error) {
            throw new Error('Error updating pengaduan bidang: ' + error.message);
        }
    }

    static async delete(id) {
        try {
            await db.query('DELETE FROM disposisi WHERE id = $1', [id]);
            return true;
        } catch (error) {
            throw new Error('Error deleting disposisi: ' + error.message);
        }
    }

    static async getBidangList() {
        try {
            const { rows } = await db.query('SELECT * FROM bidang ORDER BY nama_bidang');
            return rows;
        } catch (error) {
            throw new Error('Error getting bidang list: ' + error.message);
        }
    }
}

module.exports = Disposisi;
