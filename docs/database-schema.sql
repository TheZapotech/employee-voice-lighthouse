
-- =================================================================
-- Database Schema Documentation
-- =================================================================
-- This file contains the complete database schema for the feedback system.
-- It includes all necessary tables, custom types, and security policies.
-- Last updated: 2024
-- =================================================================

-- Custom Types
-- =================================================================

-- User roles in the system
CREATE TYPE public.user_role AS ENUM (
    'employee',    -- Regular employee who can submit feedback
    'manager',     -- Manager who can view and respond to feedback
    'admin'        -- Administrator with full system access
);

-- Feedback status tracking
CREATE TYPE public.feedback_status AS ENUM (
    'pending',     -- New feedback awaiting review
    'in_review',   -- Feedback being reviewed
    'responded',   -- Feedback has received a response
    'archived'     -- Feedback has been archived
);

-- Tables
-- =================================================================

-- User Profiles
-- Stores additional user information beyond auth.users
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    department TEXT,
    role user_role DEFAULT 'employee'::user_role,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Feedback Categories
-- Organizes feedback into different categories
CREATE TABLE public.feedback_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Feedback
-- Stores all feedback submissions
CREATE TABLE public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT true,
    submitted_by UUID REFERENCES public.profiles(id),
    category_id UUID REFERENCES public.feedback_categories(id),
    status feedback_status DEFAULT 'pending'::feedback_status,
    sentiment TEXT,
    response TEXT,
    response_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Row Level Security (RLS) Policies
-- =================================================================

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_categories ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Feedback Policies
CREATE POLICY "Authenticated users can create feedback"
    ON public.feedback
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = submitted_by OR submitted_by IS NULL);

CREATE POLICY "Users can view their own non-anonymous feedback"
    ON public.feedback
    FOR SELECT
    TO authenticated
    USING (
        (auth.uid() = submitted_by AND NOT is_anonymous) OR
        (auth.role() = 'service_role')
    );

-- Categories Policies
CREATE POLICY "Anyone can view feedback categories"
    ON public.feedback_categories
    FOR SELECT
    TO authenticated
    USING (true);

-- Triggers
-- =================================================================

-- Automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.feedback
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role)
    VALUES (new.id, new.email, 'employee');
    RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Indexes
-- =================================================================

-- Improve query performance for common operations
CREATE INDEX idx_feedback_submitted_by ON public.feedback(submitted_by);
CREATE INDEX idx_feedback_category ON public.feedback(category_id);
CREATE INDEX idx_feedback_status ON public.feedback(status);
CREATE INDEX idx_feedback_created_at ON public.feedback(created_at);

-- Comments
-- =================================================================

COMMENT ON TABLE public.profiles IS 'Stores user profile information';
COMMENT ON TABLE public.feedback IS 'Stores user feedback submissions';
COMMENT ON TABLE public.feedback_categories IS 'Categories for organizing feedback';

COMMENT ON COLUMN public.feedback.is_anonymous IS 'If true, feedback submitter information is hidden';
COMMENT ON COLUMN public.feedback.sentiment IS 'Analyzed sentiment of the feedback content';
COMMENT ON COLUMN public.feedback.status IS 'Current status of the feedback';
COMMENT ON COLUMN public.profiles.role IS 'User role determining system access permissions';

