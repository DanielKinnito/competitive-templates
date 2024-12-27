/**
 * Main extension file that handles activation and command registration
 * @module extension
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import { TemplateManager } from './templates/templateManager';
import { SnippetManager } from './templates/snippetManager';

/**
 * Activates the extension
 * @param {vscode.ExtensionContext} context - The VS Code extension context
 */
export function activate(context: vscode.ExtensionContext) {
    const templateManager = new TemplateManager(context);
    const snippetManager = new SnippetManager(context, templateManager);

    let newTemplateCommand = vscode.commands.registerCommand('competitive-templates.newTemplate', async () => {
        // Open file picker
        const fileUris = await vscode.window.showOpenDialog({
            canSelectMany: false,
            filters: {
                'Text Files': ['txt', 'cpp', 'py', 'java']
            },
            title: 'Select Template File'
        });

        if (fileUris && fileUris[0]) {
            const templateName = await vscode.window.showInputBox({
                prompt: 'Enter template name',
                placeHolder: 'e.g., dp_template'
            });

            if (templateName) {
                const content = await fs.promises.readFile(fileUris[0].fsPath, 'utf-8');
                await templateManager.createTemplate(templateName, content);
                await snippetManager.updateSnippets();
                vscode.window.showInformationMessage(`Template ${templateName} created successfully!`);
            }
        }
    });

    let loadTemplateCommand = vscode.commands.registerCommand('competitive-templates.loadTemplate', async () => {
        const templates = await templateManager.getTemplatesList();
        const selected = await vscode.window.showQuickPick(templates, {
            placeHolder: 'Select a template to load'
        });

        if (selected) {
            const content = await templateManager.loadTemplate(selected);
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                editor.edit(editBuilder => {
                    editBuilder.insert(editor.selection.start, content);
                });
            }
        }
    });

    // Create template from selection
    let createFromSelectionCommand = vscode.commands.registerCommand(
        'competitive-templates.createFromSelection',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                return;
            }

            const selection = editor.selection;
            const selectedText = editor.document.getText(selection);

            const templateName = await vscode.window.showInputBox({
                prompt: 'Enter template name',
                placeHolder: 'e.g., unionfind_template'
            });

            if (templateName) {
                await templateManager.createTemplate(templateName, selectedText);
                await snippetManager.updateSnippets();
                vscode.window.showInformationMessage(
                    `Template ${templateName} created successfully!`
                );
            }
        }
    );

    context.subscriptions.push(
        createFromSelectionCommand,
        newTemplateCommand,
        loadTemplateCommand
    );
}

export function deactivate() {}
