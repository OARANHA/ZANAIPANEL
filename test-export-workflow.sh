#!/bin/bash

# Script para testar exportação de workflows usando curl

echo "🧪 Testando exportação de workflows..."
echo ""

# 1. Testar conexão
echo "1. Testando conexão com Flowise..."
TEST_RESPONSE=$(curl -s -X POST "http://localhost:3000/api/flowise-external-sync" \
  -H "Content-Type: application/json" \
  -d '{"action": "test_connection"}')

echo "Resposta do teste de conexão:"
echo "$TEST_RESPONSE" | python3 -m json.tool
echo ""

# Extrair success da resposta
TEST_SUCCESS=$(echo "$TEST_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['success'])")

if [ "$TEST_SUCCESS" != "True" ]; then
    echo "❌ Falha na conexão"
    exit 1
fi

echo "✅ Conexão estabelecida com sucesso"
echo ""

# 2. Obter workflows disponíveis
echo "2. Obtendo workflows disponíveis..."
WORKFLOWS_RESPONSE=$(curl -s -X POST "http://localhost:3000/api/flowise-external-sync" \
  -H "Content-Type: application/json" \
  -d '{"action": "get_workflows"}')

echo "Resposta dos workflows (primeiros 500 caracteres):"
echo "$WORKFLOWS_RESPONSE" | head -c 500
echo ""
echo ""

# Extrair success da resposta
WORKFLOWS_SUCCESS=$(echo "$WORKFLOWS_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['success'])")

if [ "$WORKFLOWS_SUCCESS" != "True" ]; then
    echo "❌ Falha ao obter workflows"
    exit 1
fi

# Contar workflows
WORKFLOWS_COUNT=$(echo "$WORKFLOWS_RESPONSE" | python3 -c "import sys, json; print(len(json.load(sys.stdin)['data']))")
echo "✅ Encontrados $WORKFLOWS_COUNT workflows"
echo ""

# 3. Testar exportação do primeiro workflow
if [ "$WORKFLOWS_COUNT" -gt 0 ]; then
    echo "3. Testando exportação do primeiro workflow..."
    
    # Extrair primeiro workflow
    FIRST_WORKFLOW=$(echo "$WORKFLOWS_RESPONSE" | python3 -c "import sys, json; print(json.dumps(json.load(sys.stdin)['data'][0]))")
    
    WORKFLOW_ID=$(echo "$FIRST_WORKFLOW" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])")
    WORKFLOW_NAME=$(echo "$FIRST_WORKFLOW" | python3 -c "import sys, json; print(json.load(sys.stdin)['name'])")
    WORKFLOW_TYPE=$(echo "$FIRST_WORKFLOW" | python3 -c "import sys, json; print(json.load(sys.stdin)['type'])")
    WORKFLOW_FLOWDATA=$(echo "$FIRST_WORKFLOW" | python3 -c "import sys, json; print(json.load(sys.stdin)['flowData'])")
    
    echo "Workflow selecionado: $WORKFLOW_NAME ($WORKFLOW_ID)"
    
    # Preparar dados para exportação
    FLOW_DATA_JSON=$(echo "$FIRST_WORKFLOW" | python3 -c "import sys, json; data=json.load(sys.stdin); print(json.dumps(data['flowData']))")
    
    EXPORT_DATA=$(cat <<EOF
{
  "name": "$WORKFLOW_NAME",
  "description": "Teste de exportação",
  "type": "$WORKFLOW_TYPE",
  "flowData": $FLOW_DATA_JSON,
  "deployed": false,
  "isPublic": false,
  "category": "test"
}
EOF
)
    
    echo "Dados de exportação preparados"
    
    # Fazer requisição de exportação
    echo "Enviando requisição de exportação..."
    echo "URL: http://localhost:3000/api/flowise-external-sync"
    echo "Action: export_workflow"
    echo "Canvas ID: $WORKFLOW_ID"
    echo "Workflow Data: $EXPORT_DATA"
    echo ""
    
    EXPORT_RESPONSE=$(curl -s -X POST "http://localhost:3000/api/flowise-external-sync" \
      -H "Content-Type: application/json" \
      -d "{
        \"action\": \"export_workflow\",
        \"canvasId\": \"$WORKFLOW_ID\",
        \"workflowData\": $EXPORT_DATA
      }")
    
    echo "Resposta da exportação:"
    echo "$EXPORT_RESPONSE" | python3 -m json.tool
    echo ""
    
    # Extrair success da resposta
    EXPORT_SUCCESS=$(echo "$EXPORT_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['success'])" 2>/dev/null || echo "false")
    
    if [ "$EXPORT_SUCCESS" = "True" ]; then
        echo "✅ Exportação bem sucedida!"
    else
        echo "❌ Falha na exportação"
    fi
else
    echo "⚠️ Nenhum workflow disponível para testar exportação"
fi

echo ""
echo "🏁 Teste concluído"