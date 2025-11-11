# Company Management System - Setup Guide

This is a Next.js application for managing companies with MySQL database integration.

## Features

- **Company Management**
  - List all companies
  - Create new companies
  - View company details
  - Edit company information
  - Delete companies
  
- **Company Information Tracked**
  - Company name, address, telephone, email
  - Owner information (name, mobile, email)
  - Contact information (name, mobile, email)
  
- **Product Association**
  - View products associated with each company
  - Product details including name, description, and price

## Prerequisites

- Node.js (v18 or higher)
- MySQL Server (v8.0 or higher)
- npm or yarn package manager

## Database Setup

1. **Create a MySQL database:**
   ```sql
   CREATE DATABASE your_database;
   ```

2. **Run the setup script:**
   ```bash
   mysql -u root -p your_database < database/setup.sql
   ```
   
   This will:
   - Create the `companies` table with all required fields
   - Create the `products` table
   - Insert sample data for testing

## Environment Configuration

1. **Copy the environment file:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Update `.env.local` with your database credentials:**
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=your_database
   ```

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000/admin](http://localhost:3000/admin)

## Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx                    # Company list page
│   │   ├── page.module.css             # Admin page styles
│   │   └── companies/
│   │       └── [id]/
│   │           ├── page.tsx            # Company detail/edit page
│   │           └── page.module.css     # Detail page styles
│   └── api/
│       └── companies/
│           ├── route.ts                # GET all, POST new company
│           └── [id]/
│               ├── route.ts            # GET, PUT, DELETE specific company
│               └── products/
│                   └── route.ts        # GET products for company
├── lib/
│   └── db.ts                           # MySQL connection pool
└── types/
    └── company.ts                      # TypeScript interfaces

database/
└── setup.sql                           # Database schema and sample data
```

## API Endpoints

### Companies

- **GET** `/api/companies` - Get all companies
- **POST** `/api/companies` - Create a new company
- **GET** `/api/companies/[id]` - Get a specific company
- **PUT** `/api/companies/[id]` - Update a company
- **DELETE** `/api/companies/[id]` - Delete a company

### Products

- **GET** `/api/companies/[id]/products` - Get products for a company

## Usage

### Admin Dashboard

Navigate to `/admin` to access the company management interface.

### Creating a Company

1. Click the "Create New Company" button
2. Fill in all required fields (marked with *)
3. Optionally fill in contact information
4. Click "Create Company"

### Viewing/Editing a Company

1. Click "View" on any company in the list
2. View all company details and associated products
3. Click "Edit Company" to modify information
4. Make changes and click "Save Changes"

### Deleting a Company

1. Click "Delete" on any company in the list
2. Confirm the deletion

## Database Schema

### Companies Table

```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- name (VARCHAR(255), NOT NULL)
- address (TEXT, NOT NULL)
- telephone (VARCHAR(50), NOT NULL)
- email (VARCHAR(255), NOT NULL)
- owner_name (VARCHAR(255), NOT NULL)
- owner_mobile (VARCHAR(50), NOT NULL)
- owner_email (VARCHAR(255), NOT NULL)
- contact_name (VARCHAR(255), NULLABLE)
- contact_mobile (VARCHAR(50), NULLABLE)
- contact_email (VARCHAR(255), NULLABLE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Products Table

```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- company_id (INT, FOREIGN KEY)
- name (VARCHAR(255), NOT NULL)
- description (TEXT, NULLABLE)
- price (DECIMAL(10, 2), NULLABLE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Troubleshooting

### Database Connection Issues

If you see "Failed to fetch companies" errors:

1. Verify MySQL is running
2. Check your `.env.local` credentials
3. Ensure the database and tables exist
4. Check MySQL user permissions

### Port Already in Use

If port 3000 is already in use:
```bash
npm run dev -- -p 3001
```

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **MySQL** - Database
- **mysql2** - MySQL client for Node.js
- **React** - UI library

## License

MIT
