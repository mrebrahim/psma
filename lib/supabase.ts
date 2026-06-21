import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "psma-auth",
  },
});

export type Company = {
  id: string;
  name: string;
  representative: string | null;
  email: string;
  phone: string | null;
  sector: string | null;
  website: string | null;
  description: string | null;
  address: string | null;
  logo_url: string | null;
  status: "pending" | "approved" | "rejected";
  auth_user_id: string | null;
  created_at: string;
};

export type Job = {
  id: string;
  company_id: string | null;
  title: string;
  description: string;
  requirements: string | null;
  location: string | null;
  governorate: string | null;
  governorates: string[] | null;
  job_type: string | null;
  field: string | null;
  openings: number | null;
  age_min: number | null;
  age_max: number | null;
  experience_required: string | null;
  deadline: string | null;
  status: "draft" | "pending" | "published" | "rejected" | "closed";
  rejection_reason: string | null;
  reviewed_at: string | null;
  submitted_by_company: boolean;
  created_at: string;
  companies?: { name: string; sector: string | null; logo_url: string | null } | null;
};

export type Application = {
  id: string;
  job_id: string;
  full_name: string;
  phone: string;
  email: string | null;
  governorate: string | null;
  qualification: string | null;
  field: string | null;
  position_applied: string | null;
  cv_url: string | null;
  cover_note: string | null;
  status: string;
  created_at: string;
};
