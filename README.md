# Dalali Express - Cargo Tracking & Logistics Management System

A full-stack cargo tracking and logistics management system for "Dalali Express Services" built with **TypeScript**, featuring a modern React 18 frontend and Express.js backend with PostgreSQL database.

## 🎯 Features

### ✨ Public Features

- **Landing Page** - Company information with service highlights
- **Shipment Tracking** - Search by order number, view full tracking history
- **Order Number Display** - Unique DEX-format tracking numbers (e.g., DEX123456ABC)
- **Public Tracking Timeline** - Complete shipment journey with timestamps
- **Services Page** - Detailed information about all services
- **Contact Page** - Branch information and contact details

### 🔐 Admin Features

- **JWT Authentication** - Secure login with token-based auth
- **Role-Based Access Control** - Super Admin and Branch Admin roles
- **Comprehensive Shipment Management** - Create with all details (sender, receiver, cargo, service type)
- **Order Number Success Modal** - Displays tracking number prominently after creation
- **Status Tracking** - Track shipments throughout their journey with history
- **Dashboard Analytics** - Quick statistics and overview
- **User Management** (Super Admin Only) - Create and manage users
- **Branch Management** - View all branches (3 pre-configured East African branches)
- **Shipment Details View** - Complete view with sender/receiver info, cargo details, and tracking timeline

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
├── src/                         # Backend TypeScript source
│   ├── config/                  # Configuration
│   │   ├── database.ts          # PostgreSQL connection & pooling
│   │   └── constants.ts         # App constants & config values
│   ├── controllers/             # Request handlers
│   │   ├── authController.ts
│   │   ├── shipmentController.ts
│   │   ├── userController.ts
│   │   └── branchController.ts
│   ├── middleware/              # Express middleware
│   │   ├── auth.ts              # JWT verification
│   │   └── errorHandler.ts      # Error handling
│   ├── routes/                  # API routes
│   │   ├── authRoutes.ts
│   │   ├── shipmentRoutes.ts
│   │   ├── userRoutes.ts
│   │   └── branchRoutes.ts
│   ├── services/                # Business logic
│   │   ├── authService.ts
│   │   ├── shipmentService.ts
│   │   ├── userService.ts
│   │   └── branchService.ts
│   ├── utils/                   # Utilities
│   │   ├── errorHandler.ts      # Custom error classes
│   │   └── generateTrackingNumber.ts
│   ├── app.ts                   # Express app setup
│   └── server.ts                # Server entry point
│
├── api/                         # API route handlers
│   ├── [...path].ts             # Dynamic API routes
│   └── index.ts
│
├── database/                    # Database schema
│   └── schema.sql               # PostgreSQL schema
│
├── seeds/                       # Database seeders
│   └── seeder.js                # Seed script
│
├── frontend/                    # React 18 frontend
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── Auth.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── Shipments.tsx
│   │   │   └── Tracking.tsx
│   │   ├── pages/               # Page components
│   │   │   ├── Public.tsx       # Public landing page
│   │   │   └── Admin.tsx        # Admin dashboard
│   │   ├── services/            # API services
│   │   │   ├── api.ts           # Axios configuration
│   │   │   ├── authService.ts
│   │   │   ├── shipmentService.ts
│   │   │   ├── userService.ts
│   │   │   ├── branchService.ts
│   │   │   └── utils.ts         # Frontend utilities
│   │   ├── App.tsx              # Main app component
│   │   ├── main.tsx             # React entry point
│   │   ├── index.css            # Global styles
│   │   └── vite-env.d.ts        # Vite type definitions
│   ├── public/                  # Static assets
│   ├── dist/                    # Build output
│   ├── package.json
│   ├── tsconfig.json            # TypeScript config
│   ├── tsconfig.node.json       # Vite's TypeScript config
│   ├── vite.config.ts           # Vite configuration
│   ├── tailwind.config.js       # Tailwind CSS config
│   ├── postcss.config.js        # PostCSS config
│   ├── .env.example
│   └── index.html
│
├── package.json                 # Root dependencies
├── tsconfig.json                # Root TypeScript config
├── LICENSE
├── README.md                    # This file
└── .env.example                 # Backend environment template
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16+ (v18+ recommended)
- **PostgreSQL** 12+
- **npm** v8+ or **yarn**

### Backend Setup

1. **Install dependencies** (from root directory)

```bash
npm install
```

2. **Create `.env` file**

```bash
cp .env.example .env
```

