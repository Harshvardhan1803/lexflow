-- LexFlow Database Schema

-- Roles enum
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Firms table (from original design)
CREATE TABLE IF NOT EXISTS firms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    plan VARCHAR(50) DEFAULT 'starter',
    branding JSONB,
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contacts / Clients table
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    firm_id INTEGER REFERENCES firms(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    intake_answers JSONB,
    lead_score INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'lead',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cases (
    id SERIAL PRIMARY KEY,
    firm_id INTEGER REFERENCES firms(id),
    contact_id INTEGER REFERENCES contacts(id),
    type VARCHAR(100), -- Immigration, Family Law, etc.
    status VARCHAR(50) DEFAULT 'open',
    milestones JSONB,
    assigned_attorney_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notes / Activity History table
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    contact_id INTEGER REFERENCES contacts(id),
    case_id INTEGER REFERENCES cases(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Time Entries for Billing
CREATE TABLE IF NOT EXISTS time_entries (
    id SERIAL PRIMARY KEY,
    case_id INTEGER REFERENCES cases(id),
    attorney_id INTEGER REFERENCES users(id),
    duration_minutes INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    case_id INTEGER REFERENCES cases(id),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'unpaid',
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Case Files / Discovery Room
CREATE TABLE IF NOT EXISTS case_files (
    id SERIAL PRIMARY KEY,
    case_id INTEGER REFERENCES cases(id),
    uploader_id INTEGER REFERENCES users(id), -- Null if uploaded by client via portal
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    size_bytes BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
