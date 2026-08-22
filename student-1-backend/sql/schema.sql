-- GlobeTrotter PostgreSQL Database Schema (Supabase-ready)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    photo_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    city VARCHAR(100),
    country VARCHAR(100),
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget_limit NUMERIC(10, 2) DEFAULT 2500.00,
    cover_photo_url TEXT DEFAULT 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    status VARCHAR(50) DEFAULT 'upcoming',
    is_public BOOLEAN DEFAULT false,
    share_slug VARCHAR(100) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    cost_index INTEGER NOT NULL CHECK (cost_index BETWEEN 1 AND 5),
    popularity_score INTEGER NOT NULL CHECK (popularity_score BETWEEN 1 AND 100),
    image_url TEXT NOT NULL,
    description TEXT
);

CREATE TABLE stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget NUMERIC(10, 2) DEFAULT 500.00
);

CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    description TEXT,
    image_url TEXT NOT NULL
);

CREATE TABLE stop_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stop_id UUID NOT NULL REFERENCES stops(id) ON DELETE CASCADE,
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    scheduled_date DATE,
    scheduled_time VARCHAR(50),
    cost NUMERIC(10, 2) DEFAULT 0.00
);

CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    date DATE NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
    caption TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
