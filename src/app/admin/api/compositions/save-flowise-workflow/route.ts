import { NextRequest, NextResponse } from 'next/server';
import { FlowiseConverter } from '@/lib/flowise-converter';
import { createFlowiseClient, defaultFlowiseConfig } from '@/lib/flowise-client';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { generatedWorkflow, workspaceId, compositionId } = body;

    if (!generatedWorkflow || !workspaceId || !compositionId) {
      return NextResponse.json(
        { error: 'Dados incompletos para salvar workflow Flowise' },
        { status: 400 }
      );
    }

    // Converter o workflow gerado para o formato Flowise
    const flowiseWorkflow = await FlowiseConverter.convertToFlowiseFormat(
      generatedWorkflow,
      workspaceId
    );

    // Salvar no banco de dados local
    const flowiseWorkflowRecord = await FlowiseConverter.saveToDatabase(
      flowiseWorkflow,
      generatedWorkflow,
      workspaceId
    );

    // Tentar criar o workflow no Flowise
    let flowiseApiResult = null;
    try {
      const flowiseClient = createFlowiseClient(defaultFlowiseConfig);
      
      // Testar conexão com Flowise
      const isConnected = await flowiseClient.testConnection();
      if (!isConnected) {
        console.warn('Flowise não está disponível, salvando apenas localmente');
      } else {
        // Preparar dados para Flowise
        const flowiseChatflowData = {
          name: generatedWorkflow.name,
          description: generatedWorkflow.description,
          type: 'AGENTFLOW' as const,
          flowData: JSON.stringify(flowiseWorkflow),
          deployed: false,
          isPublic: false,
          category: 'generated',
          workspaceId,
          chatbotConfig: JSON.stringify({
            inputFields: [
              {
                label: 'Input',
                name: 'input',
                type: 'string',
                required: true
              }
            ],
            outputFields: [
              {
                label: 'Response',
                name: 'response',
                type: 'string'
              }
            ]
          }),
          apiConfig: JSON.stringify({
            enabled: true,
            endpoint: `/api/v1/prediction/${flowiseWorkflowRecord.id}`,
            method: 'POST'
          })
        };

        // Criar chatflow no Flowise
        const createdChatflow = await flowiseClient.createChatflow(flowiseChatflowData);
        flowiseApiResult = createdChatflow;
        
        // Atualizar registro local com o ID do Flowise
        await db.flowiseWorkflow.update({
          where: { id: flowiseWorkflowRecord.id },
          data: {
            flowiseId: createdChatflow.id,
            deployed: createdChatflow.deployed || false
          }
        });

        console.log('Workflow criado com sucesso no Flowise:', createdChatflow.id);
      }
    } catch (flowiseError) {
      console.error('Erro ao criar workflow no Flowise:', flowiseError);
      // Não falhar a operação inteira se Flowise falhar
      // O workflow já foi salvo localmente
    }

    // Atualizar a composição com a referência ao workflow Flowise
    try {
      await db.composition.update({
        where: { id: compositionId },
        data: {
          config: JSON.stringify({
            flowiseWorkflowId: flowiseWorkflowRecord.id,
            flowiseApiId: flowiseApiResult?.id,
            aiGenerated: true,
            nodes: generatedWorkflow.nodes,
            edges: generatedWorkflow.edges,
            workflowType: generatedWorkflow.complexity,
            estimatedTime: generatedWorkflow.estimatedTime
          })
        }
      });
    } catch (updateError) {
      console.error('Erro ao atualizar composição com referência Flowise:', updateError);
      // Continuar mesmo se a atualização falhar
    }

    return NextResponse.json({
      success: true,
      message: 'Workflow Flowise salvo com sucesso',
      flowiseWorkflowId: flowiseWorkflowRecord.id,
      flowiseApiId: flowiseApiResult?.id,
      workflow: {
        id: flowiseWorkflowRecord.id,
        name: generatedWorkflow.name,
        description: generatedWorkflow.description,
        complexity: generatedWorkflow.complexity,
        estimatedTime: generatedWorkflow.estimatedTime,
        nodeCount: flowiseWorkflow.nodes.length,
        edgeCount: flowiseWorkflow.edges.length,
        deployed: flowiseApiResult?.deployed || false,
        flowiseAvailable: !!flowiseApiResult
      }
    });
  } catch (error) {
    console.error('Error saving Flowise workflow:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar workflow Flowise' },
      { status: 500 }
    );
  }
}