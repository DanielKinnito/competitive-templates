import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as vscode from 'vscode';

// --- Add Database Type Definition ---
// This defines the structure of your Supabase database for TypeScript.
// For a more complete definition, use `supabase gen types typescript`
export interface Database {
  public: {
    Tables: {
      templates: {
        Row: { // The shape of the data returned from SELECT
          id: number;
          created_at: string;
          name: string;
          content: string;
          // Add other columns if they exist in your table
        };
        Insert: { // The shape of data for INSERT
          id?: number; // Optional if auto-generated
          created_at?: string; // Optional if managed by Supabase
          name: string;
          content: string;
          // Add other columns
        };
        Update: { // The shape of data for UPDATE
          id?: number;
          created_at?: string;
          name?: string; // Fields are optional for updates
          content?: string;
          // Add other columns
        };
      };
      // Add other tables if needed
    };
    Views: {
      // Add views if needed
    };
    Functions: {
      // Add functions if needed
    };
  };
}
// --- End Database Type Definition ---


let supabase: SupabaseClient<Database> | null = null; // Use the Database type

// Hardcoded Supabase credentials
const supabaseUrl = 'https://fvtnpsgxkhlszafbxobb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2dG5wc2d4a2hsc3phZmJ4b2JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0ODc2MzgsImV4cCI6MjA2MjA2MzYzOH0.Jkb7hbL-RWEH3Oj7nJtS1ULDDNR6NzfYxvTBwM-pE1o';

export function getSupabaseClient(): SupabaseClient<Database> | null { // Use the Database type
    if (supabase) {
        return supabase;
    }

    // Removed configuration reading
    // const configuration = vscode.workspace.getConfiguration('competitive-templates');
    // const supabaseUrl = configuration.get<string>('supabaseUrl');
    // const supabaseAnonKey = configuration.get<string>('supabaseAnonKey');

    // Basic check if credentials are set (they are hardcoded now)
    if (!supabaseUrl || !supabaseAnonKey) {
        // This error should theoretically not happen anymore
        vscode.window.showErrorMessage('Internal Error: Supabase URL or Anon Key is missing.');
        console.error('Internal Error: Hardcoded Supabase URL or Anon Key is missing.');
        return null;
    }

    try {
        // Use hardcoded credentials
        // Specify the Database type when creating the client
        supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
        console.log('Supabase client initialized successfully.');
        return supabase;
    } catch (error) {
        console.error('Error initializing Supabase client:', error);
        vscode.window.showErrorMessage(`Failed to initialize Supabase client: ${error instanceof Error ? error.message : String(error)}`);
        return null;
    }
}

// Optional: Function to dispose the client if needed, e.g., on deactivation
export function disposeSupabaseClient(): void {
    // Supabase client doesn't have an explicit dispose method in v2.
    // Setting to null allows re-initialization if needed.
    supabase = null;
    console.log('Supabase client reference cleared.');
}

// Define the structure of your template table for type safety
// The Template interface might still be useful for component props or local state,
// but Supabase operations will primarily use the generated Database types.
// Keep it if it's used elsewhere, otherwise it can be removed if Database types suffice.
export interface Template {
    id?: number;
    name: string;
    content: string;
    created_at?: string;
}
