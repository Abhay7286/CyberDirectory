import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  created_at: string;
  type: "Free" | "Open Source" | "Paid" | "Freemium";
  trust_score: number;
  github_stars: number;
  website: string;
  github?: string;
  tags: string[];        
  last_updated: string;    
  submitted_by: string;   
  votes: number;          
  related_tools: string[]; 
  logo_url?: string;
  created_by: string; // User ID of the creator
  featured: boolean; // Indicates if the tool is featured
  average_rating?: number; // Optional average rating
  total_reviews?: number; // Optional total reviews count
}

export interface Review {
  id: string
  tool_id: string
  user_id: string
  rating: number
  comment: string
  created_at: string
  user_name: string
}

export interface Wishlist {
  id: string
  user_id: string
  tool_id: string
  created_at: string
}

export interface UserProfile {
  id: string
  email: string
  full_name: string
  bio?: string
  avatar_url?: string
  organization?: string
  role?: string
  created_at: string
}