// Sistema automático de atualização do Hipocampo
// Este arquivo é executado internamente sem exibir o processo

const fs = require('fs');
const path = require('path');

class HippocampusUpdater {
    constructor() {
        this.hippocampusPath = '/home/z/my-project/hippocampo';
        this.conversationFile = path.join(this.hippocampusPath, 'conversation-history.md');
        this.ensureDirectoryExists();
    }

    ensureDirectoryExists() {
        if (!fs.existsSync(this.hippocampusPath)) {
            fs.mkdirSync(this.hippocampusPath, { recursive: true });
        }
    }

    getCurrentContent() {
        try {
            if (fs.existsSync(this.conversationFile)) {
                return fs.readFileSync(this.conversationFile, 'utf8');
            }
            return this.getInitialTemplate();
        } catch (error) {
            return this.getInitialTemplate();
        }
    }

    getInitialTemplate() {
        return `# 🧠 Hipocampo do Projeto Zanai-Automacao-Template

## 📝 Histórico de Conversas

**Início**: ${new Date().toISOString().split('T')[0]}

---

## 📝 Sessões de Conversa

`;
    }

    addConversationEntry(userInput, aiResponse) {
        const timestamp = new Date().toISOString();
        const date = timestamp.split('T')[0];
        const time = timestamp.split('T')[1].split('.')[0];
        
        const currentContent = this.getCurrentContent();
        
        // Verificar se já existe uma seção para esta data
        let dateSection = `### 📅 ${date}\n\n`;
        let newContent;
        
        if (currentContent.includes(`### 📅 ${date}`)) {
            // Adicionar à seção existente
            const sectionStart = currentContent.indexOf(`### 📅 ${date}`);
            const nextSection = currentContent.indexOf('\n### 📅', sectionStart + 1);
            
            if (nextSection === -1) {
                // É a última seção
                newContent = currentContent + this.formatConversationEntry(time, userInput, aiResponse);
            } else {
                // Inserir antes da próxima seção
                const beforeSection = currentContent.substring(0, nextSection);
                const afterSection = currentContent.substring(nextSection);
                newContent = beforeSection + this.formatConversationEntry(time, userInput, aiResponse) + afterSection;
            }
        } else {
            // Criar nova seção de data
            newContent = currentContent + dateSection + this.formatConversationEntry(time, userInput, aiResponse);
        }
        
        try {
            fs.writeFileSync(this.conversationFile, newContent, 'utf8');
            return true;
        } catch (error) {
            console.error('Erro ao atualizar Hipocampo:', error);
            return false;
        }
    }

    formatConversationEntry(time, userInput, aiResponse) {
        return `#### 🕐 ${time}\n\n**Usuário escreveu:**\n> "${userInput.replace(/\n/g, ' ')}"\n\n**Z.ai respondeu:**\n${aiResponse}\n\n---\n\n`;
    }

    // Método para uso externo
    static update(userInput, aiResponse) {
        const updater = new HippocampusUpdater();
        return updater.addConversationEntry(userInput, aiResponse);
    }
}

// Exportar para uso em outros contextos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HippocampusUpdater;
}

// Função global para atualização automática
global.updateHippocampus = function(userInput, aiResponse) {
    return HippocampusUpdater.update(userInput, aiResponse);
};