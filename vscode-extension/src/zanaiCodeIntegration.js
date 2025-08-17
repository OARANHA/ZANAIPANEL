"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZanaiCodeIntegration = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const axios_1 = require("axios");
class ZanaiCodeIntegration {
    constructor(context) {
        this.context = context;
        this.outputChannel = vscode.window.createOutputChannel('ZanaiCode');
        this.statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.statusBar.text = '$(rocket) ZanaiCode';
        this.statusBar.command = 'zanaiCode.openDashboard';
        this.statusBar.show();
        this.setupCommands();
        this.setupEventListeners();
    }
    setupCommands() {
        const commands = [
            { command: 'zanaiCode.openDashboard', callback: () => this.openDashboard() },
            { command: 'zanaiCode.downloadAgent', callback: () => this.downloadAgent() },
            { command: 'zanaiCode.listAgents', callback: () => this.listAgents() },
            { command: 'zanaiCode.refreshAgents', callback: () => this.refreshAgents() },
            { command: 'zanaiCode.showHelp', callback: () => this.showHelp() }
        ];
        commands.forEach(({ command, callback }) => {
            this.context.subscriptions.push(vscode.commands.registerCommand(command, callback));
        });
    }
    setupEventListeners() {
        // Monitor changes to .kilocode directory
        const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(vscode.workspace.workspaceFolders?.[0] || '.', '.kilocode/**/*'));
        watcher.onDidChange(() => this.checkAgents());
        watcher.onDidCreate(() => this.checkAgents());
        watcher.onDidDelete(() => this.checkAgents());
        this.context.subscriptions.push(watcher);
    }
    async openDashboard() {
        const config = vscode.workspace.getConfiguration('zanaiCode');
        const serverUrl = config.get('serverUrl', 'http://localhost:3000');
        vscode.env.openExternal(vscode.Uri.parse(serverUrl));
    }
    async downloadAgent() {
        try {
            // Quick pick to select agent from website
            const agents = await this.fetchAvailableAgents();
            if (agents.length === 0) {
                vscode.window.showInformationMessage('Nenhum agente disponível no website.');
                return;
            }
            const selected = await vscode.window.showQuickPick(agents.map(agent => ({
                label: agent.name,
                description: agent.description,
                detail: agent.slug,
                agent: agent
            })), { placeHolder: 'Selecione um agente para baixar' });
            if (selected) {
                await this.downloadAndInstallAgent(selected.agent);
                vscode.window.showInformationMessage(`Agente "${selected.label}" baixado com sucesso!`);
            }
        }
        catch (error) {
            this.handleError('Erro ao baixar agente', error);
        }
    }
    async listAgents() {
        const agents = this.getLocalAgents();
        if (agents.length === 0) {
            vscode.window.showInformationMessage('Nenhum agente instalado.');
            return;
        }
        const items = agents.map(agent => ({
            label: agent.name,
            description: agent.description,
            detail: `Slug: ${agent.slug}`,
            agent: agent
        }));
        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Selecione um agente para ver detalhes'
        });
        if (selected) {
            this.showAgentDetails(selected.agent);
        }
    }
    async refreshAgents() {
        try {
            await this.checkAgents();
            vscode.window.showInformationMessage('Agentes atualizados com sucesso!');
        }
        catch (error) {
            this.handleError('Erro ao atualizar agentes', error);
        }
    }
    showHelp() {
        const helpText = `
ZanaiCode - Superpílula para KiloCode

Comandos disponíveis:
• zanaiCode.openDashboard - Abre o dashboard web
• zanaiCode.downloadAgent - Baixa um agente do website
• zanaiCode.listAgents - Lista agentes instalados
• zanaiCode.refreshAgents - Atualiza lista de agentes
• zanaiCode.showHelp - Mostra esta ajuda

Como funciona:
1. Crie agentes no website
2. Baixe agentes para o VS Code
3. Os agentes são instalados como Custom Modes do KiloCode
4. Use os agentes diretamente no KiloCode
        `;
        this.outputChannel.clear();
        this.outputChannel.appendLine(helpText);
        this.outputChannel.show();
    }
    async fetchAvailableAgents() {
        try {
            const config = vscode.workspace.getConfiguration('zanaiCode');
            const serverUrl = config.get('serverUrl', 'http://localhost:3000');
            const response = await axios_1.default.get(`${serverUrl}/api/agents`);
            return response.data.agents || [];
        }
        catch (error) {
            this.outputChannel.appendLine(`Erro ao buscar agentes: ${error}`);
            return [];
        }
    }
    getLocalAgents() {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder)
            return [];
        const kilocodePath = path.join(workspaceFolder.uri.fsPath, '.kilocode');
        if (!fs.existsSync(kilocodePath))
            return [];
        const modesPath = path.join(kilocodePath, '.kilocodemodes');
        if (!fs.existsSync(modesPath))
            return [];
        try {
            const modesContent = fs.readFileSync(modesPath, 'utf8');
            const modes = JSON.parse(modesContent);
            return modes.customModes || [];
        }
        catch (error) {
            this.outputChannel.appendLine(`Erro ao ler agentes locais: ${error}`);
            return [];
        }
    }
    async downloadAndInstallAgent(agent) {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('Nenhuma pasta de trabalho aberta');
        }
        const kilocodePath = path.join(workspaceFolder.uri.fsPath, '.kilocode');
        if (!fs.existsSync(kilocodePath)) {
            fs.mkdirSync(kilocodePath, { recursive: true });
        }
        // Download agent configuration
        const config = vscode.workspace.getConfiguration('zanaiCode');
        const serverUrl = config.get('serverUrl', 'http://localhost:3000');
        const response = await axios_1.default.get(`${serverUrl}/api/agents/${agent.id}/export`);
        const agentConfig = response.data;
        // Create or update .kilocodemodes
        const modesPath = path.join(kilocodePath, '.kilocodemodes');
        let existingModes = { customModes: [] };
        if (fs.existsSync(modesPath)) {
            const existingContent = fs.readFileSync(modesPath, 'utf8');
            existingModes = JSON.parse(existingContent);
        }
        // Add or update agent mode
        const agentMode = agentConfig.customModes[0];
        // Remove existing mode with same slug
        existingModes.customModes = existingModes.customModes.filter((mode) => mode.slug !== agentMode.slug);
        existingModes.customModes.push(agentMode);
        fs.writeFileSync(modesPath, JSON.stringify(existingModes, null, 2));
        // Create rules directory if needed
        if (agentConfig.rules && agentConfig.rules.length > 0) {
            const rulesPath = path.join(kilocodePath, `rules-${agentMode.slug}`);
            if (!fs.existsSync(rulesPath)) {
                fs.mkdirSync(rulesPath, { recursive: true });
            }
            // Write rule files
            agentConfig.rules.forEach((rule) => {
                const rulePath = path.join(rulesPath, rule.filename);
                fs.writeFileSync(rulePath, rule.content);
            });
        }
        this.outputChannel.appendLine(`Agente "${agentMode.name}" instalado com sucesso!`);
    }
    async checkAgents() {
        const agents = this.getLocalAgents();
        this.statusBar.text = `$(rocket) ZanaiCode (${agents.length})`;
        this.statusBar.tooltip = `${agents.length} agentes instalados`;
    }
    showAgentDetails(agent) {
        const panel = vscode.window.createWebviewPanel('agentDetails', `Detalhes do Agente: ${agent.name}`, vscode.ViewColumn.One, {});
        const content = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${agent.name}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #333; }
                    .detail { margin: 10px 0; }
                    .rules { background: #f5f5f5; padding: 10px; border-radius: 5px; }
                </style>
            </head>
            <body>
                <h1>${agent.name}</h1>
                <div class="detail"><strong>Slug:</strong> ${agent.slug}</div>
                <div class="detail"><strong>Descrição:</strong> ${agent.description || 'Sem descrição'}</div>
                <div class="detail"><strong>Role Definition:</strong></div>
                <div class="rules">${agent.roleDefinition || 'Sem definição'}</div>
                <div class="detail"><strong>Custom Instructions:</strong></div>
                <div class="rules">${agent.customInstructions || 'Sem instruções'}</div>
            </body>
            </html>
        `;
        panel.webview.html = content;
        return new Promise(() => { });
    }
    handleError(message, error) {
        this.outputChannel.appendLine(`${message}: ${error}`);
        vscode.window.showErrorMessage(message);
    }
    dispose() {
        this.statusBar.dispose();
        this.outputChannel.dispose();
    }
}
exports.ZanaiCodeIntegration = ZanaiCodeIntegration;
//# sourceMappingURL=zanaiCodeIntegration.js.map