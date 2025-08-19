/**
 * Test script simplified for agent creation without authentication
 */

const testSimpleAgentCreation = async () => {
  try {
    console.log('🧪 Testing Simple Agent Creation...\n');

    // Test agent data (minimal)
    const testAgent = {
      name: 'Test Simple Agent',
      description: 'A simple test agent',
      type: 'template',
      persona: {
        name: 'SimpleHelper',
        role: 'Assistant',
        personality: 'Helpful',
        expertise: ['General Help'],
        communicationStyle: 'Simple',
        language: 'pt'
      },
      context: {
        businessDomain: 'General Support',
        industry: 'Technology',
        targetAudience: 'General Users'
      },
      config: {
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 1000
      }
    };

    console.log('📋 Test Agent Data:');
    console.log(JSON.stringify(testAgent, null, 2));
    console.log('\n');

    // Test the API endpoint
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/v1/agents`;
    
    console.log('🌐 Testing API endpoint:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testAgent)
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Request Failed:');
      console.error('Status:', response.status);
      console.error('Response:', errorText);
      return;
    }

    const result = await response.json();
    console.log('✅ Agent Created Successfully!');
    console.log('\n📊 Response Summary:');
    console.log('Agent ID:', result.id);
    console.log('Agent Name:', result.name);
    console.log('Agent Type:', result.type);
    console.log('Status:', result.status);
    
    if (result.flowise) {
      console.log('\n🤖 Flowise Integration:');
      console.log('Status:', result.flowise.status);
      if (result.flowise.workflowId) {
        console.log('Workflow ID:', result.flowise.workflowId);
        console.log('Embed URL:', result.flowise.embedUrl);
      }
      if (result.flowise.error) {
        console.log('Error:', result.flowise.error);
      }
    } else {
      console.log('\n⚠️  No Flowise integration data in response');
    }

  } catch (error) {
    console.error('❌ Test Failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('🔍 Connection refused - is the server running?');
    } else if (error.code === 'ENOTFOUND') {
      console.error('🔍 Host not found - check server URL');
    }
  }
};

// Run the test
if (require.main === module) {
  testSimpleAgentCreation();
}

module.exports = { testSimpleAgentCreation };