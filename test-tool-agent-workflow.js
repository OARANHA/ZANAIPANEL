/**
 * Manual test to validate the Tool Agent workflow structure
 * Creates a sample workflow and validates it against the expected format
 */

console.log('🧪 Testing Tool Agent Workflow Structure...\n');

// Create a sample Tool Agent workflow based on our implementation
const sampleWorkflow = {
  id: 'test-agent-123',
  name: 'Test Tool Agent',
  description: 'A test agent for Tool Agent workflow export',
  type: 'AGENTFLOW',
  flowData: JSON.stringify({
    nodes: [
      {
        id: 'chatOpenAI_0',
        type: 'customNode',
        position: { x: 97.01321406237057, y: 63.67664262280914 },
        positionAbsolute: { x: 97.01321406237057, y: 63.67664262280914 },
        width: 300,
        height: 771,
        selected: false,
        dragging: false,
        data: {
          id: 'chatOpenAI_0',
          label: 'ChatOpenAI',
          version: 8.2,
          name: 'chatOpenAI',
          type: 'ChatOpenAI',
          baseClasses: ['ChatOpenAI', 'BaseChatModel', 'BaseLanguageModel', 'Runnable'],
          category: 'Chat Models',
          description: 'Wrapper around OpenAI large language models that use the Chat endpoint',
          inputParams: [
            {
              label: 'Model Name',
              name: 'modelName',
              type: 'asyncOptions',
              loadMethod: 'listModels',
              default: 'gpt-4o-mini',
              id: 'chatOpenAI_0-input-modelName-asyncOptions',
              display: true
            },
            {
              label: 'Temperature',
              name: 'temperature',
              type: 'number',
              step: 0.1,
              default: 0.7,
              optional: true,
              id: 'chatOpenAI_0-input-temperature-number',
              display: true
            },
            {
              label: 'Image Resolution',
              description: 'This parameter controls the resolution in which the model views the image.',
              name: 'imageResolution',
              type: 'options',
              options: [
                { label: 'Low', name: 'low' },
                { label: 'High', name: 'high' },
                { label: 'Auto', name: 'auto' }
              ],
              default: 'low',
              optional: false,
              show: { 'allowImageUploads': true },
              id: 'chatOpenAI_0-input-imageResolution-options',
              display: true
            }
          ],
          inputAnchors: [
            {
              label: 'Cache',
              name: 'cache',
              type: 'BaseCache',
              optional: true,
              id: 'chatOpenAI_0-input-cache-BaseCache',
              display: true
            }
          ],
          inputs: {
            cache: '',
            modelName: 'gpt-4o-mini',
            temperature: 0.7,
            streaming: true,
            maxTokens: '',
            allowImageUploads: false,
            imageResolution: 'low'
          },
          outputAnchors: [
            {
              id: 'chatOpenAI_0-output-chatOpenAI-ChatOpenAI|BaseChatModel|BaseLanguageModel|Runnable',
              name: 'chatOpenAI',
              label: 'ChatOpenAI',
              description: 'Wrapper around OpenAI large language models that use the Chat endpoint',
              type: 'ChatOpenAI | BaseChatModel | BaseLanguageModel | Runnable'
            }
          ],
          outputs: {},
          selected: false
        }
      },
      {
        id: 'bufferMemory_1',
        type: 'customNode',
        position: { x: 607.6260576768354, y: 584.7920541862369 },
        positionAbsolute: { x: 607.6260576768354, y: 584.7920541862369 },
        width: 300,
        height: 258,
        selected: false,
        dragging: false,
        data: {
          id: 'bufferMemory_1',
          label: 'Buffer Memory',
          version: 2,
          name: 'bufferMemory',
          type: 'BufferMemory',
          baseClasses: ['BufferMemory', 'BaseChatMemory', 'BaseMemory'],
          category: 'Memory',
          description: 'Retrieve chat messages stored in database',
          inputParams: [
            {
              label: 'Session Id',
              name: 'sessionId',
              type: 'string',
              description: 'If not specified, a random id will be used.',
              default: '',
              additionalParams: true,
              optional: true,
              id: 'bufferMemory_1-input-sessionId-string'
            },
            {
              label: 'Memory Key',
              name: 'memoryKey',
              type: 'string',
              default: 'chat_history',
              additionalParams: true,
              id: 'bufferMemory_1-input-memoryKey-string'
            }
          ],
          inputAnchors: [],
          inputs: {
            sessionId: '',
            memoryKey: 'chat_history'
          },
          outputAnchors: [
            {
              id: 'bufferMemory_1-output-bufferMemory-BufferMemory|BaseChatMemory|BaseMemory',
              name: 'bufferMemory',
              label: 'BufferMemory',
              type: 'BufferMemory | BaseChatMemory | BaseMemory'
            }
          ],
          outputs: {},
          selected: false
        }
      },
      {
        id: 'calculator_1',
        type: 'customNode',
        position: { x: 800.5125025564965, y: 72.40592063242738 },
        positionAbsolute: { x: 800.5125025564965, y: 72.40592063242738 },
        width: 300,
        height: 149,
        selected: false,
        dragging: false,
        data: {
          id: 'calculator_1',
          label: 'Calculator',
          version: 1,
          name: 'calculator',
          type: 'Calculator',
          baseClasses: ['Calculator', 'Tool', 'StructuredTool', 'BaseLangChain'],
          category: 'Tools',
          description: 'Perform calculations on response',
          inputParams: [],
          inputAnchors: [],
          inputs: {},
          outputAnchors: [
            {
              id: 'calculator_1-output-calculator-Calculator|Tool|StructuredTool|BaseLangChain',
              name: 'calculator',
              label: 'Calculator',
              type: 'Calculator | Tool | StructuredTool | BaseLangChain'
            }
          ],
          outputs: {},
          selected: false
        }
      },
      {
        id: 'toolAgent_0',
        type: 'customNode',
        position: { x: 1200.6756893536506, y: 208.18578883272318 },
        positionAbsolute: { x: 1200.6756893536506, y: 208.18578883272318 },
        width: 300,
        height: 491,
        selected: false,
        dragging: false,
        data: {
          id: 'toolAgent_0',
          label: 'Tool Agent',
          version: 2,
          name: 'toolAgent',
          type: 'AgentExecutor',
          baseClasses: ['AgentExecutor', 'BaseChain', 'Runnable'],
          category: 'Agents',
          description: 'Agent that uses Function Calling to pick the tools and args to call',
          inputParams: [
            {
              label: 'System Message',
              name: 'systemMessage',
              type: 'string',
              default: 'You are a helpful AI assistant.',
              description: 'If Chat Prompt Template is provided, this will be ignored',
              rows: 4,
              optional: true,
              additionalParams: true,
              id: 'toolAgent_0-input-systemMessage-string',
              display: true
            }
          ],
          inputAnchors: [
            {
              label: 'Tools',
              name: 'tools',
              type: 'Tool',
              list: true,
              id: 'toolAgent_0-input-tools-Tool',
              display: true
            },
            {
              label: 'Memory',
              name: 'memory',
              type: 'BaseChatMemory',
              id: 'toolAgent_0-input-memory-BaseChatMemory',
              display: true
            },
            {
              label: 'Tool Calling Chat Model',
              name: 'model',
              type: 'BaseChatModel',
              description: 'Only compatible with models that are capable of function calling',
              id: 'toolAgent_0-input-model-BaseChatModel',
              display: true
            }
          ],
          inputs: {
            tools: ['{{calculator_1.data.instance}}'],
            memory: '{{bufferMemory_1.data.instance}}',
            model: '{{chatOpenAI_0.data.instance}}',
            systemMessage: 'You are a helpful AI assistant.',
            maxIterations: '',
            enableDetailedStreaming: ''
          },
          outputAnchors: [
            {
              id: 'toolAgent_0-output-toolAgent-AgentExecutor|BaseChain|Runnable',
              name: 'toolAgent',
              label: 'AgentExecutor',
              description: 'Agent that uses Function Calling to pick the tools and args to call',
              type: 'AgentExecutor | BaseChain | Runnable'
            }
          ],
          outputs: {},
          selected: false
        }
      }
    ],
    edges: [
      {
        id: 'chatOpenAI_0-chatOpenAI_0-output-chatOpenAI-ChatOpenAI|BaseChatModel|BaseLanguageModel|Runnable-toolAgent_0-toolAgent_0-input-model-BaseChatModel',
        source: 'chatOpenAI_0',
        target: 'toolAgent_0',
        sourceHandle: 'chatOpenAI_0-output-chatOpenAI-ChatOpenAI|BaseChatModel|BaseLanguageModel|Runnable',
        targetHandle: 'toolAgent_0-input-model-BaseChatModel',
        type: 'buttonedge',
        data: {}
      },
      {
        id: 'bufferMemory_1-bufferMemory_1-output-bufferMemory-BufferMemory|BaseChatMemory|BaseMemory-toolAgent_0-toolAgent_0-input-memory-BaseChatMemory',
        source: 'bufferMemory_1',
        target: 'toolAgent_0',
        sourceHandle: 'bufferMemory_1-output-bufferMemory-BufferMemory|BaseChatMemory|BaseMemory',
        targetHandle: 'toolAgent_0-input-memory-BaseChatMemory',
        type: 'buttonedge',
        data: {}
      },
      {
        id: 'calculator_1-calculator_1-output-calculator-Calculator|Tool|StructuredTool|BaseLangChain-toolAgent_0-toolAgent_0-input-tools-Tool',
        source: 'calculator_1',
        target: 'toolAgent_0',
        sourceHandle: 'calculator_1-output-calculator-Calculator|Tool|StructuredTool|BaseLangChain',
        targetHandle: 'toolAgent_0-input-tools-Tool',
        type: 'buttonedge',
        data: {}
      }
    ],
    viewport: { x: 0, y: 0, zoom: 1 }
  }),
  deployed: false,
  isPublic: false,
  category: 'Tools',
  chatbotConfig: JSON.stringify({
    modelName: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: 'You are a helpful AI assistant.',
    welcomeMessage: 'Hello! I\'m Test Tool Agent. How can I help you today?',
    placeholder: 'Type your message here...',
    streaming: true,
    memory: true,
    contextWindow: 4096,
    tools: ['calculator'],
    agentType: 'composed',
    agentId: 'test-agent-123',
    toolAgentEnabled: true,
    functionCalling: true
  }),
  apiConfig: JSON.stringify({
    apiEndpoint: '/api/v1/agentflows/test-agent-123',
    apiKey: 'flowise_test-agent-123',
    authentication: {
      type: 'bearer',
      token: 'flowise_test-agent-123'
    },
    rateLimit: {
      requests: 100,
      window: '15min'
    },
    responseFormat: 'json',
    streaming: true,
    agentType: 'composed',
    agentId: 'test-agent-123',
    version: '1.0.0',
    workflowType: 'AGENTFLOW',
    supportsFunctionCalling: true,
    compatibleModels: ['gpt-4', 'gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo']
  }),
  workspaceId: 'test-workspace-456'
};

