import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { TemplateManager } from './templateManager';

export class SnippetManager {
    constructor(private context: vscode.ExtensionContext, private templateManager: TemplateManager) {}

    async updateSnippets(): Promise<void> {
        const templates = await this.templateManager.getTemplatesList();
        const snippets: { [key: string]: any } = {};

        for (const template of templates) {
            const content = await this.templateManager.loadTemplate(template);
            snippets[template] = {
                prefix: template,
                body: content.split('\n'),
                description: `Template for ${template}`
            };
        }

        // Save snippets for different languages
        const snippetPath = path.join(this.context.extensionPath, 'snippets');
        if (!fs.existsSync(snippetPath)) {
            fs.mkdirSync(snippetPath);
        }

        fs.writeFileSync(
            path.join(snippetPath, 'cpp.json'),
            JSON.stringify(snippets, null, 2)
        );
        fs.writeFileSync(
            path.join(snippetPath, 'python.json'),
            JSON.stringify(snippets, null, 2)
        );
    }
} 