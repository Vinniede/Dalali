import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

(async () => {
  const client = await pool.connect();
  try {
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║   🌱 Dalali Express Database Seeder       ║');
    console.log('╚════════════════════════════════════════════╝\n');

    // Step 1: Initialize database schema
    console.log('📦 Step 1: Initializing database schema...');
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSql);
    console.log('✅ Database schema initialized successfully!\n');

    // Step 2: Verify tables
    console.log('📋 Verifying database tables:');
    const result = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' ORDER BY table_name
    `);
    result.rows.forEach(row => console.log(`   ✓ ${row.table_name}`));
    console.log('');

    // Step 3: Clear old branches and insert new ones
    console.log('🧹 Step 2: Setting up branches...');
    await client.query('DELETE FROM branches');
    
    const branchesInsert = `
      INSERT INTO branches (name, country, phone) VALUES
        ('Dar es Salaam', 'Tanzania', '+255 654 321 987'),
        ('Kinshasa', 'DRC', '+243 812 345 678'),
        ('Entebbe', 'Uganda', '+256 702 123 456')
      RETURNING id, name, country;
    `;
    
    const branchesResult = await client.query(branchesInsert);
    console.log('✅ Branches configured successfully!');
    branchesResult.rows.forEach(row => console.log(`   ✓ ${row.name} (${row.country})`));
    console.log('');

    // Step 4: Create super admin user
    console.log('🔐 Step 3: Creating super admin user...');
    const email = 'admin@dalali.com';
    const plainPassword = 'Admin@2024!';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const query = `
      INSERT INTO users (name, email, password, role, branch_id)
      VALUES ($1, $2, $3, $4, NULL)
      ON CONFLICT (email) DO UPDATE SET 
        password = $3,
        role = $4
      RETURNING id, name, email, role;
    `;

    const adminResult = await client.query(query, [
      'Super Admin',
      email,
      hashedPassword,
      'super_admin'
    ]);

    console.log('✅ Super Admin user created successfully!\n');

    // Display credentials
    console.log('╔════════════════════════════════════════════╗');
    console.log('║   📝 LOGIN CREDENTIALS                    ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${plainPassword}`);
    console.log('╔════════════════════════════════════════════╝\n');

    console.log('🌐 Access the application:');
    console.log('   Frontend: http://localhost:5173');
    console.log('   Backend:  http://localhost:5000/api\n');

    console.log('📍 Login Steps:');
    console.log('   1. Go to http://localhost:5173');
    console.log('   2. Click "Admin Login"');
    console.log('   3. Enter credentials above');
    console.log('   4. Access dashboard\n');

    console.log('✨ Database seeding completed successfully!\n');

  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    await pool.end();
  }
})();
