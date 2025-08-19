#!/usr/bin/env node

// Test script for export functionality

async function testExport() {
  console.log('🧪 Testing export functionality...');
  
  try {
    // Test 1: Test connection to Flowise external
    console.log('\n1. Testing connection to Flowise external...');
    const connectionResponse = await fetch('http://localhost:3000/api/flowise-external-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'test_connection' })
    });
    
    const connectionResult = await connectionResponse.json();
    console.log('Connection result:', connectionResult);
    
    if (!connectionResult.success) {
      console.error('❌ Connection test failed:', connectionResult);
      return;
    }
    
    // Test 2: Get workflows from external Flowise
    console.log('\n2. Getting workflows from external Flowise...');
    const workflowsResponse = await fetch('http://localhost:3000/api/flowise-external-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_workflows' })
    });
    
    const workflowsResult = await workflowsResponse.json();
    console.log('Workflows result:', {
      success: workflowsResult.success,
      count: workflowsResult.data?.length || 0
    });
    
    if (!workflowsResult.success || !workflowsResult.data || workflowsResult.data.length === 0) {
      console.error('❌ No workflows found or error getting workflows');
      return;
    }
    
    // Test 3: Try to export a workflow
    console.log('\n3. Testing workflow export...');
    const testWorkflow = workflowsResult.data[0];
    console.log('Testing with workflow:', testWorkflow.name);
    
    const exportData = {
      name: testWorkflow.name,
      description: testWorkflow.description || '',
      type: testWorkflow.type || 'CHATFLOW',
      flowData: testWorkflow.flowData || '{"nodes":[],"edges":[],"viewport":{"x":0,"y":0,"zoom":1}}',
      deployed: testWorkflow.deployed || false,
      isPublic: testWorkflow.isPublic || false,
      category: testWorkflow.category || 'general'
    };
    
    const exportResponse = await fetch('http://localhost:3000/api/flowise-external-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'export_workflow',
        canvasId: testWorkflow.id,
        workflowData: exportData
      })
    });
    
    const exportResult = await exportResponse.json();
    console.log('Export result:', exportResult);
    
    if (exportResult.success) {
      console.log('✅ Export test successful!');
    } else {
      console.error('❌ Export test failed:', exportResult);
    }
    
    // Test 4: Check export logs
    console.log('\n4. Checking export logs...');
    const logsResponse = await fetch('http://localhost:3000/api/admin/flowise-workflows/export-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'get_export_logs',
        data: { limit: 5 }
      })
    });
    
    const logsResult = await logsResponse.json();
    console.log('Export logs:', {
      success: logsResult.success,
      count: logsResult.logs?.length || 0
    });
    
    if (logsResult.logs && logsResult.logs.length > 0) {
      console.log('Latest log:', logsResult.logs[0]);
    }
    
  } catch (error) {
    console.error('💥 Test failed with error:', error.message);
  }
}

testExport();