import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    
    // Check composition
    const composition = await db.composition.findUnique({
      where: { id }
    });
    
    // Check agent relationships
    const agentRelationships = await db.$queryRaw`
      SELECT * FROM \`main\`.\`_AgentToComposition\` 
      WHERE \`B\` = ${id}
    `;
    
    // Check executions
    const executions = await db.execution.findMany({
      where: { compositionId: id }
    });
    
    // Try to get foreign key constraints info
    const fkInfo = await db.$queryRaw`
      PRAGMA foreign_key_list(\`main\`.\`Composition\`)
    `;
    
    return NextResponse.json({
      composition,
      agentRelationships,
      executions,
      foreignKeyConstraints: fkInfo
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}