const db = require('../config/database');

class Pengaduan {
    static async create(data) {
        const maxRetries = 5;
        let lastError = null;

        const insertData = { ...data };
        delete insertData.kode_pengaduan;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const { rows } = await db.query(
                    `
                        INSERT INTO pengaduan (
                            user_id,
                            kategori_id,
                            judul_pengaduan,
                            isi_pengaduan,
                            lokasi_kejadian,
                            tanggal_kejadian,
                            status,
                            bidang_id,
                            kode_bidang,
                            file_bukti,
                            nama_pelapor,
                            email_pelapor,
                            no_telepon,
                            nik,
                            anonim
                        )
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
                        RETURNING *
                    `,
                    [
                        insertData.user_id || null,
                        insertData.kategori_id || null,
                        insertData.judul_pengaduan,
                        insertData.isi_pengaduan,
                        insertData.lokasi_kejadian || null,
                        insertData.tanggal_kejadian || null,
                        insertData.status || 'masuk',
                        insertData.bidang_id || null,
                        insertData.kode_bidang || null,
                        insertData.file_bukti || null,
                        insertData.nama_pelapor || null,
                        insertData.email_pelapor || null,
                        insertData.no_telepon || null,
                        insertData.nik || null,
                        insertData.anonim || false
                    ]
                );

                return rows[0];
            } catch (error) {
                if (error.code === '23505' && String(error.message || '').includes('kode_pengaduan')) {
                    lastError = new Error('duplicate_key_pengaduan');

                    if (attempt < maxRetries - 1) {
                        const delay = 50 * Math.pow(2, attempt);
                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue;
                    }

                    throw new Error('Gagal membuat kode pengaduan setelah beberapa percobaan. Silakan coba lagi.');
                }

                lastError = error;
                if (!String(error.message || '').includes('kode_pengaduan') && !String(error.message || '').includes('duplicate')) {
                    throw new Error('Error creating pengaduan: ' + error.message);
                }
            }
        }

        throw new Error('Error creating pengaduan: ' + (lastError?.message || 'Unknown error'));
    }

    static async findById(id) {
        try {
            const { rows } = await db.query(
                `
                    SELECT
                        p.*,
                        json_build_object('id', k.id, 'nama_kategori', k.nama_kategori, 'deskripsi', k.deskripsi) AS kategori_pengaduan,
                        json_build_object('nama_bidang', b.nama_bidang, 'kode_bidang', b.kode_bidang) AS bidang,
                        json_build_object('username', u.username, 'email', u.email, 'nama_lengkap', u.nama_lengkap) AS users
                    FROM pengaduan p
                    LEFT JOIN kategori_pengaduan k ON k.id = p.kategori_id
                    LEFT JOIN users u ON u.id = p.user_id
                    LEFT JOIN bidang b ON b.id = p.bidang_id
                    WHERE p.id = $1
                    LIMIT 1
                `,
                [id]
            );

            return rows[0];
        } catch (error) {
            throw new Error('Error finding pengaduan: ' + error.message);
        }
    }

    static async findByKode(kode) {
        try {
            const { rows } = await db.query(
                `
                    SELECT
                        p.*,
                        json_build_object('id', k.id, 'nama_kategori', k.nama_kategori, 'deskripsi', k.deskripsi) AS kategori_pengaduan,
                        json_build_object('username', u.username, 'email', u.email, 'nama_lengkap', u.nama_lengkap) AS users,
                        json_build_object('nama_bidang', b.nama_bidang, 'kode_bidang', b.kode_bidang) AS bidang
                    FROM pengaduan p
                    LEFT JOIN kategori_pengaduan k ON k.id = p.kategori_id
                    LEFT JOIN users u ON u.id = p.user_id
                    LEFT JOIN bidang b ON b.id = p.bidang_id
                    WHERE p.kode_pengaduan = $1
                    LIMIT 1
                `,
                [kode]
            );

            return rows[0];
        } catch (error) {
            throw new Error('Error finding pengaduan: ' + error.message);
        }
    }

    static async findByUserId(userId, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;

            const countResult = await db.query(
                'SELECT COUNT(*)::text AS count FROM pengaduan WHERE user_id = $1',
                [userId]
            );
            const count = parseInt(countResult.rows[0]?.count || '0', 10);

            const { rows } = await db.query(
                `
                    SELECT
                        p.*,
                        json_build_object('id', k.id, 'nama_kategori', k.nama_kategori, 'deskripsi', k.deskripsi) AS kategori_pengaduan,
                        json_build_object('nama_bidang', b.nama_bidang, 'kode_bidang', b.kode_bidang) AS bidang
                    FROM pengaduan p
                    LEFT JOIN kategori_pengaduan k ON k.id = p.kategori_id
                    LEFT JOIN bidang b ON b.id = p.bidang_id
                    WHERE p.user_id = $1
                    ORDER BY p.created_at DESC
                    LIMIT $2 OFFSET $3
                `,
                [userId, limit, offset]
            );

            return {
                data: rows,
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

            const countResult = await db.query(
                'SELECT COUNT(*)::text AS count FROM pengaduan WHERE bidang_id = $1',
                [bidangId]
            );
            const count = parseInt(countResult.rows[0]?.count || '0', 10);

            const { rows } = await db.query(
                `
                    SELECT
                        p.*,
                        json_build_object('id', k.id, 'nama_kategori', k.nama_kategori, 'deskripsi', k.deskripsi) AS kategori_pengaduan,
                        json_build_object('username', u.username, 'email', u.email, 'nama_lengkap', u.nama_lengkap) AS users
                    FROM pengaduan p
                    LEFT JOIN kategori_pengaduan k ON k.id = p.kategori_id
                    LEFT JOIN users u ON u.id = p.user_id
                    WHERE p.bidang_id = $1
                    ORDER BY p.created_at DESC
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
            throw new Error('Error finding pengaduan by bidang: ' + error.message);
        }
    }

    static async findAll(page = 1, limit = 10, filters = {}) {
        try {
            const offset = (page - 1) * limit;
            const conditions = [];
            const params = [];

            if (filters.status) {
                params.push(filters.status);
                conditions.push(`p.status = $${params.length}`);
            }
            if (filters.kategori_id) {
                params.push(filters.kategori_id);
                conditions.push(`p.kategori_id = $${params.length}`);
            }
            if (filters.bidang_id) {
                params.push(filters.bidang_id);
                conditions.push(`p.bidang_id = $${params.length}`);
            }

            const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

            const countResult = await db.query(
                `SELECT COUNT(*)::text AS count FROM pengaduan p ${whereClause}`,
                params
            );
            const count = parseInt(countResult.rows[0]?.count || '0', 10);

            const listParams = [...params, limit, offset];
            const { rows } = await db.query(
                `
                    SELECT
                        p.*,
                        json_build_object('id', k.id, 'nama_kategori', k.nama_kategori, 'deskripsi', k.deskripsi) AS kategori_pengaduan,
                        json_build_object('username', u.username, 'email', u.email, 'nama_lengkap', u.nama_lengkap) AS users,
                        json_build_object('nama_bidang', b.nama_bidang, 'kode_bidang', b.kode_bidang) AS bidang
                    FROM pengaduan p
                    LEFT JOIN kategori_pengaduan k ON k.id = p.kategori_id
                    LEFT JOIN users u ON u.id = p.user_id
                    LEFT JOIN bidang b ON b.id = p.bidang_id
                    ${whereClause}
                    ORDER BY p.created_at DESC
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
            throw new Error('Error finding all pengaduan: ' + error.message);
        }
    }

    static async updateStatus(id, status, userId, keterangan = '') {
        try {
            const { rows } = await db.query(
                `
                    UPDATE pengaduan
                    SET status = $1, updated_at = NOW()
                    WHERE id = $2
                    RETURNING *
                `,
                [status, id]
            );

            const pengaduan = rows[0];

            await db.query(
                `
                    INSERT INTO pengaduan_status (pengaduan_id, status, keterangan, user_id)
                    VALUES ($1, $2, $3, $4)
                `,
                [id, status, keterangan, userId]
            );

            return pengaduan;
        } catch (error) {
            throw new Error('Error updating pengaduan status: ' + error.message);
        }
    }

    static async update(id, data) {
        try {
            const entries = Object.entries(data || {});
            const updates = entries.map(([key], index) => `${key} = $${index + 1}`);
            const params = entries.map(([, value]) => value);
            params.push(id);

            const { rows } = await db.query(
                `
                    UPDATE pengaduan
                    SET ${updates.join(', ')}, updated_at = NOW()
                    WHERE id = $${params.length}
                    RETURNING *
                `,
                params
            );

            return rows[0];
        } catch (error) {
            throw new Error('Error updating pengaduan: ' + error.message);
        }
    }

    static async delete(id) {
        try {
            await db.query('DELETE FROM pengaduan WHERE id = $1', [id]);
            return true;
        } catch (error) {
            throw new Error('Error deleting pengaduan: ' + error.message);
        }
    }
}

module.exports = Pengaduan;
