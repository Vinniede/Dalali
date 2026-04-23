const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_7yoc8UmuaxjV@ep-late-resonance-anv0u9yc-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require'
});

async function initializeDatabase() {
  const client = await pool.connect();
  try {
    console.log('📦 Initializing database schema...');
    
    // Read SQL schema file
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema
    await client.query(schemaSql);
    
    console.log('✅ Database schema initialized successfully!');
    console.log('📝 Tables created: branches, users, shipments, tracking_history');
    console.log('🌱 Sample data inserted: 5 sample branches');
    
    // Verify tables
    const result = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' ORDER BY table_name
    `);
    
    console.log('\n📋 Database Tables:');
    result.rows.forEach(row => console.log(`   ✓ ${row.table_name}`));
    
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    await pool.end();
  }
}

initializeDatabase().then(() => {
  console.log('\n✨ Database ready! You can now start the server.');
  process.exit(0);
});
