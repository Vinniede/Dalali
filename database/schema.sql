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
  receiver_name VARCHAR(255) NOT NULL,
  origin_branch_id INTEGER NOT NULL REFERENCES branches(id),
  destination VARCHAR(255) NOT NULL,
  current_status VARCHAR(100) NOT NULL DEFAULT 'Created',
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
CREATE INDEX idx_shipments_tracking_number ON shipments(tracking_number);
CREATE INDEX idx_shipments_origin_branch_id ON shipments(origin_branch_id);
CREATE INDEX idx_tracking_history_shipment_id ON tracking_history(shipment_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Insert sample branches
INSERT INTO branches (name, country, phone) VALUES
  ('Cairo Main', 'Egypt', '+20 100 123 4567'),
  ('Alexandria Branch', 'Egypt', '+20 100 234 5678'),
  ('Giza Hub', 'Egypt', '+20 100 345 6789'),
  ('Suez Terminal', 'Egypt', '+20 100 456 7890'),
  ('Dubai Center', 'UAE', '+971 4 123 4567')
ON CONFLICT DO NOTHING;

-- Note: Add super admin user setup manually:
-- Use bcryptjs to hash the password first, then insert:
-- INSERT INTO users (name, email, password, role, branch_id)
-- VALUES ('Super Admin', 'admin@dalali.com', 'hashed_password_here', 'super_admin', NULL);
