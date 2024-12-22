import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class TemplateManager {
    private storageUri: vscode.Uri;

    constructor(private context: vscode.ExtensionContext) {
        this.storageUri = context.globalStorageUri;
        this.initializeStorage();
    }

    private async initializeStorage() {
        if (!fs.existsSync(this.storageUri.fsPath)) {
            await fs.promises.mkdir(this.storageUri.fsPath);
        }
    }

    async createTemplate(name: string, content: string): Promise<void> {
        const templatePath = path.join(this.storageUri.fsPath, `${name}.txt`);
        await fs.promises.writeFile(templatePath, content);
    }

    async loadTemplate(name: string): Promise<string> {
        const templatePath = path.join(this.storageUri.fsPath, `${name}.txt`);
        return await fs.promises.readFile(templatePath, 'utf-8');
    }

    async getTemplatesList(): Promise<string[]> {
        const files = await fs.promises.readdir(this.storageUri.fsPath);
        return files
            .filter(file => file.endsWith('.txt'))
            .map(file => file.replace('.txt', ''));
    }
}
