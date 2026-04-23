# Dalali Express - Cargo Tracking & Logistics Management System

A full-stack cargo tracking and logistics management system for "Dalali Express Services" built with **TypeScript**, featuring a modern React 18 frontend and Express.js backend with PostgreSQL database.

## 🎯 Features

### Public Features
- **Landing Page** - Company information with service highlights
- **Shipment Tracking** - Real-time tracking with complete history
- **Services Page** - Detailed information about all services
- **Contact Page** - Branch information and contact details

### Admin Features
- **JWT Authentication** - Secure login with token-based auth
- **Role-Based Access Control** - Super Admin and Branch Admin roles
- **Shipment Management** - Create, view, and update shipments
- **Status Tracking** - Track shipments throughout their journey
- **Dashboard Analytics** - Quick statistics and overview
- **User Management** (Super Admin Only) - Create and manage users
- **Branch Management** - View all branches and create new ones

## 🏗️ Tech Stack

### Backend
- **TypeScript** + Node.js + Express.js
- **PostgreSQL** - Database with connection pooling
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-Origin Resource Sharing
- **UUID** - Unique identifier generation

### Frontend
- **TypeScript** + React 18 with Vite
- **React Router v6** - SPA routing
- **Tailwind CSS** - Utility-first styling
- **PostCSS** - CSS processing
- **Axios** - HTTP client

## 📦 Project Structure

```
Dalali/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts      # PostgreSQL connection & pooling
│   │   │   └── constants.ts     # App constants & config values
│   │   ├── controllers/         # Request handlers
│   │   │   ├── authController.ts
│   │   │   ├── shipmentController.ts
│   │   │   ├── userController.ts
│   │   │   └── branchController.ts
│   │   ├── middleware/          # Express middleware
│   │   │   ├── auth.ts         # JWT verification
│   │   │   └── errorHandler.ts # Error handling
│   │   ├── routes/              # API routes
│   │   │   ├── authRoutes.ts
│   │   │   ├── shipmentRoutes.ts
│   │   │   ├── userRoutes.ts
│   │   │   └── branchRoutes.ts
│   │   ├── services/            # Business logic
│   │   │   ├── authService.ts
│   │   │   ├── shipmentService.ts
│   │   │   ├── userService.ts
│   │   │   └── branchService.ts
│   │   ├── utils/               # Utilities
│   │   │   ├── errorHandler.ts # Custom error classes
│   │   │   └── generateTrackingNumber.ts
│   │   ├── app.ts              # Express app setup
│   │   └── server.ts           # Server entry point
│   ├── package.json
│   ├── tsconfig.json           # TypeScript config
│   ├── .env.example
│   └── dist/                   # Compiled output
│
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Auth.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── Shipments.tsx
│   │   │   └── Tracking.tsx
│   │   ├── pages/              # Page components
│   │   │   ├── Public.tsx      # Public landing page
│   │   │   └── Admin.tsx       # Admin dashboard
│   │   ├── services/           # API services
│   │   │   ├── api.ts         # Axios configuration
│   │   │   ├── authService.ts
│   │   │   ├── shipmentService.ts
│   │   │   ├── userService.ts
│   │   │   ├── branchService.ts
│   │   │   └── utils.ts       # Frontend utilities
│   │   ├── App.tsx            # Main app component
│   │   ├── main.tsx           # React entry point
│   │   ├── index.css          # Global styles
│   │   └── vite-env.d.ts      # Vite type definitions
│   ├── public/                # Static assets
│   ├── dist/                  # Build output
│   ├── package.json
│   ├── tsconfig.json          # TypeScript config
│   ├── tsconfig.node.json     # Vite's TypeScript config
│   ├── vite.config.ts         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS config
│   ├── postcss.config.js      # PostCSS config
│   ├── .env.example
│   └── index.html
│
├── database/
│   └── schema.sql             # PostgreSQL schema
│
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** v16+ (v18+ recommended)
- **PostgreSQL** 12+
- **npm** v8+ or **yarn**

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```bash
cp .env.example .env
```

4. **Configure environment variables** in `.env`
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/dalali_db
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
CLIENT_URL=http://localhost:5173
JWT_EXPIRE=7d
```

5. **Setup PostgreSQL Database**
   - Create a new database: `dalali_db`
   - Import schema: `psql -U postgres -d dalali_db < ../database/schema.sql`
   - Or run the SQL commands from `database/schema.sql` in your PostgreSQL client

6. **Start development server**
```bash
npm run dev
```
Backend will run on `http://localhost:5000`

