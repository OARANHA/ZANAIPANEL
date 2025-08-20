import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const composition = await db.composition.findUnique({
      where: { id: params.id },
      include: {
        workspace: true,
        agents: true
      }
    });

    if (!composition) {
      return NextResponse.json(
        { error: 'Composição não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(composition);
  } catch (error) {
    console.error('Erro ao buscar composição:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar composição' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    const composition = await db.composition.update({
      where: { id: params.id },
      data: {
        name,
        description: description || null,
        updatedAt: new Date()
      },
      include: {
        workspace: true,
        agents: true
      }
    });

    return NextResponse.json(composition);
  } catch (error) {
    console.error('Erro ao atualizar composição:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar composição' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Await params to fix Next.js warning
    const { id } = await params;
    console.log('DELETE request received for composition ID:', id);
    
    // Use a transaction with aggressive cleanup
    const result = await db.$transaction(async (tx) => {
      // First, check if the composition exists
      const existingComposition = await tx.composition.findUnique({
        where: { id }
      });
      
      if (!existingComposition) {
        throw new Error('Composição não encontrada');
      }
      
      console.log('Found composition to delete:', existingComposition.name);
      
      // Disable foreign key constraints temporarily
      console.log('Disabling foreign key constraints...');
      await tx.$executeRaw`PRAGMA foreign_keys = OFF`;
      
      try {
        // Delete all executions first
        console.log('Deleting executions...');
        await tx.execution.deleteMany({
          where: {
            compositionId: id
          }
        });
        console.log('Executions deleted');
        
        // Delete agent relationships
        console.log('Deleting agent relationships...');
        try {
          await tx.$executeRaw`DELETE FROM \`main\`.\`_AgentToComposition\` WHERE \`B\` = ${id}`;
          console.log('Agent relationships deleted');
        } catch (error) {
          console.log('No agent relationships to delete or error:', error.message);
        }
        
        // Now delete the composition
        console.log('Deleting composition...');
        const deletedComposition = await tx.composition.delete({
          where: { id }
        });
        
        return deletedComposition;
      } finally {
        // Re-enable foreign key constraints
        console.log('Re-enabling foreign key constraints...');
        await tx.$executeRaw`PRAGMA foreign_keys = ON`;
      }
    });

    console.log('Composition deleted successfully:', id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar composição:', error);
    
    if (error.message === 'Composição não encontrada') {
      return NextResponse.json(
        { error: 'Composição não encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erro ao deletar composição: ' + error.message },
      { status: 500 }
    );
  }
}