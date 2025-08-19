/**
 * Test script for ZanAI-Flowise integration
 * This script tests the complete flow from agent creation to Flowise workflow generation
 */

const testAgentCreation = async () => {
  try {
    console.log('🧪 Testing ZanAI-Flowise Integration...\n');

    // Test agent data
    const testAgent = {
      name: 'Test Assistant',
      description: 'A test assistant for documentation',
      type: 'template',
      persona: {
        name: 'DocHelper',
        role: 'Documentation Assistant',
        personality: 'Helpful and detailed',
        expertise: ['Technical Writing', 'Documentation', 'API Documentation'],
        communicationStyle: 'Clear and structured',
        language: 'pt'
      },
      context: {
        businessDomain: 'Technical Documentation',
        industry: 'Software Development',
        targetAudience: 'Developers and Technical Writers',
        companyProfile: {
          name: 'Test Company',
          size: 'medium',
          sector: 'Technology'
        },
        knowledgeBase: ['API Documentation', 'Technical Writing Best Practices'],
        constraints: ['No medical advice', 'Stay within technical domain']
      },
      rgaConfig: {
        reasoningLevel: 'advanced',
        autonomy: 'medium',
        learningCapability: true,
        decisionMaking: 'assisted'
      },
      config: {
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000,
        tools: ['document_processor', 'search'],
        memory: {
          type: 'hybrid',
          capacity: 1000
        }
      }
    };

    console.log('📋 Test Agent Data:');
    console.log(JSON.stringify(testAgent, null, 2));
    console.log('\n');

    // Test the API endpoint
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/v1/agents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testAgent)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Request Failed:');
      console.error('Status:', response.status);
      console.error('Error:', errorData);
      return;
    }

    const result = await response.json();
    console.log('✅ Agent Created Successfully!');
    console.log('\n📊 Response Summary:');
    console.log('Agent ID:', result.id);
    console.log('Agent Name:', result.name);
    console.log('Agent Type:', result.type);
    console.log('Status:', result.status);
    console.log('\n🔗 Links:');
    console.log('Chat Interface:', result.links.chat);
    console.log('API Endpoint:', result.links.api);
    
    if (result.links.whatsapp) {
      console.log('WhatsApp Integration:', result.links.whatsapp);
    }

    console.log('\n🤖 Flowise Integration:');
    console.log('Status:', result.flowise?.status || 'not_available');
    
    if (result.flowise?.status === 'created') {
      console.log('✅ Workflow ID:', result.flowise.workflowId);
      console.log('🔗 Embed URL:', result.flowise.embedUrl);
      console.log('\n🎉 Integration Test Completed Successfully!');
      console.log('You can now test the agent at:', result.links.chat);
      console.log('Or embed it using:', result.flowise.embedUrl);
    } else if (result.flowise?.status === 'failed') {
      console.log('❌ Integration Failed:', result.flowise.error);
      console.log('\n⚠️  Agent was created but Flowise integration failed.');
      console.log('Check Flowise server configuration and try again.');
    } else {
      console.log('⚠️  Flowise integration status unknown.');
    }

  } catch (error) {
    console.error('❌ Test Failed:', error.message);
    console.error('Stack:', error.stack);
  }
};

// Run the test
if (require.main === module) {
  testAgentCreation();
}

module.exports = { testAgentCreation };