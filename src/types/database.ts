export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string;
          name: string;
          slug: string;
          code: string;
          affiliation_number: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          address: Json | null;
          status: 'active' | 'inactive' | 'suspended';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          code: string;
          affiliation_number?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          address?: Json | null;
          status?: 'active' | 'inactive' | 'suspended';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          code?: string;
          affiliation_number?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          address?: Json | null;
          status?: 'active' | 'inactive' | 'suspended';
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      school_memberships: {
        Row: {
          id: string;
          school_id: string;
          user_id: string;
          role: 'PRINCIPAL' | 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
          status: 'active' | 'inactive' | 'pending' | 'suspended';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          user_id: string;
          role: 'PRINCIPAL' | 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
          status?: 'active' | 'inactive' | 'pending' | 'suspended';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          user_id?: string;
          role?: 'PRINCIPAL' | 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
          status?: 'active' | 'inactive' | 'pending' | 'suspended';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_school_member: {
        Args: {
          lookup_school_id: string;
          required_roles?: string[];
        };
        Returns: boolean;
      };
      get_current_user_schools: {
        Args: Record<PropertyKey, never>;
        Returns: {
          school_id: string;
          school_name: string;
          school_slug: string;
          role: string;
        }[];
      };
    };
    Enums: {
      user_role: 'PRINCIPAL' | 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
      membership_status: 'active' | 'inactive' | 'pending' | 'suspended';
    };
  };
};