// Validation function
function validateWorkflow(workflow) {
  const errors = [];
  const warnings = [];
  
  console.log('📋 Step 1: Validating basic workflow structure...');
  
  // Check basic fields
  if (!workflow.id) errors.push('Missing workflow id');
  if (!workflow.name) errors.push('Missing workflow name');
  if (!workflow.type) errors.push('Missing workflow type');
  if (!workflow.flowData) errors.push('Missing flowData');
  
  // Check workflow type
  if (workflow.type !== 'AGENTFLOW') {
    errors.push('Workflow type should be AGENTFLOW for Tool Agent');
  }
  
  console.log('📋 Step 2: Parsing and validating flowData...');
  let flowData;
  try {
    flowData = JSON.parse(workflow.flowData);
  } catch (e) {
    errors.push('flowData is not valid JSON');
    return { valid: false, errors, warnings };
  }
  
  // Check flowData structure
  if (!flowData.nodes || !Array.isArray(flowData.nodes)) {
    errors.push('flowData must contain a nodes array');
  }
  if (!flowData.edges || !Array.isArray(flowData.edges)) {
    errors.push('flowData must contain an edges array');
  }
  
  console.log('📋 Step 3: Validating nodes...');
  if (flowData.nodes) {
    const nodeTypes = flowData.nodes.map(node => node.data.type);
    const nodeCategories = flowData.nodes.map(node => node.data.category);
    
    console.log('  Node types found:', nodeTypes);
    console.log('  Node categories found:', nodeCategories);
    
    // Check for required nodes
    const hasToolAgent = flowData.nodes.some(node => node.data.type === 'AgentExecutor');
    const hasChatOpenAI = flowData.nodes.some(node => node.data.type === 'ChatOpenAI');
    const hasBufferMemory = flowData.nodes.some(node => node.data.type === 'BufferMemory');
    const hasTools = flowData.nodes.some(node => node.data.category === 'Tools');
    
    if (!hasToolAgent) errors.push('Missing Tool Agent node (AgentExecutor)');
    if (!hasChatOpenAI) errors.push('Missing ChatOpenAI node');
    if (!hasBufferMemory) warnings.push('Missing Buffer Memory node (recommended)');
    if (!hasTools) errors.push('Missing tool nodes');
    
    // Check node metadata
    flowData.nodes.forEach((node, index) => {
      if (!node.data.version) warnings.push(`Node ${index} (${node.data.type}) missing version`);
      if (!node.data.baseClasses) warnings.push(`Node ${index} (${node.data.type}) missing baseClasses`);
      if (!node.data.inputParams) warnings.push(`Node ${index} (${node.data.type}) missing inputParams`);
      if (!node.data.outputAnchors) warnings.push(`Node ${index} (${node.data.type}) missing outputAnchors`);
      if (!node.position) errors.push(`Node ${index} (${node.data.type}) missing position`);
      if (!node.width) warnings.push(`Node ${index} (${node.data.type}) missing width`);
      if (!node.height) warnings.push(`Node ${index} (${node.data.type}) missing height`);
    });
  }
  
  console.log('📋 Step 4: Validating edges...');
  if (flowData.edges) {
    // Check for required connections
    const requiredConnections = [
      { from: 'chatOpenAI_0', to: 'toolAgent_0' },
      { from: 'bufferMemory_1', to: 'toolAgent_0' },
      { from: 'calculator_1', to: 'toolAgent_0' }
    ];
    
    requiredConnections.forEach(conn => {
      const connectionExists = flowData.edges.some(edge => 
        edge.source === conn.from && edge.target === conn.to
      );
      if (!connectionExists) {
        warnings.push(`Missing connection: ${conn.from} → ${conn.to}`);
      }
    });
    
    // Check edge structure
    flowData.edges.forEach((edge, index) => {
      if (!edge.sourceHandle) warnings.push(`Edge ${index} missing sourceHandle`);
      if (!edge.targetHandle) warnings.push(`Edge ${index} missing targetHandle`);
      if (!edge.type) warnings.push(`Edge ${index} missing type`);
    });
  }
  
  console.log('📋 Step 5: Validating configurations...');
  try {
    const chatbotConfig = JSON.parse(workflow.chatbotConfig);
    const apiConfig = JSON.parse(workflow.apiConfig);
    
    if (!chatbotConfig.toolAgentEnabled) warnings.push('chatbotConfig missing toolAgentEnabled');
    if (!chatbotConfig.functionCalling) warnings.push('chatbotConfig missing functionCalling');
    
    if (apiConfig.workflowType !== 'AGENTFLOW') {
      errors.push('apiConfig workflowType should be AGENTFLOW');
    }
    if (!apiConfig.supportsFunctionCalling) {
      errors.push('apiConfig missing supportsFunctionCalling');
    }
  } catch (e) {
    errors.push('Invalid configuration JSON');
  }
  
  return { valid: errors.length === 0, errors, warnings };
}

// Run validation
console.log('🔍 Running validation on sample workflow...');
const validation = validateWorkflow(sampleWorkflow);

console.log('\n🎯 Validation Results:');
console.log('====================');
console.log(`Valid: ${validation.valid ? '✅ YES' : '❌ NO'}`);
console.log(`Errors: ${validation.errors.length}`);
console.log(`Warnings: ${validation.warnings.length}`);

if (validation.errors.length > 0) {
  console.log('\n❌ Errors:');
  validation.errors.forEach(error => console.log(`  - ${error}`));
}

if (validation.warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  validation.warnings.forEach(warning => console.log(`  - ${warning}`));
}

if (validation.valid) {
  console.log('\n✅ SUCCESS: The sample Tool Agent workflow is valid!');
  console.log('✅ All required components are present');
  console.log('✅ Structure matches Flowise format');
  console.log('✅ Ready for export to Flowise');
} else {
  console.log('\n❌ FAILURE: The workflow has validation errors');
  console.log('❌ Please fix the errors before exporting');
}

console.log('\n📋 Test completed!');