-- Dalali Express Cargo Tracking System Database Schema

-- Create branches table
CREATE TABLE IF NOT EXISTS branches (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  country VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'branch_admin')),
  branch_id INTEGER REFERENCES branches(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id SERIAL PRIMARY KEY,
  tracking_number VARCHAR(50) NOT NULL UNIQUE,
  sender_name VARCHAR(255) NOT NULL,
  sender_phone VARCHAR(20),
  sender_address TEXT,
  receiver_name VARCHAR(255) NOT NULL,
  receiver_phone VARCHAR(20),
  receiver_address TEXT,
  origin_branch_id INTEGER NOT NULL REFERENCES branches(id),
  destination VARCHAR(255) NOT NULL,
  cargo_description TEXT,
  weight DECIMAL(10, 2),
  volume DECIMAL(10, 2),
  service_type VARCHAR(100) DEFAULT 'Standard',
  current_status VARCHAR(100) NOT NULL DEFAULT 'Created',
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add missing columns to shipments table if they don't exist (for existing databases)
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS sender_phone VARCHAR(20);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS sender_address TEXT;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS receiver_phone VARCHAR(20);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS receiver_address TEXT;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS cargo_description TEXT;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS weight DECIMAL(10, 2);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS volume DECIMAL(10, 2);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS service_type VARCHAR(100) DEFAULT 'Standard';
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS origin_country VARCHAR(100);

-- Create tracking_history table
CREATE TABLE IF NOT EXISTS tracking_history (
  id SERIAL PRIMARY KEY,
  shipment_id INTEGER NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  branch_id INTEGER NOT NULL REFERENCES branches(id),
  location VARCHAR(255),
  status VARCHAR(100) NOT NULL,
  description TEXT,
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_origin_branch_id ON shipments(origin_branch_id);
CREATE INDEX IF NOT EXISTS idx_tracking_history_shipment_id ON tracking_history(shipment_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Note: Branches are seeded via the seeder script
-- Use bcryptjs to hash the password first, then insert:
-- INSERT INTO users (name, email, password, role, branch_id)
-- VALUES ('Super Admin', 'admin@dalali.com', 'hashed_password_here', 'super_admin', NULL);
