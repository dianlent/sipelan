// Generate bcrypt password hash
// Usage: node scripts/generate-password.js <password>

const bcrypt = require('bcryptjs');

const password = process.argv[2] || 'admin123';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    process.exit(1);
  }
  
  console.log('\n=================================');
  console.log('Password Hash Generated');
  console.log('=================================');
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nSQL to insert user:');
  console.log('---');
  console.log(`INSERT INTO users (username, email, password_hash, nama_lengkap, role, is_active)`);
  console.log(`VALUES ('admin', 'admin@disnaker.go.id', '${hash}', 'Administrator', 'admin', true)`);
  console.log(`ON CONFLICT (username) DO UPDATE SET password_hash = '${hash}';`);
  console.log('=================================\n');
});
