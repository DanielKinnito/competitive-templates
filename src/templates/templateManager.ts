import * as vscode from 'vscode';
// Import Database type along with getSupabaseClient
import { getSupabaseClient, Database } from '../supabase/supabaseClient';

// Define the type for a single template row based on the Database definition
type TemplateRow = Database['public']['Tables']['templates']['Row'];
// Define the type for inserting a new template
type TemplateInsert = Database['public']['Tables']['templates']['Insert'];


/**
 * Manages template storage and retrieval using Supabase
 * @class TemplateManager
 */
export class TemplateManager {
    // Remove local storage related properties
    // private storageUri: vscode.Uri;

    // The constructor no longer needs the context for storageUri
    constructor(private context: vscode.ExtensionContext) {
        // Remove local storage initialization
        // this.storageUri = context.globalStorageUri;
        // this.initializeStorage();
    }

    // Remove local storage initialization method
    // private async initializeStorage() {
    //     if (!fs.existsSync(this.storageUri.fsPath)) {
    //         await fs.promises.mkdir(this.storageUri.fsPath);
    //     }
    // }

    /**
     * Creates a new template in Supabase
     * @param {string} name - Template name
     * @param {string} content - Template content
     * @returns {Promise<void>}
     * @throws {Error} If Supabase client is not available or insertion fails
     */
    async createTemplate(name: string, content: string): Promise<void> {
        const supabase = getSupabaseClient();
        if (!supabase) {
            throw new Error('Supabase client is not initialized. Check configuration.');
        }

        // Use the correct table name string. Type inference handles the rest.
        // The TemplateInsert type ensures we provide the correct shape.
        const newTemplate: TemplateInsert = { name, content };
        console.log(`Attempting to insert template: ${JSON.stringify(newTemplate)}`); // Log data being sent

        const { data, error } = await supabase
            .from('templates') // Just the table name string, no generic needed here
            .insert(newTemplate)
            .select(); // Add .select() to get the inserted data back

        if (error) {
            console.error('Supabase insert error:', JSON.stringify(error, null, 2)); // Log the full error object
            vscode.window.showErrorMessage(`Supabase error: ${error.message} (Code: ${error.code}). Check console for details.`); // Show more specific error
            throw new Error(`Failed to create template: ${error.message}`);
        }

        // Log the data returned by Supabase after insert
        console.log('Supabase insert success, returned data:', JSON.stringify(data, null, 2));

        if (!data || data.length === 0) {
            console.warn('Supabase insert succeeded but returned no data. Check RLS policies and table permissions.');
            // Optionally inform the user, though the operation might have technically succeeded
            // vscode.window.showWarningMessage('Template saved, but confirmation data was not returned from Supabase.');
        }

        // console.log('Template created successfully in Supabase:', data); // Original log, now replaced by more detailed one
    }

    /**
     * Loads a template from Supabase
     * @param {string} name - Template name
     * @returns {Promise<string>} Template content
     * @throws {Error} If Supabase client is not available, template not found, or fetch fails
     */
    async loadTemplate(name: string): Promise<string> {
        const supabase = getSupabaseClient();
        if (!supabase) {
            throw new Error('Supabase client is not initialized. Check configuration.');
        }

        // Use the table name string. Select the 'content' column.
        // The return type will be inferred based on the select and single() call.
        const { data, error } = await supabase
            .from('templates') // Just the table name string
            .select('content') // Select specific column
            .eq('name', name)
            .single(); // Expect a single result or null

        if (error) {
            console.error('Error loading template from Supabase:', error);
            if (error.code === 'PGRST116') { // Not found error
                 throw new Error(`Template "${name}" not found.`);
            }
            throw new Error(`Failed to load template: ${error.message}`);
        }

        if (!data) {
             throw new Error(`Template "${name}" not found.`);
        }

        // data is inferred as { content: string } | null here
        return data.content;
    }

    /**
     * Gets the list of template names from Supabase
     * @returns {Promise<string[]>} List of template names
     * @throws {Error} If Supabase client is not available or fetch fails
     */
    async getTemplatesList(): Promise<string[]> {
         const supabase = getSupabaseClient();
        if (!supabase) {
            throw new Error('Supabase client is not initialized. Check configuration.');
        }

        // Use the table name string. Select the 'name' column.
        // The return type will be inferred as { name: string }[] | null
        const { data, error } = await supabase
            .from('templates') // Just the table name string
            .select('name'); // Select only the name column

        if (error) {
            console.error('Error fetching template list from Supabase:', error);
            throw new Error(`Failed to get template list: ${error.message}`);
        }

        // data is inferred as { name: string }[] | null
        // Map the result to an array of strings.
        return data ? data.map(template => template.name) : [];
    }
}
