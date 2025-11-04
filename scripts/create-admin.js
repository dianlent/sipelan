// Script untuk membuat user admin dengan password yang sudah di-hash
const bcrypt = require('bcryptjs');

async function generateAdminSQL() {
    const password = 'admin123';
    const saltRounds = 10;
    
    // Generate password hash
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    console.log('='.repeat(80));
    console.log('SCRIPT SQL UNTUK MEMBUAT USER ADMIN');
    console.log('='.repeat(80));
    console.log('');
    console.log('-- Copy dan paste SQL di bawah ini ke Supabase SQL Editor');
    console.log('');
    console.log(`INSERT INTO users (
    username,
    email,
    password_hash,
    nama_lengkap,
    role,
    is_active
) VALUES (
    'admin',
    'admin@sipelan.com',
    '${passwordHash}',
    'Administrator SIPelan',
    'admin',
    true
);`);
    console.log('');
    console.log('='.repeat(80));
    console.log('KREDENSIAL LOGIN ADMIN:');
    console.log('='.repeat(80));
    console.log('Email    : admin@sipelan.com');
    console.log('Password : admin123');
    console.log('Role     : admin');
    console.log('='.repeat(80));
    console.log('');
    console.log('Setelah menjalankan SQL di atas, Anda bisa login dengan kredensial tersebut.');
    console.log('');
}

// Jalankan script
generateAdminSQL().catch(console.error);
