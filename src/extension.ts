/**
 * Main extension file that handles activation and command registration
 * @module extension
 */

import * as vscode from 'vscode';
// Remove fs import if no longer needed directly here
// import * as fs from 'fs';
import { TemplateManager } from './templates/templateManager';
import { SnippetManager } from './templates/snippetManager';
import { getSupabaseClient, disposeSupabaseClient } from './supabase/supabaseClient'; // Import Supabase helpers

/**
 * Activates the extension
 * @param {vscode.ExtensionContext} context - The VS Code extension context
 */
export function activate(context: vscode.ExtensionContext) {
    // Initialize Supabase client early (optional, can be done on demand)
    getSupabaseClient(); // This will attempt initialization and show error if config is missing

    // TemplateManager constructor might not need context anymore if not used internally
    const templateManager = new TemplateManager(context);
    const snippetManager = new SnippetManager(context, templateManager);

    // --- Command Registrations ---

    const newTemplateCommand = vscode.commands.registerCommand('competitive-templates.newTemplate', async () => {
        // Open file picker - This part remains the same for getting content locally
        const fileUris = await vscode.window.showOpenDialog({
            canSelectMany: false,
            filters: {
                // Keep or adjust filters as needed
                'Text Files': ['txt', 'cpp', 'py', 'java', 'js', 'ts'] // Added js/ts
            },
            title: 'Select File Containing Template Content'
        });

        if (fileUris && fileUris[0]) {
            const templateName = await vscode.window.showInputBox({
                prompt: 'Enter template name (will be stored in Supabase)',
                placeHolder: 'e.g., dp_template'
            });

            if (templateName) {
                try {
                    // Read local file content
                    const content = await vscode.workspace.fs.readFile(fileUris[0]).then(buffer => Buffer.from(buffer).toString('utf-8'));
                    // Use TemplateManager to save to Supabase
                    await templateManager.createTemplate(templateName, content);
                    // Update snippets (this might need adjustment if snippets are also cloud-based later)
                    await snippetManager.updateSnippets(); // This still writes local snippet files
                    vscode.window.showInformationMessage(`Template ${templateName} created successfully in Supabase!`);
                } catch (error) {
                     vscode.window.showErrorMessage(`Failed to create template: ${error instanceof Error ? error.message : String(error)}`);
                }
            }
        }
    });

    const loadTemplateCommand = vscode.commands.registerCommand('competitive-templates.loadTemplate', async () => {
        try {
            const templates = await templateManager.getTemplatesList();
            if (templates.length === 0) {
                vscode.window.showInformationMessage('No templates found in Supabase.');
                return;
            }
            const selected = await vscode.window.showQuickPick(templates, {
                placeHolder: 'Select a template to load from Supabase'
            });

            if (selected) {
                const content = await templateManager.loadTemplate(selected);
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    editor.edit(editBuilder => {
                        editBuilder.insert(editor.selection.start, content);
                    });
                } else {
                    // Optionally open a new document with the content
                    const doc = await vscode.workspace.openTextDocument({ content, language: 'plaintext' }); // Adjust language if possible
                    await vscode.window.showTextDocument(doc);
                }
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to load template: ${error instanceof Error ? error.message : String(error)}`);
        }
    });

    const createFromSelectionCommand = vscode.commands.registerCommand(
        'competitive-templates.createFromSelection',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('No active editor found.');
                return;
            }

            const selection = editor.selection;
            if (selection.isEmpty) {
                 vscode.window.showWarningMessage('No text selected.');
                 return;
            }
            const selectedText = editor.document.getText(selection);

            const templateName = await vscode.window.showInputBox({
                prompt: 'Enter template name (will be stored in Supabase)',
                placeHolder: 'e.g., unionfind_template'
            });

            if (templateName) {
                 try {
                    await templateManager.createTemplate(templateName, selectedText);
                    await snippetManager.updateSnippets(); // Still updates local snippets
                    vscode.window.showInformationMessage(
                        `Template ${templateName} created successfully in Supabase!`
                    );
                } catch (error) {
                     vscode.window.showErrorMessage(`Failed to create template from selection: ${error instanceof Error ? error.message : String(error)}`);
                }
            }
        }
    );

    context.subscriptions.push(
        createFromSelectionCommand,
        newTemplateCommand,
        loadTemplateCommand
    );
}

/**
 * Deactivates the extension
 */
export function deactivate() {
    // Dispose the Supabase client when the extension deactivates
    disposeSupabaseClient();
}