7. **Build for production**
```bash
npm run build
npm start
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```bash
cp .env.example .env
```

4. **Configure environment variables** in `.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

5. **Start development server**
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

6. **Build for production**
```bash
npm run build
```
Production build will be in `dist/` folder

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
  - Body: `{ email: string, password: string }`
  - Returns: `{ token: string, user: User }`

### Public Tracking
- `GET /api/shipments/track/:trackingNumber` - Track shipment
  - Returns: `{ shipment: Shipment, history: TrackingHistory[] }`

### Shipments (Protected)
- `GET /api/shipments` - Get all shipments (branch-filtered for branch admins)
- `POST /api/shipments` - Create new shipment
  - Body: `{ origin: string, destination: string, items: string, weight: number, recipient: string, recipientPhone: string, branchId: string }`
- `GET /api/shipments/:id` - Get shipment details
- `PUT /api/shipments/:id/status` - Update shipment status
  - Body: `{ status: string, notes?: string }`

### Users (Super Admin Only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
  - Body: `{ name: string, email: string, password: string, role: 'super_admin' | 'branch_admin', branchId?: string }`
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Branches
- `GET /api/branches` - Get all branches
- `GET /api/branches/:id` - Get branch details
- `POST /api/branches` - Create branch (Super Admin only)
  - Body: `{ name: string, city: string, manager: string, phone: string }`

## 🔐 Security

- Passwords hashed with **bcryptjs** (10 rounds)
- **JWT token-based authentication** (configurable expiration)
- **Role-based access control (RBAC)** middleware enforcement
- **CORS enabled** with client URL validation
- **Input validation** on all endpoints
- **Append-only tracking history** (immutable records)
- **Password reset capability** with secure tokens

## 📊 Database Schema

### Tables

**users**
- id (UUID) - Primary key
- name (string) - User name
- email (string) - Unique email
- password (string) - Hashed password
- role (enum) - 'super_admin' or 'branch_admin'
- branch_id (UUID, nullable) - Reference to branch
- created_at (timestamp)
- updated_at (timestamp)

**branches**
- id (UUID) - Primary key
- name (string) - Branch name
- city (string) - City location
- manager (string) - Manager name
- phone (string) - Contact phone
- created_at (timestamp)
- updated_at (timestamp)

**shipments**
- id (UUID) - Primary key
- tracking_number (string) - Unique tracking number
- origin (string) - Origin location
- destination (string) - Destination location
- items (string) - Description of items
- weight (number) - Weight in kg
- status (enum) - Current status
- recipient (string) - Recipient name
- recipient_phone (string) - Recipient phone
- branch_id (UUID) - Reference to branch
- created_at (timestamp)
- updated_at (timestamp)

**tracking_history**
- id (UUID) - Primary key
- shipment_id (UUID) - Reference to shipment
- status (string) - Status at this point
- notes (text, nullable) - Additional notes
- created_at (timestamp)

## 🎨 UI Features

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Status Color Indicators** - Visual status representation
- **Real-time Updates** - Live shipment tracking
- **Clean Modern UI** - Component-based architecture
- **Error Handling** - User-friendly error messages
- **Authentication Flow** - Login/logout with persisted sessions

## 🔄 Shipment Status Flow

1. **Created** - Initial status when shipment is created
2. **In Transit** - Shipment is on the way
3. **Out for Delivery** - Final mile delivery
4. **Delivered** - Successfully delivered
5. **Delayed** - Shipment delayed
6. **Cancelled** - Shipment cancelled

## 🛠️ Development Scripts

### Backend
```bash
npm run dev      # Start development server with auto-reload
npm run build    # Compile TypeScript to JavaScript
npm start        # Run compiled server
```

### Frontend
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build locally
```

## 📝 TypeScript Configuration

Both frontend and backend use strict TypeScript settings:
- ES2020 target for modern features
- Strict mode enabled
- Module resolution: node
- Automatic type definitions for dependencies

## 🚢 Deployment

### Backend Deployment (Node.js)
1. Build: `npm run build`
2. Deploy `dist/` folder with `package.json`
3. Set environment variables on production server
4. Run: `npm start`

### Frontend Deployment (Static)
1. Build: `npm run build`
2. Deploy contents of `dist/` folder to web server (Vercel, Netlify, etc.)
3. Set `VITE_API_BASE_URL` to production API URL

## 📄 License

ISC

## 👨‍💻 Support

For support, email info@dalali.com or call +20 100 123 4567

---

**Built with ❤️ for Dalali Express Services**
**Last Updated:** April 2026
