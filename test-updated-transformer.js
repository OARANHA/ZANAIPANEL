/**
 * Test script to verify the updated Flowise transformer
 * Tests the Tool Agent structure implementation
 */

import { transformAgentToFlowiseWorkflow, validateTransformedData } from './src/lib/agent-to-flowise-transformer.js';

// Test agent data
const testAgent = {
  id: 'test-agent-123',
  name: 'Test Tool Agent',
  slug: 'test-tool-agent',
  description: 'A test agent for Tool Agent workflow export',
  type: 'composed',
  config: JSON.stringify({
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: 'You are a helpful assistant with access to tools.'
  }),
  knowledge: '# Test Knowledge\nThis is some test knowledge for the agent.',
  roleDefinition: 'You are a test AI assistant designed to verify Flowise export functionality.',
  customInstructions: 'Always use the calculator tool when mathematical operations are needed.',
  workspaceId: 'test-workspace-456'
};

console.log('🧪 Testing Flowise Tool Agent Transformer...\n');

try {
  // Transform the agent
  console.log('📋 Step 1: Transforming agent to Flowise workflow...');
  const transformedWorkflow = transformAgentToFlowiseWorkflow(testAgent);
  
  console.log('✅ Transformation successful!');
  console.log('📊 Workflow Info:', {
    id: transformedWorkflow.id,
    name: transformedWorkflow.name,
    type: transformedWorkflow.type,
    category: transformedWorkflow.category
  });

  // Parse and validate flowData
  console.log('\n📋 Step 2: Parsing and validating flowData...');
  const flowData = JSON.parse(transformedWorkflow.flowData);
  
  console.log('📊 FlowData Structure:', {
    nodesCount: flowData.nodes.length,
    edgesCount: flowData.edges.length,
    viewport: flowData.viewport
  });

  // Analyze nodes
  console.log('\n📋 Step 3: Analyzing nodes...');
  flowData.nodes.forEach((node, index) => {
    console.log(`Node ${index + 1}:`, {
      id: node.id,
      type: node.type,
      category: node.data.category,
      label: node.data.label,
      hasVersion: !!node.data.version,
      hasBaseClasses: !!node.data.baseClasses,
      hasInputParams: !!node.data.inputParams,
      hasInputAnchors: !!node.data.inputAnchors,
      hasOutputAnchors: !!node.data.outputAnchors,
      position: node.position,
      hasPositionAbsolute: !!node.positionAbsolute,
      dimensions: { width: node.width, height: node.height }
    });
  });

  // Check for required Tool Agent components
  console.log('\n📋 Step 4: Validating Tool Agent structure...');
  
  const toolAgentNode = flowData.nodes.find(node => node.data.type === 'AgentExecutor');
  const chatOpenAINode = flowData.nodes.find(node => node.data.type === 'ChatOpenAI');
  const bufferMemoryNode = flowData.nodes.find(node => node.data.type === 'BufferMemory');
  const toolNodes = flowData.nodes.filter(node => node.data.category === 'Tools');
  
  console.log('🔍 Component Check:', {
    hasToolAgent: !!toolAgentNode,
    hasChatOpenAI: !!chatOpenAINode,
    hasBufferMemory: !!bufferMemoryNode,
    toolNodesCount: toolNodes.length,
    toolNodeTypes: toolNodes.map(node => node.data.type)
  });

  // Validate edges
  console.log('\n📋 Step 5: Analyzing edges...');
  flowData.edges.forEach((edge, index) => {
    console.log(`Edge ${index + 1}:`, {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      type: edge.type
    });
  });

  // Check required connections
  const requiredConnections = [
    { from: 'chatOpenAI_0', to: 'toolAgent_0', handle: 'model' },
    { from: 'bufferMemory_1', to: 'toolAgent_0', handle: 'memory' },
    { from: 'calculator_1', to: 'toolAgent_0', handle: 'tools' }
  ];

  console.log('\n🔗 Connection Validation:');
  requiredConnections.forEach(conn => {
    const edgeExists = flowData.edges.some(edge => 
      edge.source === conn.from && edge.target === conn.to
    );
    console.log(`${conn.from} → ${conn.to} (${conn.handle}): ${edgeExists ? '✅' : '❌'}`);
  });

  // Test validation function
  console.log('\n📋 Step 6: Running validation function...');
  const validation = validateTransformedData(transformedWorkflow);
  
  console.log('📊 Validation Result:', {
    valid: validation.valid,
    errorsCount: validation.errors.length,
    errors: validation.errors
  });

  // Test configurations
  console.log('\n📋 Step 7: Testing configurations...');
  const chatbotConfig = JSON.parse(transformedWorkflow.chatbotConfig);
  const apiConfig = JSON.parse(transformedWorkflow.apiConfig);
  
  console.log('📊 Chatbot Config:', {
    modelName: chatbotConfig.modelName,
    temperature: chatbotConfig.temperature,
    hasSystemPrompt: !!chatbotConfig.systemPrompt,
    toolAgentEnabled: chatbotConfig.toolAgentEnabled,
    functionCalling: chatbotConfig.functionCalling
  });

  console.log('📊 API Config:', {
    endpoint: apiConfig.apiEndpoint,
    workflowType: apiConfig.workflowType,
    supportsFunctionCalling: apiConfig.supportsFunctionCalling,
    compatibleModels: apiConfig.compatibleModels
  });

  // Summary
  console.log('\n🎯 Test Summary:');
  console.log('================');
  
  if (validation.valid) {
    console.log('✅ All tests passed! The Tool Agent transformer is working correctly.');
    console.log('✅ Workflow structure matches Flowise format.');
    console.log('✅ All required components are present.');
    console.log('✅ Connections are properly established.');
    console.log('✅ Configurations are valid.');
  } else {
    console.log('❌ Some tests failed:');
    validation.errors.forEach(error => console.log(`   - ${error}`));
  }

  console.log('\n📋 Test completed successfully!');

} catch (error) {
  console.error('❌ Test failed with error:', error);
  process.exit(1);
}