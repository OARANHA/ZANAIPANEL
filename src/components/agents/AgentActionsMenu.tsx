'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MoreVertical, 
  Play, 
  Copy, 
  Download, 
  Share2, 
  Archive, 
  ArchiveRestore, 
  Trash2, 
  Settings, 
  BarChart3, 
  Clock, 
  Users, 
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface AgentActionsMenuProps {
  agent: any;
  onExecute?: (agent: any) => void;
  onEdit?: (agent: any) => void;
  onDuplicate?: (agent: any) => void;
  onArchive?: (agent: any) => void;
  onDelete?: (agent: any) => void;
  onExport?: (agent: any) => void;
  onShare?: (agent: any) => void;
}

export default function AgentActionsMenu({ 
  agent, 
  onExecute,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete,
  onExport,
  onShare
}: AgentActionsMenuProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [duplicateName, setDuplicateName] = useState(`${agent.name} (Cópia)`);

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      await onExecute?.(agent);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleDuplicate = async () => {
    setIsDuplicating(true);
    try {
      await onDuplicate?.({ ...agent, name: duplicateName });
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleExport = () => {
    onExport?.(agent);
  };

  const handleShare = () => {
    // Gerar URL de compartilhamento (simulado)
    const url = `${window.location.origin}/shared/agent/${agent.id}`;
    setShareUrl(url);
    setIsShareDialogOpen(true);
  };

  const handleCopyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch (error) {
      console.error('Erro ao copiar URL:', error);
    }
  };

  const handleDelete = async () => {
    await onDelete?.(agent);
    setIsDeleteDialogOpen(false);
  };

  const isArchived = agent.status === 'inactive';

  const menuContent = (
    <div className="absolute right-0 bottom-full z-[10002] mb-1">
      <div className="bg-gray-900 border border-gray-700 shadow-lg rounded-lg min-w-[200px] p-1">
        <div className="py-1">
          <div className="px-2 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Ações do Agente
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleExecute();
              setIsMenuOpen(false);
            }}
            disabled={isExecuting || agent.status !== 'active'}
            className="w-full text-left px-2 py-1.5 text-sm flex items-center space-x-2 rounded-sm hover:bg-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExecuting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>Executar Agente</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(agent);
              setIsMenuOpen(false);
            }}
            className="w-full text-left px-2 py-1.5 text-sm flex items-center space-x-2 rounded-sm hover:bg-gray-700 text-gray-300"
          >
            <Settings className="w-4 h-4" />
            <span>Editar</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDuplicate();
              setIsMenuOpen(false);
            }}
            disabled={isDuplicating}
            className="w-full text-left px-2 py-1.5 text-sm flex items-center space-x-2 rounded-sm hover:bg-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDuplicating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>Duplicar</span>
          </button>
          
          <div className="border-t border-gray-700 my-1" />
          
          <div className="px-2 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Compartilhamento
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleExport();
              setIsMenuOpen(false);
            }}
            className="w-full text-left px-2 py-1.5 text-sm flex items-center space-x-2 rounded-sm hover:bg-gray-700 text-gray-300"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Configuração</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
              setIsMenuOpen(false);
            }}
            className="w-full text-left px-2 py-1.5 text-sm flex items-center space-x-2 rounded-sm hover:bg-gray-700 text-gray-300"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartilhar</span>
          </button>
          
          <div className="border-t border-gray-700 my-1" />
          
          <div className="px-2 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Gerenciamento
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onArchive?.(agent);
              setIsMenuOpen(false);
            }}
            className="w-full text-left px-2 py-1.5 text-sm flex items-center space-x-2 rounded-sm hover:bg-gray-700 text-gray-300"
          >
            {isArchived ? (
              <>
                <ArchiveRestore className="w-4 h-4" />
                <span>Desarquivar</span>
              </>
            ) : (
              <>
                <Archive className="w-4 h-4" />
                <span>Arquivar</span>
              </>
            )}
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteDialogOpen(true);
              setIsMenuOpen(false);
            }}
            className="w-full text-left px-2 py-1.5 text-sm flex items-center space-x-2 rounded-sm hover:bg-red-900 text-red-300"
          >
            <Trash2 className="w-4 h-4" />
            <span>Excluir Permanentemente</span>
          </button>
          
          <div className="border-t border-gray-700 my-1" />
          
          <div className="px-2 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Informações
          </div>
          
          <button
            disabled
            className="w-full text-left px-2 py-1.5 text-sm flex items-center justify-between space-x-2 rounded-sm opacity-50 text-gray-500"
          >
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Estatísticas</span>
            </div>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">24 execuções</span>
          </button>
          
          <button
            disabled
            className="w-full text-left px-2 py-1.5 text-sm flex items-center justify-between space-x-2 rounded-sm opacity-50 text-gray-500"
          >
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Última Execução</span>
            </div>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">há 2 min</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="relative">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
        
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-[10000] bg-black/20 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Menu content */}
            {menuContent}
          </>
        )}
      </div>

      {/* Diálogo de Confirmação de Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>Confirmar Exclusão</span>
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir permanentemente o agente "{agent.name}"? 
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Compartilhamento */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Share2 className="w-5 h-5" />
              <span>Compartilhar Agente</span>
            </DialogTitle>
            <DialogDescription>
              Compartilhe este agente com outros usuários através do link abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Qualquer pessoa com este link poderá visualizar e usar este agente.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="share-url">Link de Compartilhamento</Label>
              <div className="flex space-x-2">
                <Input 
                  id="share-url" 
                  value={shareUrl} 
                  readOnly 
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCopyShareUrl}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
                Fechar
              </Button>
              <Button onClick={handleCopyShareUrl}>
                <Copy className="w-4 h-4 mr-2" />
                Copiar Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Duplicação */}
      <Dialog open={isDuplicating} onOpenChange={(open) => !open && setIsDuplicating(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Copy className="w-5 h-5" />
              <span>Duplicar Agente</span>
            </DialogTitle>
            <DialogDescription>
              Crie uma cópia deste agente com um novo nome.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="duplicate-name">Nome do Novo Agente</Label>
              <Input 
                id="duplicate-name" 
                value={duplicateName} 
                onChange={(e) => setDuplicateName(e.target.value)}
                placeholder="Nome do agente duplicado"
              />
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                A duplicação criará um novo agente com as mesmas configurações, 
                mas com histórico de execuções separado.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsDuplicating(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleDuplicate}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}