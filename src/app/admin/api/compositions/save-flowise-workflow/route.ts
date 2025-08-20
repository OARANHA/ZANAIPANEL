import { NextRequest, NextResponse } from 'next/server';
import { FlowiseConverter } from '@/lib/flowise-converter';
import { db } from '@/lib/db';

interface SaveFlowiseWorkflowRequest {
  generatedWorkflow: {
    name: string;
    description: string;
    nodes: Array<{
      id: string;
      type: string;
      name: string;
      description: string;
      config: Record<string, any>;
    }>;
    edges: Array<{
      source: string;
      target: string;
      type: string;
    }>;
    agents: string[];
    complexity: 'simple' | 'medium' | 'complex';
    estimatedTime: string;
  };
  workspaceId: string;
  compositionId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as SaveFlowiseWorkflowRequest;
    const { generatedWorkflow, workspaceId, compositionId } = body;

    if (!generatedWorkflow || !workspaceId) {
      return NextResponse.json(
        { error: 'Dados do workflow e workspaceId são obrigatórios' },
        { status: 400 }
      );
    }

    try {
      // Convert generated workflow to Flowise format
      const flowiseWorkflow = await FlowiseConverter.convertToFlowiseFormat(
        generatedWorkflow,
        workspaceId
      );

      // Save to database
      const flowiseWorkflowRecord = await FlowiseConverter.saveToDatabase(
        flowiseWorkflow,
        generatedWorkflow,
        workspaceId
      );

      // Update composition with Flowise workflow reference
      await db.composition.update({
        where: { id: compositionId },
        data: {
          config: JSON.stringify({
            flowiseWorkflowId: flowiseWorkflowRecord.id,
            nodes: generatedWorkflow.nodes,
            edges: generatedWorkflow.edges,
            complexity: generatedWorkflow.complexity,
            aiGenerated: true,
            estimatedTime: generatedWorkflow.estimatedTime,
            createdAt: new Date().toISOString()
          })
        }
      });

      return NextResponse.json({
        success: true,
        flowiseWorkflow: flowiseWorkflowRecord,
        message: 'Workflow Flowise salvo com sucesso'
      });

    } catch (conversionError) {
      console.error('Erro ao converter workflow para Flowise:', conversionError);
      
      // Even if Flowise conversion fails, we can still save the basic workflow structure
      try {
        const fallbackFlowiseRecord = await db.flowiseWorkflow.create({
          data: {
            flowiseId: `generated_fallback_${Date.now()}`,
            name: generatedWorkflow.name,
            description: generatedWorkflow.description,
            type: 'AGENTFLOW',
            flowData: JSON.stringify({
              nodes: generatedWorkflow.nodes,
              edges: generatedWorkflow.edges,
              viewport: { x: 0, y: 0, zoom: 1 }
            }),
            deployed: false,
            isPublic: false,
            category: 'generated',
            workspaceId,
            complexityScore: generatedWorkflow.complexity === 'simple' ? 25 : generatedWorkflow.complexity === 'medium' ? 50 : 75,
            nodeCount: generatedWorkflow.nodes.length,
            edgeCount: generatedWorkflow.edges.length,
            maxDepth: Math.max(1, generatedWorkflow.nodes.length),
            nodes: JSON.stringify(generatedWorkflow.nodes),
            connections: JSON.stringify(generatedWorkflow.edges),
            capabilities: JSON.stringify({
              aiGenerated: true,
              workflowType: generatedWorkflow.complexity,
              estimatedTime: generatedWorkflow.estimatedTime,
              agentCount: generatedWorkflow.agents.length,
              fallbackMode: true
            })
          }
        });

        // Update composition with fallback Flowise workflow reference
        await db.composition.update({
          where: { id: compositionId },
          data: {
            config: JSON.stringify({
              flowiseWorkflowId: fallbackFlowiseRecord.id,
              nodes: generatedWorkflow.nodes,
              edges: generatedWorkflow.edges,
              complexity: generatedWorkflow.complexity,
              aiGenerated: true,
              estimatedTime: generatedWorkflow.estimatedTime,
              fallbackMode: true,
              createdAt: new Date().toISOString()
            })
          }
        });

        return NextResponse.json({
          success: true,
          flowiseWorkflow: fallbackFlowiseRecord,
          fallback: true,
          message: 'Workflow salvo em modo fallback (conversão Flowise simplificada)'
        });

      } catch (fallbackError) {
        console.error('Erro ao salvar workflow em modo fallback:', fallbackError);
        
        return NextResponse.json({
          success: false,
          error: 'Não foi possível salvar o workflow Flowise, mas a composição foi criada com sucesso'
        }, { status: 500 });
      }
    }

  } catch (error) {
    console.error('Erro geral ao salvar workflow Flowise:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar workflow Flowise' },
      { status: 500 }
    );
  }
}