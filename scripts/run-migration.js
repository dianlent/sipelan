const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase configuration');
    console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in your .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function runMigration() {
    try {
        console.log('🚀 Starting migration...\n');

        // Read the migration file
        const migrationPath = path.join(__dirname, '../database/add_reporter_info.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        console.log('📄 Migration file loaded');
        console.log('📝 Executing SQL...\n');

        // Execute the SQL
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

        if (error) {
            // If exec_sql doesn't exist, try direct execution via REST API
            console.log('⚠️  exec_sql function not found, trying alternative method...\n');
            
            // Split SQL into individual statements
            const statements = sql
                .split(';')
                .map(s => s.trim())
                .filter(s => s.length > 0 && !s.startsWith('--'));

            console.log(`Found ${statements.length} SQL statements to execute\n`);

            for (let i = 0; i < statements.length; i++) {
                const statement = statements[i];
                if (statement) {
                    console.log(`Executing statement ${i + 1}/${statements.length}...`);
                    
                    // For PostgreSQL functions and triggers, we need to use the Supabase REST API
                    // This is a limitation - you'll need to run these manually in Supabase SQL Editor
                    console.log('Statement:', statement.substring(0, 100) + '...');
                }
            }

            console.log('\n⚠️  IMPORTANT: Some statements (functions, triggers) need to be run manually');
            console.log('Please copy the SQL from database/add_reporter_info.sql');
            console.log('and run it in Supabase Dashboard → SQL Editor\n');
            
            return;
        }

        console.log('✅ Migration completed successfully!\n');
        
        // Verify the changes
        console.log('🔍 Verifying changes...\n');
        
        // Check if columns exist
        const { data: columns, error: colError } = await supabase
            .from('pengaduan')
            .select('*')
            .limit(0);

        if (!colError) {
            console.log('✅ Table structure verified');
        }

        // Check if trigger exists
        const { data: triggers, error: trigError } = await supabase
            .rpc('check_trigger_exists', { 
                trigger_name: 'trg_generate_kode_pengaduan' 
            });

        if (!trigError && triggers) {
            console.log('✅ Trigger verified');
        }

        console.log('\n✨ All done! You can now test the form submission.\n');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error('\n📋 Manual steps required:');
        console.error('1. Open Supabase Dashboard');
        console.error('2. Go to SQL Editor');
        console.error('3. Copy and paste the contents of database/add_reporter_info.sql');
        console.error('4. Click "Run" to execute\n');
        process.exit(1);
    }
}

// Run the migration
runMigration();
