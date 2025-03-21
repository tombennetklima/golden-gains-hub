
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  street TEXT,
  house_number TEXT,
  postal_code TEXT,
  city TEXT,
  is_admin BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_status table
CREATE TABLE IF NOT EXISTS user_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  upload_status TEXT NOT NULL DEFAULT 'not_complete',
  community_status TEXT NOT NULL DEFAULT 'not_started',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  type TEXT NOT NULL,
  file_paths TEXT[] NOT NULL,
  is_locked BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create storage bucket for documents if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for documents bucket
CREATE POLICY "Documents are accessible to authenticated users" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Documents can be uploaded by authenticated users" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Profiles are viewable by authenticated users" ON profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create RLS policies for user_status
CREATE POLICY "Status is viewable by authenticated users" ON user_status
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own status" ON user_status
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create RLS policies for documents
CREATE POLICY "Documents are viewable by authenticated users" ON documents
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own documents" ON documents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" ON documents
  FOR UPDATE
  USING (auth.uid() = user_id);