3. **Configure environment variables** in `.env`

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
CLIENT_URL=http://localhost:5173
JWT_EXPIRE=7d
```

4. **Setup PostgreSQL Database**
   - Create a new database: `dalali_db`
   - Import schema: `psql -U postgres -d dalali_db < ./database/schema.sql`
   - Or run the SQL commands from `database/schema.sql` in your PostgreSQL client

5. **Start development server**

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

6. **Build for production**

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

## 🚀 Deployment

### Deploy to Vercel (Monorepo)

This project is configured for **single-command Vercel deployment** with both backend and frontend:

1. **Connect GitHub repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select your project

2. **Configure environment variables in Vercel**
   - Go to Settings → Environment Variables
   - Add these variables:

   ```
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   JWT_SECRET=your_secure_secret_key_here_min_32_characters
   JWT_EXPIRE=7d
   NODE_ENV=production
   ```

3. **Deploy**
   - Push to `main` branch or click "Deploy"
   - Vercel automatically builds and deploys:
     - Frontend: `https://your-project.vercel.app`
     - Backend API: `https://your-project.vercel.app/api`

**Project Structure for Vercel:**

- `frontend/` → Built to `frontend/dist` and served from root `/`
- `api/[...path].ts` → Serverless functions served from `/api/*`
- `vercel.json` → Routing and build configuration

The build command `npm run build` only builds the frontend, and Vercel automatically deploys the `api/` folder as serverless functions.

## 📚 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
  - Body: `{ email: string, password: string }`
  - Returns: `{ token: string, user: User }`

### Public Tracking (No Authentication Required)

- `GET /api/shipments/track/:trackingNumber` - Track shipment by order number
  - Returns: `{ shipment: Shipment, tracking_history: TrackingHistory[] }`
  - Example: `/api/shipments/track/DEX123456ABC`

### Shipments (Protected - Login Required)

- `GET /api/shipments` - Get all shipments (branch-filtered for branch admins)
  - Query: `?limit=10&offset=0`
  - Returns: `{ shipments: Shipment[], total: number }`

- `POST /api/shipments` - Create new shipment
  - Body: Complete shipment data with sender, receiver, and cargo details
  ```json
  {
    "sender_name": "John Doe",
    "sender_phone": "+255 123 456 7890",
    "sender_address": "Dar es Salaam, Tanzania",
    "receiver_name": "Jane Smith",
    "receiver_phone": "+243 987 654 3210",
    "receiver_address": "Kinshasa, DRC",
    "destination": "Kinshasa",
    "cargo_description": "Electronics package",
    "weight": 5.5,
    "volume": 0.05,
    "service_type": "Express",
    "origin_branch_id": "branch_uuid"
  }
  ```
  - Returns: `{ shipment: Shipment, tracking_number: string }`

- `GET /api/shipments/:id` - Get shipment details
  - Returns: `{ shipment: Shipment, tracking_history: TrackingHistory[] }`

- `PUT /api/shipments/:id/status` - Update shipment status
  - Body: `{ status: string, description?: string }`
  - Statuses: Created, In Transit, Out for Delivery, Delivered, Delayed, Cancelled

### Users (Protected - Super Admin Only)

- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
  - Body: `{ name: string, email: string, password: string, role: 'super_admin' | 'branch_admin', branch_id?: string }`
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Branches (Public Read, Protected Write)

- `GET /api/branches` - Get all branches (public, no auth required)
  - Query: `?limit=10&offset=0`
  - Returns all available branches for shipment selection
  - Returns: `{ branches: Branch[], total: number }`

- `GET /api/branches/:id` - Get branch details (public)
  - Returns: `{ branch: Branch }`

- `POST /api/branches` - Create branch (Super Admin only)
  - Body: `{ name: string, country: string, phone: string }`
  - Returns: `{ branch: Branch }`

### Health Check

- `GET /api/health` - API health status
  - Returns: `{ status: "OK" }`

## 🔐 Security

- Passwords hashed with **bcryptjs** (10 rounds)
- **JWT token-based authentication** (configurable expiration)
- **Role-based access control (RBAC)** middleware enforcement
- **CORS enabled** with client URL validation
- **Input validation** on all endpoints
- **Append-only tracking history** (immutable records)
- **Password reset capability** with secure tokens

## 📊 Database Schema

### Key Tables

**users**
- id (UUID) - Primary key
- name (string) - User name
- email (string) - Unique email
- password (string) - Hashed password
- role (enum) - 'super_admin' or 'branch_admin'
- branch_id (UUID, nullable) - Reference to branch
- created_at (timestamp)
- updated_at (timestamp)

