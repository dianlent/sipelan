// Script untuk membuat user untuk setiap bidang dengan password yang sudah di-hash
const bcrypt = require('bcryptjs');

async function generateBidangUsersSQL() {
    const password = 'bidang123';
    const saltRounds = 10;
    
    // Generate password hash
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    const bidangList = [
        {
            username: 'bidang_hi',
            email: 'hi@disnaker.go.id',
            nama: 'Kepala Bidang Hubungan Industrial',
            kode: 'HI'
        },
        {
            username: 'bidang_lattas',
            email: 'lattas@disnaker.go.id',
            nama: 'Kepala Bidang Latihan Kerja dan Produktivitas',
            kode: 'LATTAS'
        },
        {
            username: 'bidang_ptpk',
            email: 'ptpk@disnaker.go.id',
            nama: 'Kepala Bidang PTPK',
            kode: 'PTPK'
        },
        {
            username: 'bidang_blk',
            email: 'blk@disnaker.go.id',
            nama: 'Kepala UPTD BLK Pati',
            kode: 'BLK'
        },
        {
            username: 'bidang_sekretariat',
            email: 'sekretariat@disnaker.go.id',
            nama: 'Kepala Sekretariat',
            kode: 'SEKRETARIAT'
        }
    ];
    
    console.log('='.repeat(80));
    console.log('SCRIPT SQL UNTUK MEMBUAT USER BIDANG');
    console.log('='.repeat(80));
    console.log('');
    console.log('-- Copy dan paste SQL di bawah ini ke Supabase SQL Editor');
    console.log('');
    
    bidangList.forEach((bidang, index) => {
        console.log(`-- ${index + 1}. User untuk ${bidang.nama} (${bidang.kode})`);
        console.log(`INSERT INTO users (
    username,
    email,
    password_hash,
    nama_lengkap,
    role,
    kode_bidang,
    is_active
) VALUES (
    '${bidang.username}',
    '${bidang.email}',
    '${passwordHash}',
    '${bidang.nama}',
    'bidang',
    '${bidang.kode}',
    true
);
`);
    });
    
    console.log('');
    console.log('='.repeat(80));
    console.log('KREDENSIAL LOGIN UNTUK SETIAP BIDANG:');
    console.log('='.repeat(80));
    console.log('');
    
    bidangList.forEach((bidang, index) => {
        console.log(`${index + 1}. ${bidang.nama.toUpperCase()} (${bidang.kode})`);
        console.log(`   Email    : ${bidang.email}`);
        console.log(`   Password : ${password}`);
        console.log(`   Username : ${bidang.username}`);
        console.log('');
    });
    
    console.log('='.repeat(80));
    console.log('');
    console.log('Setelah menjalankan SQL di atas, setiap bidang bisa login dengan kredensial masing-masing.');
    console.log('');
}

// Jalankan script
generateBidangUsersSQL().catch(console.error);
