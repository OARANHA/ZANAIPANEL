# Flowise API Documentation

Based on the official Flowise API reference documentation, this is a comprehensive guide to all available API endpoints.

## Table of Contents
1. [Authentication](#authentication)
2. [Base URL](#base-url)
3. [Chatflows API](#chatflows-api)
4. [Assistants API](#assistants-api)
5. [Tools API](#tools-api)
6. [Variables API](#variables-api)
7. [Document Store API](#document-store-api)
8. [Attachments API](#attachments-api)
9. [Chat Message API](#chat-message-api)
10. [Upsert History API](#upsert-history-api)
11. [Vector Upsert API](#vector-upsert-api)
12. [Error Handling](#error-handling)
13. [Rate Limiting](#rate-limiting)

---

## Authentication

Flowise API uses Bearer token authentication. Include the API key in the Authorization header:

```http
Authorization: Bearer YOUR_API_KEY
```

---

## Base URL

```
https://your-flowise-instance.com
```

---

## Chatflows API

### List all chatflows
```http
GET /api/v1/chatflows
```

**Response:**
```json
{
  "chatflows": [
    {
      "id": "chatflow-id",
      "name": "Chatflow Name",
      "description": "Description",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get chatflow by ID
```http
GET /api/v1/chatflows/{chatflowId}
```

**Response:**
```json
{
  "id": "chatflow-id",
  "name": "Chatflow Name",
  "description": "Description",
  "nodes": [...],
  "edges": [...],
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Get chatflow by API key
```http
GET /api/v1/chatflows/api/{apiKey}
```

**Response:**
```json
{
  "id": "chatflow-id",
  "name": "Chatflow Name",
  "description": "Description",
  "nodes": [...],
  "edges": [...]
}
```

### Create a new chatflow
```http
POST /api/v1/chatflows
```

**Request Body:**
```json
{
  "name": "New Chatflow",
  "description": "Description",
  "nodes": [...],
  "edges": [...]
}
```

**Response:**
```json
{
  "id": "new-chatflow-id",
  "name": "New Chatflow",
  "description": "Description",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

### Update chatflow details
```http
PUT /api/v1/chatflows/{chatflowId}
```

**Request Body:**
```json
{
  "name": "Updated Chatflow",
  "description": "Updated Description",
  "nodes": [...],
  "edges": [...]
}
```

**Response:**
```json
{
  "id": "chatflow-id",
  "name": "Updated Chatflow",
  "description": "Updated Description",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Delete a chatflow
```http
DELETE /api/v1/chatflows/{chatflowId}
```

**Response:**
```json
{
  "message": "Chatflow deleted successfully"
}
```

---

## Assistants API

### Create a new assistant
```http
POST /api/v1/assistants
```

**Request Body:**
```json
{
  "name": "Assistant Name",
  "description": "Assistant Description",
  "model": "gpt-3.5-turbo",
  "instructions": "You are a helpful assistant",
  "tools": [...]
}
```

**Response:**
```json
{
  "id": "assistant-id",
  "name": "Assistant Name",
  "description": "Assistant Description",
  "model": "gpt-3.5-turbo",
  "instructions": "You are a helpful assistant",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

### Get assistant by ID
```http
GET /api/v1/assistants/{assistantId}
```

**Response:**
```json
{
  "id": "assistant-id",
  "name": "Assistant Name",
  "description": "Assistant Description",
  "model": "gpt-3.5-turbo",
  "instructions": "You are a helpful assistant",
  "tools": [...],
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Update assistant details
```http
PUT /api/v1/assistants/{assistantId}
```

**Request Body:**
```json
{
  "name": "Updated Assistant",
  "description": "Updated Description",
  "instructions": "You are an updated assistant"
}
```

**Response:**
```json
{
  "id": "assistant-id",
  "name": "Updated Assistant",
  "description": "Updated Description",
  "instructions": "You are an updated assistant",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Delete an assistant
```http
DELETE /api/v1/assistants/{assistantId}
```

**Response:**
```json
{
  "message": "Assistant deleted successfully"
}
```

---

## Tools API

### Create a new tool
```http
POST /api/v1/tools
```

**Request Body:**
```json
{
  "name": "Tool Name",
  "description": "Tool Description",
  "type": "function",
  "parameters": {...}
}
```

**Response:**
```json
{
  "id": "tool-id",
  "name": "Tool Name",
  "description": "Tool Description",
  "type": "function",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

### List all tools
```http
GET /api/v1/tools
```

**Response:**
```json
{
  "tools": [
    {
      "id": "tool-id",
      "name": "Tool Name",
      "description": "Tool Description",
      "type": "function",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get a tool by ID
```http
GET /api/v1/tools/{toolId}
```

**Response:**
```json
{
  "id": "tool-id",
  "name": "Tool Name",
  "description": "Tool Description",
  "type": "function",
  "parameters": {...},
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

### Update a tool by ID
```http
PUT /api/v1/tools/{toolId}
```

**Request Body:**
```json
{
  "name": "Updated Tool",
  "description": "Updated Description"
}
```

**Response:**
```json
{
  "id": "tool-id",
  "name": "Updated Tool",
  "description": "Updated Description",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Delete a tool by ID
```http
DELETE /api/v1/tools/{toolId}
```

**Response:**
```json
{
  "message": "Tool deleted successfully"
}
```

---

## Variables API

### Create a new variable
```http
POST /api/v1/variables
```

**Request Body:**
```json
{
  "name": "variable_name",
  "value": "variable_value",
  "description": "Variable description"
}
```

**Response:**
```json
{
  "id": "variable-id",
  "name": "variable_name",
  "value": "variable_value",
  "description": "Variable description",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

### List all variables
```http
GET /api/v1/variables
```

**Response:**
```json
{
  "variables": [
    {
      "id": "variable-id",
      "name": "variable_name",
      "value": "variable_value",
      "description": "Variable description",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

### Update a variable by ID
```http
PUT /api/v1/variables/{variableId}
```

**Request Body:**
```json
{
  "name": "updated_variable_name",
  "value": "updated_value"
}
```

**Response:**
```json
{
  "id": "variable-id",
  "name": "updated_variable_name",
  "value": "updated_value",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Delete a variable by ID
```http
DELETE /api/v1/variables/{variableId}
```

**Response:**
```json
{
  "message": "Variable deleted successfully"
}
```

---

## Document Store API

### List all document stores
```http
GET /api/v1/document-stores
```

**Response:**
```json
{
  "documentStores": [
    {
      "id": "store-id",
      "name": "Document Store Name",
      "type": "vector",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get a specific document store
```http
GET /api/v1/document-stores/{storeId}
```

**Response:**
```json
{
  "id": "store-id",
  "name": "Document Store Name",
  "type": "vector",
  "documents": [...],
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

### Get chunks from a specific document loader
```http
GET /api/v1/document-stores/{storeId}/documents/{documentId}/chunks
```

**Response:**
```json
{
  "chunks": [
    {
      "id": "chunk-id",
      "content": "Chunk content",
      "metadata": {...},
      "embedding": [...]
    }
  ]
}
```

### Create a new document store
```http
POST /api/v1/document-stores
```

**Request Body:**
```json
{
  "name": "New Document Store",
  "type": "vector"
}
```

**Response:**
```json
{
  "id": "new-store-id",
  "name": "New Document Store",
  "type": "vector",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

### Update a specific document store
```http
PUT /api/v1/document-stores/{storeId}
```

**Request Body:**
```json
{
  "name": "Updated Document Store"
}
```

**Response:**
```json
{
  "id": "store-id",
  "name": "Updated Document Store",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Delete a specific document store
```http
DELETE /api/v1/document-stores/{storeId}
```

**Response:**
```json
{
  "message": "Document store deleted successfully"
}
```

### Upsert document to document store
```http
POST /api/v1/document-stores/{storeId}/documents
```

**Request Body:**
```json
{
  "content": "Document content",
  "metadata": {...}
}
```

**Response:**
```json
{
  "documentId": "new-document-id",
  "chunks": 10,
  "message": "Document upserted successfully"
}
```

### Update a specific chunk
```http
PUT /api/v1/document-stores/{storeId}/chunks/{chunkId}
```

**Request Body:**
```json
{
  "content": "Updated chunk content",
  "metadata": {...}
}
```

**Response:**
```json
{
  "id": "chunk-id",
  "content": "Updated chunk content",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Delete a specific chunk from a document loader
```http
DELETE /api/v1/document-stores/{storeId}/chunks/{chunkId}
```

**Response:**
```json
{
  "message": "Chunk deleted successfully"
}
```

### Delete specific document loader and associated chunks from document store
```http
DELETE /api/v1/document-stores/{storeId}/documents/{documentId}
```

**Response:**
```json
{
  "message": "Document and associated chunks deleted successfully"
}
```

### Re-process and upsert all documents in document store
```http
POST /api/v1/document-stores/{storeId}/reprocess
```

**Response:**
```json
{
  "message": "Document store reprocessing started",
  "status": "processing"
}
```

### Retrieval query
```http
POST /api/v1/document-stores/{storeId}/query
```

**Request Body:**
```json
{
  "query": "Search query",
  "topK": 5,
  "filter": {...}
}
```

**Response:**
```json
{
  "results": [
    {
      "chunkId": "chunk-id",
      "content": "Relevant content",
      "score": 0.95,
      "metadata": {...}
    }
  ]
}
```

### Delete data from vector store
```http
DELETE /api/v1/document-stores/{storeId}/vector-data
```

**Response:**
```json
{
  "message": "Vector data deleted successfully"
}
```

---

## Attachments API

### Create attachments array
```http
POST /api/v1/attachments
```

**Request Body:**
```json
{
  "attachments": [
    {
      "name": "file.pdf",
      "type": "application/pdf",
      "content": "base64-encoded-content"
    }
  ]
}
```

**Response:**
```json
{
  "attachments": [
    {
      "id": "attachment-id",
      "name": "file.pdf",
      "type": "application/pdf",
      "size": 1024,
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## Chat Message API

### List all chat messages
```http
GET /api/v1/chat-messages
```

**Optional Query Parameters:**
- `chatflowId`: Filter by chatflow ID
- `sessionId`: Filter by session ID
- `limit`: Number of messages to return
- `offset`: Offset for pagination

**Response:**
```json
{
  "messages": [
    {
      "id": "message-id",
      "chatflowId": "chatflow-id",
      "sessionId": "session-id",
      "role": "user",
      "content": "Message content",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "total": 100,
  "limit": 20,
  "offset": 0
}
```

### Delete all chat messages
```http
DELETE /api/v1/chat-messages
```

**Optional Query Parameters:**
- `chatflowId`: Filter by chatflow ID
- `sessionId`: Filter by session ID

**Response:**
```json
{
  "message": "Chat messages deleted successfully",
  "deletedCount": 50
}
```

---

## Upsert History API

### Get all upsert history records
```http
GET /api/v1/upsert-history
```

**Optional Query Parameters:**
- `documentStoreId`: Filter by document store ID
- `limit`: Number of records to return
- `offset`: Offset for pagination

**Response:**
```json
{
  "records": [
    {
      "id": "record-id",
      "documentStoreId": "store-id",
      "documentId": "document-id",
      "action": "upsert",
      "status": "completed",
      "timestamp": "2023-01-01T00:00:00.000Z"
    }
  ],
  "total": 50,
  "limit": 20,
  "offset": 0
}
```

### Delete upsert history records
```http
DELETE /api/v1/upsert-history
```

**Optional Query Parameters:**
- `documentStoreId`: Filter by document store ID
- `beforeDate`: Delete records before this date

**Response:**
```json
{
  "message": "Upsert history records deleted successfully",
  "deletedCount": 25
}
```

---

## Vector Upsert API

### Upsert vector embeddings
```http
POST /api/v1/vector-upsert
```

**Request Body:**
```json
{
  "vectors": [
    {
      "id": "vector-id",
      "values": [0.1, 0.2, 0.3, ...],
      "metadata": {...}
    }
  ],
  "namespace": "default"
}
```

**Response:**
```json
{
  "message": "Vectors upserted successfully",
  "upsertedCount": 100
}
```

---

## Error Handling

The Flowise API uses standard HTTP status codes to indicate the success or failure of requests:

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication failed
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation error
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

**Error Response Format:**
```json
{
  "error": "Error message",
  "details": "Additional error details",
  "code": "ERROR_CODE"
}
```

---

## Rate Limiting

The Flowise API implements rate limiting to prevent abuse:

- **Default limit**: 100 requests per minute
- **Burst limit**: 200 requests per minute
- **Reset window**: 1 minute

When rate limits are exceeded, the API responds with a `429 Too Many Requests` status code:

```json
{
  "error": "Rate limit exceeded",
  "details": "Too many requests. Please try again later.",
  "retryAfter": 60
}
```

---

## Common Use Cases

### 1. Creating a Chatbot Flow
```javascript
// Create a new chatflow
const chatflow = await fetch('/api/v1/chatflows', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Customer Support Bot',
    description: 'AI-powered customer support',
    nodes: [...],
    edges: [...]
  })
});
```

### 2. Managing Documents
```javascript
// Upload a document to vector store
const upload = await fetch('/api/v1/document-stores/{storeId}/documents', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: documentContent,
    metadata: {
      source: 'user_manual.pdf',
      category: 'documentation'
    }
  })
});
```

### 3. Querying Documents
```javascript
// Search for relevant documents
const search = await fetch('/api/v1/document-stores/{storeId}/query', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: 'How to reset password?',
    topK: 5
  })
});
```

### 4. Managing Assistants
```javascript
// Create a new assistant
const assistant = await fetch('/api/v1/assistants', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Technical Support',
    description: 'Assistant for technical support queries',
    model: 'gpt-4',
    instructions: 'You are a helpful technical support assistant...'
  })
});
```

This comprehensive documentation covers all major Flowise API endpoints based on the official reference documentation. Each endpoint includes the HTTP method, URL, request/response formats, and example usage.