const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_7yoc8UmuaxjV@ep-late-resonance-anv0u9yc-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require'
});

(async () => {
  const client = await pool.connect();
  try {
    console.log('📦 Initializing database schema...');
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSql);
    console.log('✅ Database schema initialized successfully!');
    const result = await client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' ORDER BY table_name');
    console.log('📋 Tables created:');
    result.rows.forEach(row => console.log('   ✓ ' + row.table_name));
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    await pool.end();
  }
})();
