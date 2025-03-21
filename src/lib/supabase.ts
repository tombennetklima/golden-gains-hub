
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkgkdfiqhrxkmrqfmwtl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrZ2tkZmlxaHJ4a21ycWZtd3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NTEwNDAsImV4cCI6MjA1ODEyNzA0MH0.PJ_yDAmwP56EiEUM0HuJA6HzA2C4-4QP4jqR21SFNyU';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Define types for our database tables
export type Profile = {
  id: string;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  street: string | null;
  house_number: string | null;
  postal_code: string | null;
  city: string | null;
  is_admin: boolean;
  is_locked: boolean;
  created_at: string;
};

export type DocumentUpload = {
  id: string;
  user_id: string;
  type: "id" | "card" | "bank";
  file_paths: string[];
  is_locked: boolean;
  is_approved: boolean;
  created_at: string;
};

export type UserStatus = {
  id: string;
  user_id: string;
  upload_status: "not_complete" | "pending_review" | "approved" | "rejected";
  community_status: "not_started" | "kontaktaufnahme" | "vorbereitung" | "registrierung" | 
                   "verifizierung" | "wetten" | "auszahlung" | "abgeschlossen";
  created_at: string;
};
