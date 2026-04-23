const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_7yoc8UmuaxjV@ep-late-resonance-anv0u9yc-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require'
});

(async () => {
  const client = await pool.connect();
  try {
    console.log('🔐 Creating super admin user...\n');
    
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
    
    const result = await client.query(query, [
      'Super Admin',
      email,
      hashedPassword,
      'super_admin'
    ]);
    
    console.log('✅ Super Admin User Created!\n');
    console.log('📋 LOGIN CREDENTIALS:');
    console.log('═══════════════════════════════════');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${plainPassword}`);
    console.log('═══════════════════════════════════\n');
    console.log('🌐 Access the application:');
    console.log('   Frontend: http://localhost:5173');
    console.log('   Backend:  http://localhost:5000/api\n');
    console.log('📍 Login Steps:');
    console.log('   1. Go to http://localhost:5173');
    console.log('   2. Click "Admin Login"');
    console.log('   3. Enter credentials above');
    console.log('   4. Access dashboard\n');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    await pool.end();
  }
})();
