import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const ensureDatabaseSchema = async (): Promise<void> => {
  await pool.query(`
    ALTER TABLE shipments
    ADD COLUMN IF NOT EXISTS origin_country VARCHAR(100)
  `);

  await pool.query(`
    ALTER TABLE shipments
    ALTER COLUMN origin_branch_id DROP NOT NULL
  `);

  await pool.query(`
    ALTER TABLE tracking_history
    ALTER COLUMN branch_id DROP NOT NULL
  `);
};

export default pool;