**branches** - Pre-configured with 3 East African locations
- id (UUID) - Primary key
- name (string) - Branch name
- country (string) - Country location
- phone (string) - Contact phone
- created_at (timestamp)
- updated_at (timestamp)

**Pre-configured Branches:**
- 🇹🇿 **Dar es Salaam** - Tanzania
- 🇨🇩 **Kinshasa** - Democratic Republic of Congo
- 🇺🇬 **Entebbe** - Uganda

**shipments** - Comprehensive tracking information
- id (UUID) - Primary key
- tracking_number (string, UNIQUE) - Auto-generated order number (DEX prefix)
- sender_name (string) - Sender full name
- sender_phone (string) - Sender phone number
- sender_address (string) - Sender address
- receiver_name (string) - Receiver full name
- receiver_phone (string) - Receiver phone number
- receiver_address (string) - Receiver address
- origin_branch_id (UUID) - Reference to origin branch
- destination (string) - Destination city/country
- cargo_description (text) - What's being shipped
- weight (DECIMAL) - Weight in kg
- volume (DECIMAL) - Volume in m³
- service_type (enum) - Standard, Express, Overnight, Economy
- current_status (enum) - Created, In Transit, Out for Delivery, Delivered, Delayed, Cancelled
- created_by (UUID) - Reference to user who created shipment
- created_at (timestamp)
- updated_at (timestamp)

**tracking_history** - Immutable history of shipment status changes
- id (UUID) - Primary key
- shipment_id (UUID, FK) - Reference to shipment
- status (string) - Status at this point in time
- description (text, nullable) - What happened
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
### Production Deployment on Vercel

This project is fully configured for **Vercel deployment** with automatic CI/CD:

**Complete deployment guide** → See [DEPLOYMENT.md](./DEPLOYMENT.md)

**Quick Deployment Steps:**

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel settings:
   - `DATABASE_URL` - Neon PostgreSQL connection string
   - `JWT_SECRET` - 32+ character random string
   - `JWT_EXPIRE` - "7d"
   - `NODE_ENV` - "production"
   - `CLIENT_URL` - Your Vercel production domain

4. Deploy:
   ```
   npm run build
   npm run seed  # Initial data load
   ```

**Deployment Architecture:**
- Frontend: React → Vercel CDN (static files from `frontend/dist`)
- Backend: Node.js → Vercel Serverless Functions (from `api/` folder)
- Database: PostgreSQL on Neon Cloud
- Domain: yourdomain.vercel.app (or custom domain)

**Production Features:**
- ✅ Automatic HTTPS
- ✅ Serverless auto-scaling
- ✅ Database connection pooling
- ✅ CORS preconfigured for production
- ✅ Environment-based API routing
- ✅ CDN for static assets

### Local Development

**Start both servers with auto-reload:**

```bash
npm run dev
```

This starts:
- Backend on `http://localhost:5000` (TypeScript with tsx watch)
- Frontend on `http://localhost:5173` (Vite dev server)

**Test the system:**

1. Open `http://localhost:5173`
2. Login: `admin@dalali.com` / `Admin@2024!`
3. Create a shipment and note the order number in success modal
4. Go to homepage and search tracking by order number
5. View complete shipment details and history
### Backend Deployment (Node.js)

1. Build: `npm run build`
2. Vercel automatically uses `vercel.json` configuration
3. Environment variables set in Vercel dashboard
4. Automatic deployment on push to main branch

### Built-in Production Features

- ✅ **Health Check Endpoint**: `GET /api/health`
- ✅ **CORS Configured**: Auto-detects environment and sets correct origin
- ✅ **Database Connection Pooling**: Neon connection pooler for performance
- ✅ **JWT Token Caching**: Tokens stored in localStorage for offline access
- ✅ **SPA Fallback**: All routes fallback to `/index.html` for React Router
- ✅ **Static Asset Caching**: Versioned assets via Vite
- ✅ **Error Handling**: Comprehensive error logging and user-friendly messages
- ✅ **Security Headers**: CORS, secure JWT, password hashing
- ✅ **Monitoring Ready**: Vercel logs and Neon database logs available

## 📄 License

ISC

## 👨‍💻 Support

For support, email info@dalali.com or call +20 100 123 4567

---

**Built with ❤️ for Dalali Express Services**
**Last Updated:** April 2026
