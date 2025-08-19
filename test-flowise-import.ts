/**
 * Script para testar a importação de templates do Flowise
 * Vamos usar os templates que você compartilhou para analisar a estrutura
 */

import { flowiseTemplateImporter } from './src/lib/flowise-template-importer';
import { promises as fs } from 'fs';
import path from 'path';

// Templates que você compartilhou
const CONVERSATIONAL_AGENT_TEMPLATE = {
  "nodes": [
    {
      "width": 300,
      "height": 149,
      "id": "calculator_1",
      "position": {
        "x": 800.5125025564965,
        "y": 72.40592063242738
      },
      "type": "customNode",
      "data": {
        "id": "calculator_1",
        "label": "Calculator",
        "version": 1,
        "name": "calculator",
        "type": "Calculator",
        "baseClasses": [
          "Calculator",
          "Tool",
          "StructuredTool",
          "BaseLangChain"
        ],
        "category": "Tools",
        "description": "Perform calculations on response",
        "inputParams": [],
        "inputAnchors": [],
        "inputs": {},
        "outputAnchors": [
          {
            "id": "calculator_1-output-calculator-Calculator|Tool|StructuredTool|BaseLangChain",
            "name": "calculator",
            "label": "Calculator",
            "type": "Calculator | Tool | StructuredTool | BaseLangChain"
          }
        ],
        "outputs": {},
        "selected": false
      },
      "positionAbsolute": {
        "x": 800.5125025564965,
        "y": 72.40592063242738
      },
      "selected": false,
      "dragging": false
    },
    {
      "width": 300,
      "height": 258,
      "id": "bufferMemory_1",
      "position": {
        "x": 607.6260576768354,
        "y": 584.7920541862369
      },
      "type": "customNode",
      "data": {
        "id": "bufferMemory_1",
        "label": "Buffer Memory",
        "version": 2,
        "name": "bufferMemory",
        "type": "BufferMemory",
        "baseClasses": [
          "BufferMemory",
          "BaseChatMemory",
          "BaseMemory"
        ],
        "category": "Memory",
        "description": "Retrieve chat messages stored in database",
        "inputParams": [
          {
            "label": "Session Id",
            "name": "sessionId",
            "type": "string",
            "description": "If not specified, a random id will be used. Learn <a target=\"_blank\" href=\"https://docs.flowiseai.com/memory#ui-and-embedded-chat\">more</a>",
            "default": "",
            "additionalParams": true,
            "optional": true,
            "id": "bufferMemory_1-input-sessionId-string"
          },
          {
            "label": "Memory Key",
            "name": "memoryKey",
            "type": "string",
            "default": "chat_history",
            "additionalParams": true,
            "id": "bufferMemory_1-input-memoryKey-string"
          }
        ],
        "inputAnchors": [],
        "inputs": {
          "sessionId": "",
          "memoryKey": "chat_history"
        },
        "outputAnchors": [
          {
            "id": "bufferMemory_1-output-bufferMemory-BufferMemory|BaseChatMemory|BaseMemory",
            "name": "bufferMemory",
            "label": "BufferMemory",
            "type": "BufferMemory | BaseChatMemory | BaseMemory"
          }
        ],
        "outputs": {},
        "selected": false
      },
      "positionAbsolute": {
        "x": 607.6260576768354,
        "y": 584.7920541862369
      },
      "selected": false,
      "dragging": false
    },
    {
      "width": 300,
      "height": 281,
      "id": "serpAPI_0",
      "position": {
        "x": 451.83740798447855,
        "y": 53.2843022150486
      },
      "type": "customNode",
      "data": {
        "id": "serpAPI_0",
        "label": "Serp API",
        "version": 1,
        "name": "serpAPI",
        "type": "SerpAPI",
        "baseClasses": [
          "SerpAPI",
          "Tool",
          "StructuredTool"
        ],
        "category": "Tools",
        "description": "Wrapper around SerpAPI - a real-time API to access Google search results",
        "inputParams": [
          {
            "label": "Connect Credential",
            "name": "credential",
            "type": "credential",
            "credentialNames": [
              "serpApi"
            ],
            "id": "serpAPI_0-input-credential-credential"
          }
        ],
        "inputAnchors": [],
        "inputs": {},
        "outputAnchors": [
          {
            "id": "serpAPI_0-output-serpAPI-SerpAPI|Tool|StructuredTool",
            "name": "serpAPI",
            "label": "SerpAPI",
            "type": "SerpAPI | Tool | StructuredTool"
          }
        ],
        "outputs": {},
        "selected": false
      },
      "selected": false,
      "positionAbsolute": {
        "x": 451.83740798447855,
        "y": 53.2843022150486
      },
      "dragging": false
    },
    {
      "width": 300,
      "height": 675,
      "id": "chatOpenAI_0",
      "position": {
        "x": 97.01321406237057,
        "y": 63.67664262280914
      },
      "type": "customNode",
      "data": {
        "id": "chatOpenAI_0",
        "label": "ChatOpenAI",
        "version": 6,
        "name": "chatOpenAI",
        "type": "ChatOpenAI",
        "baseClasses": [
          "ChatOpenAI",
          "BaseChatModel",
          "BaseLanguageModel"
        ],
        "category": "Chat Models",
        "description": "Wrapper around OpenAI large language models that use the Chat endpoint",
        "inputParams": [
          {
            "label": "Connect Credential",
            "name": "credential",
            "type": "credential",
            "credentialNames": [
              "openAIApi"
            ],
            "id": "chatOpenAI_0-input-credential-credential"
          },
          {
            "label": "Model Name",
            "name": "modelName",
            "type": "asyncOptions",
            "loadMethod": "listModels",
            "default": "gpt-3.5-turbo",
            "id": "chatOpenAI_0-input-modelName-options"
          },
          {
            "label": "Temperature",
            "name": "temperature",
            "type": "number",
            "default": 0.9,
            "optional": true,
            "id": "chatOpenAI_0-input-temperature-number"
          },
          {
            "label": "Max Tokens",
            "name": "maxTokens",
            "type": "number",
            "optional": true,
            "additionalParams": true,
            "id": "chatOpenAI_0-input-maxTokens-number"
          },
          {
            "label": "Top Probability",
            "name": "topP",
            "type": "number",
            "optional": true,
            "additionalParams": true,
            "id": "chatOpenAI_0-input-topP-number"
          },
          {
            "label": "Frequency Penalty",
            "name": "frequencyPenalty",
            "type": "number",
            "optional": true,
            "additionalParams": true,
            "id": "chatOpenAI_0-input-frequencyPenalty-number"
          },
          {
            "label": "Presence Penalty",
            "name": "presencePenalty",
            "type": "number",
            "optional": true,
            "additionalParams": true,
            "id": "chatOpenAI_0-input-presencePenalty-number"
          },
          {
            "label": "Timeout",
            "name": "timeout",
            "type": "number",
            "optional": true,
            "additionalParams": true,
            "id": "chatOpenAI_0-input-timeout-number"
          },
          {
            "label": "BasePath",
            "name": "basepath",
            "type": "string",
            "optional": true,
            "additionalParams": true,
            "id": "chatOpenAI_0-input-basepath-string"
          },
          {
            "label": "BaseOptions",
            "name": "baseOptions",
            "type": "json",
            "optional": true,
            "additionalParams": true,
            "id": "chatOpenAI_0-input-baseOptions-json"
          },
          {
            "label": "Allow Image Uploads",
            "name": "allowImageUploads",
            "type": "boolean",
            "description": "Automatically uses gpt-4-vision-preview when image is being uploaded from chat. Only works with LLMChain, Conversation Chain, ReAct Agent, and Conversational Agent",
            "default": false,
            "optional": true,
            "id": "chatOpenAI_0-input-allowImageUploads-boolean"
          },
          {
            "label": "Image Resolution",
            "description": "This parameter controls the resolution in which the model views the image.",
            "name": "imageResolution",
            "type": "options",
            "options": [
              {
                "label": "Low",
                "name": "low"
              },
              {
                "label": "High",
                "name": "high"
              },
              {
                "label": "Auto",
                "name": "auto"
              }
            ],
            "default": "low",
            "optional": false,
            "additionalParams": true,
            "id": "chatOpenAI_0-input-imageResolution-options"
          }
        ],
        "inputAnchors": [
          {
            "label": "Cache",
            "name": "cache",
            "type": "BaseCache",
            "optional": true,
            "id": "chatOpenAI_0-input-cache-BaseCache"
          }
        ],
        "inputs": {
          "modelName": "gpt-3.5-turbo-16k",
          "temperature": 0.9,
          "maxTokens": "",
          "topP": "",
          "frequencyPenalty": "",
          "presencePenalty": "",
          "timeout": "",
          "basepath": "",
          "baseOptions": "",
          "allowImageUploads": true,
          "imageResolution": "low"
        },
        "outputAnchors": [
          {
            "id": "chatOpenAI_0-output-chatOpenAI-ChatOpenAI|BaseChatModel|BaseLanguageModel",
            "name": "chatOpenAI",
            "label": "ChatOpenAI",
            "type": "ChatOpenAI | BaseChatModel | BaseLanguageModel"
          }
        ],
        "outputs": {},
        "selected": false
      },
      "selected": false,
      "positionAbsolute": {
        "x": 97.01321406237057,
        "y": 63.67664262280914
      },
      "dragging": false
    },
    {
      "width": 300,
      "height": 440,
      "id": "conversationalAgent_0",
      "position": {
        "x": 1191.1524476753796,
        "y": 324.2479396683294
      },
      "type": "customNode",
      "data": {
        "id": "conversationalAgent_0",
        "label": "Conversational Agent",
        "version": 3,
        "name": "conversationalAgent",
        "type": "AgentExecutor",
        "baseClasses": [
          "AgentExecutor",
          "BaseChain",
          "Runnable"
        ],
        "category": "Agents",
        "description": "Conversational agent for a chat model. It will utilize chat specific prompts",
        "inputParams": [
          {
            "label": "System Message",
            "name": "systemMessage",
            "type": "string",
            "rows": 4,
            "default": "Assistant is a large language model trained by OpenAI.\n\nAssistant is designed to be able to assist with a wide range of tasks, from answering simple questions to providing in-depth explanations and discussions on a wide range of topics. As a language model, Assistant is able to generate human-like text based on the input it receives, allowing it to engage in natural-sounding conversations and provide responses that are coherent and relevant to the topic at hand.\n\nAssistant is constantly learning and improving, and its capabilities are constantly evolving. It is able to process and understand large amounts of text, and can use this knowledge to provide accurate and informative responses to a wide range of questions. Additionally, Assistant is able to generate its own text based on the input it receives, allowing it to engage in discussions and provide explanations and descriptions on a wide range of topics.\n\nOverall, Assistant is a powerful system that can help with a wide range of tasks and provide valuable insights and information on a wide range of topics. Whether you need help with a specific question or just want to have a conversation about a particular topic, Assistant is here to assist.",
            "optional": true,
            "additionalParams": true,
            "id": "conversationalAgent_0-input-systemMessage-string"
          },
          {
            "label": "Max Iterations",
            "name": "maxIterations",
            "type": "number",
            "optional": true,
            "additionalParams": true,
            "id": "conversationalAgent_0-input-maxIterations-number"
          }
        ],
        "inputAnchors": [
          {
            "label": "Allowed Tools",
            "name": "tools",
            "type": "Tool",
            "list": true,
            "id": "conversationalAgent_0-input-tools-Tool"
          },
          {
            "label": "Chat Model",
            "name": "model",
            "type": "BaseChatModel",
            "id": "conversationalAgent_0-input-model-BaseChatModel"
          },
          {
            "label": "Memory",
            "name": "memory",
            "type": "BaseChatMemory",
            "id": "conversationalAgent_0-input-memory-BaseChatMemory"
          },
          {
            "label": "Input Moderation",
            "description": "Detect text that could generate harmful output and prevent it from being sent to the language model",
            "name": "inputModeration",
            "type": "Moderation",
            "optional": true,
            "list": true,
            "id": "conversationalAgent_0-input-inputModeration-Moderation"
          }
        ],
        "inputs": {
          "inputModeration": "",
          "tools": [
            "{{calculator_1.data.instance}}",
            "{{serpAPI_0.data.instance}}"
          ],
          "model": "{{chatOpenAI_0.data.instance}}",
          "memory": "{{bufferMemory_1.data.instance}}",
          "systemMessage": "Assistant is a large language model trained by OpenAI.\n\nAssistant is designed to be able to assist with a wide range of tasks, from answering simple questions to providing in-depth explanations and discussions on a wide range of topics. As a language model, Assistant is able to generate human-like text based on the input it receives, allowing it to engage in natural-sounding conversations and provide responses that are coherent and relevant to the topic at hand.\n\nAssistant is constantly learning and improving, and its capabilities are constantly evolving. It is able to process and understand large amounts of text, and can use this knowledge to provide accurate and informative responses to a wide range of questions. Additionally, Assistant is able to generate its own text based on the input it receives, allowing it to engage in discussions and provide explanations and descriptions on a wide range of topics.\n\nOverall, Assistant is a powerful system that can help with a wide range of tasks and provide valuable insights and information on a wide range of topics. Whether you need help with a specific question or just want to have a conversation about a particular topic, Assistant is here to assist."
        },
        "outputAnchors": [
          {
            "id": "conversationalAgent_0-output-conversationalAgent-AgentExecutor|BaseChain|Runnable",
            "name": "conversationalAgent",
            "label": "AgentExecutor",
            "type": "AgentExecutor | BaseChain | Runnable"
          }
        ],
        "outputs": {},
        "selected": false
      },
      "selected": false,
      "positionAbsolute": {
        "x": 1191.1524476753796,
        "y": 324.2479396683294
      },
      "dragging": false
    },
    {
      "id": "stickyNote_0",
      "position": {
        "x": 1190.081066428271,
        "y": 21.014152635796393
      },
      "type": "stickyNote",
      "data": {
        "id": "stickyNote_0",
        "label": "Sticky Note",
        "version": 2,
        "name": "stickyNote",
        "type": "StickyNote",
        "baseClasses": [
          "StickyNote"
        ],
        "tags": [
          "Utilities"
        ],
        "category": "Utilities",
        "description": "Add a sticky note",
        "inputParams": [
          {
            "label": "",
            "name": "note",
            "type": "string",
            "rows": 1,
            "placeholder": "Type something here",
            "optional": true,
            "id": "stickyNote_0-input-note-string"
          }
        ],
        "inputAnchors": [],
        "inputs": {
          "note": "This agent works very similar to Tool Agent with slightly higher error rate.\n\nDifference being this agent uses prompt to instruct LLM using tools, as opposed to using LLM's function calling capability.\n\nFor LLMs that support function calling, it is recommended to use Tool Agent.\n\nExample question:\n1. What is the net worth of Elon Musk?\n2. Multiply the net worth by 2"
        },
        "outputAnchors": [
          {
            "id": "stickyNote_0-output-stickyNote-StickyNote",
            "name": "stickyNote",
            "label": "StickyNote",
            "description": "Add a sticky note",
            "type": "StickyNote"
          }
        ],
        "outputs": {},
        "selected": false
      },
      "width": 300,
      "height": 304,
      "selected": false,
      "positionAbsolute": {
        "x": 1190.081066428271,
        "y": 21.014152635796393
      },
      "dragging": false
    }
  ],
  "edges": [
    {
      "source": "calculator_1",
      "sourceHandle": "calculator_1-output-calculator-Calculator|Tool|StructuredTool|BaseLangChain",
      "target": "conversationalAgent_0",
      "targetHandle": "conversationalAgent_0-input-tools-Tool",
      "type": "buttonedge",
      "id": "calculator_1-calculator_1-output-calculator-Calculator|Tool|StructuredTool|BaseLangChain-conversationalAgent_0-conversationalAgent_0-input-tools-Tool",
      "data": {
        "label": ""
      }
    },
    {
      "source": "serpAPI_0",
      "sourceHandle": "serpAPI_0-output-serpAPI-SerpAPI|Tool|StructuredTool",
      "target": "conversationalAgent_0",
      "targetHandle": "conversationalAgent_0-input-tools-Tool",
      "type": "buttonedge",
      "id": "serpAPI_0-serpAPI_0-output-serpAPI-SerpAPI|Tool|StructuredTool-conversationalAgent_0-conversationalAgent_0-input-tools-Tool",
      "data": {
        "label": ""
      }
    },
    {
      "source": "chatOpenAI_0",
      "sourceHandle": "chatOpenAI_0-output-chatOpenAI-ChatOpenAI|BaseChatModel|BaseLanguageModel",
      "target": "conversationalAgent_0",
      "targetHandle": "conversationalAgent_0-input-model-BaseChatModel",
      "type": "buttonedge",
      "id": "chatOpenAI_0-chatOpenAI_0-output-chatOpenAI-ChatOpenAI|BaseChatModel|BaseLanguageModel-conversationalAgent_0-conversationalAgent_0-input-model-BaseChatModel",
      "data": {
        "label": ""
      }
    },
    {
      "source": "bufferMemory_1",
      "sourceHandle": "bufferMemory_1-output-bufferMemory-BufferMemory|BaseChatMemory|BaseMemory",
      "target": "conversationalAgent_0",
      "targetHandle": "conversationalAgent_0-input-memory-BaseChatMemory",
      "type": "buttonedge",
      "id": "bufferMemory_1-bufferMemory_1-output-bufferMemory-BufferMemory|BaseChatMemory|BaseMemory-conversationalAgent_0-conversationalAgent_0-input-memory-BaseChatMemory",
      "data": {
        "label": ""
      }
    }
  ]
};

const TOOL_AGENT_TEMPLATE = {
  "nodes": [
    {
      "width": 300,
      "height": 149,
      "id": "calculator_1",
      "position": {
        "x": 800.5125025564965,
        "y": 72.40592063242738
      },
      "type": "customNode",
      "data": {
        "id": "calculator_1",
        "label": "Calculator",
        "version": 1,
        "name": "calculator",
        "type": "Calculator",
        "baseClasses": [
          "Calculator",
          "Tool",
          "StructuredTool",
          "BaseLangChain"
        ],
        "category": "Tools",
        "description": "Perform calculations on response",
        "inputParams": [],
        "inputAnchors": [],
        "inputs": {},
        "outputAnchors": [
          {
            "id": "calculator_1-output-calculator-Calculator|Tool|StructuredTool|BaseLangChain",
            "name": "calculator",
            "label": "Calculator",
            "type": "Calculator | Tool | StructuredTool | BaseLangChain"
          }
        ],
        "outputs": {},
        "selected": false
      },
      "positionAbsolute": {
        "x": 800.5125025564965,
        "y": 72.40592063242738
      },
      "selected": false,
      "dragging": false
    },
    {
      "width": 300,
      "height": 258,
      "id": "bufferMemory_1",
      "position": {
        "x": 607.6260576768354,
        "y": 584.7920541862369
      },
      "type": "customNode",
      "data": {
        "id": "bufferMemory_1",
        "label": "Buffer Memory",
        "version": 2,
        "name": "bufferMemory",
        "type": "BufferMemory",
        "baseClasses": [
          "BufferMemory",
          "BaseChatMemory",
          "BaseMemory"
        ],
        "category": "Memory",
        "description": "Retrieve chat messages stored in database",
        "inputParams": [
          {
            "label": "Session Id",
            "name": "sessionId",
            "type": "string",
            "description": "If not specified, a random id will be used. Learn <a target=\"_blank\" href=\"https://docs.flowiseai.com/memory#ui-and-embedded-chat\">more</a>",
            "default": "",
            "additionalParams": true,
            "optional": true,
            "id": "bufferMemory_1-input-sessionId-string"
          },
          {
            "label": "Memory Key",
            "name": "memoryKey",
            "type": "string",
            "default": "chat_history",
            "additionalParams": true,
            "id": "bufferMemory_1-input-memoryKey-string"
          }
        ],
        "inputAnchors": [],
        "inputs": {
          "sessionId": "",
          "memoryKey": "chat_history"
        },
        "outputAnchors": [
          {
            "id": "bufferMemory_1-output-bufferMemory-BufferMemory|BaseChatMemory|BaseMemory",
            "name": "bufferMemory",
            "label": "BufferMemory",
            "type": "BufferMemory | BaseChatMemory | BaseMemory"
          }
        ],
        "outputs": {},
        "selected": false
      },
      "positionAbsolute": {
        "x": 607.6260576768354,
        "y": 584.7920541862369
      },
      "selected": false,
      "dragging": false
    },
    {
      "width": 300,
      "height": 281,
      "id": "serpAPI_0",
      "position": {
        "x": 439.29908455642476,
        "y": 48.06000078669291
      },
      "type": "customNode",
      "data": {
        "id": "serpAPI_0",
        "label": "Serp API",
        "version": 1,
        "name": "serpAPI",
        "type": "SerpAPI",
        "baseClasses": [
          "SerpAPI",
          "Tool",
          "StructuredTool"
        ],
        "category": "Tools",
        "description": "Wrapper around SerpAPI - a real-time API to access Google search results",
        "inputParams": [
          {
            "label": "Connect Credential",
            "name": "credential",
            "type": "credential",
            "credentialNames": [
              "serpApi"
            ],
            "id": "serpAPI_0-input-credential-credential"
          }
        ],
        "inputAnchors": [],
        "inputs": {},
        "outputAnchors": [
          {
            "id": "serpAPI_0-output-serpAPI-SerpAPI|Tool|StructuredTool",
            "name": "serpAPI",
            "label": "SerpAPI",
            "type": "SerpAPI | Tool | StructuredTool"
          }
        ],
        "outputs": {},
        "selected": false
      },
      "selected": false,
      "positionAbsolute": {
        "x": 439.29908455642476,
        "y": 48.06000078669291
      },
      "dragging": false
    },
    {
      "width": 300,
      "height": 771,
      "id": "chatOpenAI_0",
      "position": {
        "x": 97.01321406237057,
        "y": 63.67664262280914
      },
      "type": "customNode",
      "data": {
        "id": "chatOpenAI_0",
        "label": "ChatOpenAI",
        "version": 8.2,
        "name": "chatOpenAI",
        "type": "ChatOpenAI",
        "baseClasses": [
          "ChatOpenAI",
          "BaseChatModel",
          "BaseLanguageModel",
          "Runnable"
        ],
        "category": "Chat Models",
        "description": "Wrapper around OpenAI large language models that use the Chat endpoint",
        "inputParams": [
          {
            "label": "Connect Credential",
            "name": "credential",
            "type": "credential",
            "credentialNames": [
              "openAIApi"
            ],
            "id": "chatOpenAI_0-input-credential-credential",
            "display": true
          },
          {
            "label": "Model Name",
            "name": "modelName",
            "type": "asyncOptions",
            "loadMethod": "listModels",
            "default": "gpt-4o-mini",
            "id": "chatOpenAI_0-input-modelName-asyncOptions",
            "display": true
          },
          {
            "label": "Temperature",
            "name": "temperature",
            "type": "number",
            "step": 0.1,
            "default": 0.9,
            "optional": true,
            "id": "chatOpenAI_0-input-temperature-number",
            "display": true
          },
          {
            "label": "Streaming",
            "name": "streaming",
            "type": "boolean",
            "default": true,
            "optional": true,
            "additionalParams": true,
            "id": "chatOpenAI_0-input-streaming-boolean",
            "display": true
          },
          {
            "label": "Max Tokens",
            "name": "maxTokens",
            "type": "number",
            "step": 1,
            "optional": true,
            "additionalParams": true,
            "id": "chatOpenAI_0-input-maxTokens-number",
            "display": true
          },
          {
            "label": "Top Probability",
            "name": "topP",
            "type": "number",
            "step": 0.1,
            "optional": true,
            "additionalParams": true,
            "id": "chatOpenAI_0-input-topP-number",
            "display": true
          },
          {
            "label": "Frequency Penalty",
            "name": "frequencyPenalty",
            "type": "number",
            "step": 0.1,
            "optional": true,
            "additionalParams": true,
            "id": "chatOpenAI_0-input-frequencyPenalty-number",
            "display": true
          },
          {
            "label": "Presence Penalty",
            "name": "presencePenalty",
            "type": "number",
            "step": 0.1,
            "optional": true,
            "additionalParams": true,
            "id": "chatOpenAI_0-input-presencePenalty-number",
            "display": true
          },
          {
            "label": "Timeout",
            "name": "timeout",
            "type": "number",
            "step": 1,
            "optional": true,
            "additionalParams": true,
            "id": "chatOpenAI_0-input-timeout-number",
            "display": true
          },
          {
            "label": "Strict Tool Calling",
            "name": "strictToolCalling",
            "type": "boolean",
            "description": "Whether the model supports the `strict` argument when passing in tools. If not specified, the `strict` argument will not be passed to OpenAI.",
            "optional": true,
            "additionalParams": true,
            "id": "chatOpenAI_0-input-strictToolCalling-boolean",
            "display": true
          },
          {
            "label": "Stop Sequence",
            "name": "stopSequence",
            "type": "string",
            "rows": 4,
            "optional": true,
            "description": "List of stop words to use when generating. Use comma to separate multiple stop words.",
            "additionalParams": true,
            "id": "chatOpenAI_0-input-stopSequence-string",
            "display": true
          },
          {
            "label": "BasePath",
            "name": "basepath",
            "type": "string",
            "optional": true,
            "additionalParams": true,
            "id": "chatOpenAI_0-input-basepath-string",
            "display": true
          },
          {
            "label": "Proxy Url",
            "name": "proxyUrl",
            "type": "string",
            "optional": true,
            "additionalParams": true,
            "id": "chatOpenAI_0-input-proxyUrl-string",
            "display": true
          },
          {
            "label": "BaseOptions",
            "name": "baseOptions",
            "type": "json",
            "optional": true,
            "additionalParams": true,
            "id": "chatOpenAI_0-input-baseOptions-json",
            "display": true
          },
          {
            "label": "Allow Image Uploads",
            "name": "allowImageUploads",
            "type": "boolean",
            "description": "Allow image input. Refer to the <a href=\"https://docs.flowiseai.com/using-flowise/uploads#image\" target=\"_blank\">docs</a> for more details.",
            "default": false,
            "optional": true,
            "id": "chatOpenAI_0-input-allowImageUploads-boolean",
            "display": true
          },
          {
            "label": "Image Resolution",
            "description": "This parameter controls the resolution in which the model views the image.",
            "name": "imageResolution",
            "type": "options",
            "options": [
              {
                "label": "Low",
                "name": "low"
              },
              {
                "label": "High",
                "name": "high"
              },
              {
                "label": "Auto",
                "name": "auto"
              }
            ],
            "default": "low",
            "optional": false,
            "show": {
              "allowImageUploads": true
            },
            "id": "chatOpenAI_0-input-imageResolution-options",
            "display": true
          },
          {
            "label": "Reasoning Effort",
            "description": "Constrains effort on reasoning for reasoning models. Only applicable for o1 and o3 models.",
            "name": "reasoningEffort",
            "type": "options",
            "options": [
              {
                "label": "Low",
                "name": "low"
              },
              {
                "label": "medium",
                "name": "medium"
              },
              {
                "label": "High",
                "name": "high"
              }
            ],
            "default": "medium",
            "optional": false,
            "additionalParams": true,
            "id": "chatOpenAI_0-input-reasoningEffort-options",
            "display": true
          }
        ],
        "inputAnchors": [
          {
            "label": "Cache",
            "name": "cache",
            "type": "BaseCache",
            "optional": true,
            "id": "chatOpenAI_0-input-cache-BaseCache",
            "display": true
          }
        ],
        "inputs": {
          "cache": "",
          "modelName": "gpt-4o-mini",
          "temperature": 0.9,
          "streaming": true,
          "maxTokens": "",
          "topP": "",
          "frequencyPenalty": "",
          "presencePenalty": "",
          "timeout": "",
          "strictToolCalling": "",
          "stopSequence": "",
          "basepath": "",
          "proxyUrl": "",
          "baseOptions": "",
          "allowImageUploads": true,
          "imageResolution": "low",
          "reasoningEffort": "medium"
        },
        "outputAnchors": [
          {
            "id": "chatOpenAI_0-output-chatOpenAI-ChatOpenAI|BaseChatModel|BaseLanguageModel|Runnable",
            "name": "chatOpenAI",
            "label": "ChatOpenAI",
            "description": "Wrapper around OpenAI large language models that use the Chat endpoint",
            "type": "ChatOpenAI | BaseChatModel | BaseLanguageModel | Runnable"
          }
        ],
        "outputs": {},
        "selected": false
      },
      "selected": false,
      "positionAbsolute": {
        "x": 97.01321406237057,
        "y": 63.67664262280914
      },
      "dragging": false
    },
    {
      "id": "stickyNote_0",
      "position": {
        "x": 1197.3578961103253,
        "y": 117.43214592301385
      },
      "type": "stickyNote",
      "data": {
        "id": "stickyNote_0",
        "label": "Sticky Note",
        "version": 2,
        "name": "stickyNote",
        "type": "StickyNote",
        "baseClasses": [
          "StickyNote"
        ],
        "tags": [
          "Utilities"
        ],
        "category": "Utilities",
        "description": "Add a sticky note",
        "inputParams": [
          {
            "label": "",
            "name": "note",
            "type": "string",
            "rows": 1,
            "placeholder": "Type something here",
            "optional": true,
            "id": "stickyNote_0-input-note-string"
          }
        ],
        "inputAnchors": [],
        "inputs": {
          "note": "LLM has to be function calling compatible"
        },
        "outputAnchors": [
          {
            "id": "stickyNote_0-output-stickyNote-StickyNote",
            "name": "stickyNote",
            "label": "StickyNote",
            "description": "Add a sticky note",
            "type": "StickyNote"
          }
        ],
        "outputs": {},
        "selected": false
      },
      "width": 300,
      "height": 62,
      "selected": false,
      "positionAbsolute": {
        "x": 1197.3578961103253,
        "y": 117.43214592301385
      },
      "dragging": false
    },
    {
      "id": "toolAgent_0",
      "position": {
        "x": 1200.6756893536506,
        "y": 208.18578883272318
      },
      "type": "customNode",
      "data": {
        "id": "toolAgent_0",
        "label": "Tool Agent",
        "version": 2,
        "name": "toolAgent",
        "type": "AgentExecutor",
        "baseClasses": [
          "AgentExecutor",
          "BaseChain",
          "Runnable"
        ],
        "category": "Agents",
        "description": "Agent that uses Function Calling to pick the tools and args to call",
        "inputParams": [
          {
            "label": "System Message",
            "name": "systemMessage",
            "type": "string",
            "default": "You are a helpful AI assistant.",
            "description": "If Chat Prompt Template is provided, this will be ignored",
            "rows": 4,
            "optional": true,
            "additionalParams": true,
            "id": "toolAgent_0-input-systemMessage-string",
            "display": true
          },
          {
            "label": "Max Iterations",
            "name": "maxIterations",
            "type": "number",
            "optional": true,
            "additionalParams": true,
            "id": "toolAgent_0-input-maxIterations-number",
            "display": true
          },
          {
            "label": "Enable Detailed Streaming",
            "name": "enableDetailedStreaming",
            "type": "boolean",
            "default": false,
            "description": "Stream detailed intermediate steps during agent execution",
            "optional": true,
            "additionalParams": true,
            "id": "toolAgent_0-input-enableDetailedStreaming-boolean",
            "display": true
          }
        ],
        "inputAnchors": [
          {
            "label": "Tools",
            "name": "tools",
            "type": "Tool",
            "list": true,
            "id": "toolAgent_0-input-tools-Tool",
            "display": true
          },
          {
            "label": "Memory",
            "name": "memory",
            "type": "BaseChatMemory",
            "id": "toolAgent_0-input-memory-BaseChatMemory",
            "display": true
          },
          {
            "label": "Tool Calling Chat Model",
            "name": "model",
            "type": "BaseChatModel",
            "description": "Only compatible with models that are capable of function calling: ChatOpenAI, ChatMistral, ChatAnthropic, ChatGoogleGenerativeAI, ChatVertexAI, GroqChat",
            "id": "toolAgent_0-input-model-BaseChatModel",
            "display": true
          },
          {
            "label": "Chat Prompt Template",
            "name": "chatPromptTemplate",
            "type": "ChatPromptTemplate",
            "description": "Override existing prompt with Chat Prompt Template. Human Message must includes {input} variable",
            "optional": true,
            "id": "toolAgent_0-input-chatPromptTemplate-ChatPromptTemplate",
            "display": true
          },
          {
            "label": "Input Moderation",
            "description": "Count text that could generate harmful output and prevent it from being sent to the language model",
            "name": "inputModeration",
            "type": "Moderation",
            "optional": true,
            "list": true,
            "id": "toolAgent_0-input-inputModeration-Moderation",
            "display": true
          }
        ],
        "inputs": {
          "tools": [
            "{{calculator_1.data.instance}}",
            "{{serpAPI_0.data.instance}}"
          ],
          "memory": "{{bufferMemory_1.data.instance}}",
          "model": "{{chatOpenAI_0.data.instance}}",
          "chatPromptTemplate": "",
          "systemMessage": "You are a helpful AI assistant.",
          "inputModeration": "",
          "maxIterations": "",
          "enableDetailedStreaming": ""
        },
        "outputAnchors": [
          {
            "id": "toolAgent_0-output-toolAgent-AgentExecutor|BaseChain|Runnable",
            "name": "toolAgent",
            "label": "AgentExecutor",
            "description": "Agent that uses Function Calling to pick the tools and args to call",
            "type": "AgentExecutor | BaseChain | Runnable"
          }
        ],
        "outputs": {},
        "selected": false
      },
      "width": 300,
      "height": 491,
      "selected": false,
      "positionAbsolute": {
        "x": 1200.6756893536506,
        "y": 208.18578883272318
      },
      "dragging": false
    }
  ],
  "edges": [
    {
      "source": "calculator_1",
      "sourceHandle": "calculator_1-output-calculator-Calculator|Tool|StructuredTool|BaseLangChain",
      "target": "toolAgent_0",
      "targetHandle": "toolAgent_0-input-tools-Tool",
      "type": "buttonedge",
      "id": "calculator_1-calculator_1-output-calculator-Calculator|Tool|StructuredTool|BaseLangChain-toolAgent_0-toolAgent_0-input-tools-Tool"
    },
    {
      "source": "serpAPI_0",
      "sourceHandle": "serpAPI_0-output-serpAPI-SerpAPI|Tool|StructuredTool",
      "target": "toolAgent_0",
      "targetHandle": "toolAgent_0-input-tools-Tool",
      "type": "buttonedge",
      "id": "serpAPI_0-serpAPI_0-output-serpAPI-SerpAPI|Tool|StructuredTool-toolAgent_0-toolAgent_0-input-tools-Tool"
    },
    {
      "source": "chatOpenAI_0",
      "sourceHandle": "chatOpenAI_0-output-chatOpenAI-ChatOpenAI|BaseChatModel|BaseLanguageModel|Runnable",
      "target": "toolAgent_0",
      "targetHandle": "toolAgent_0-input-model-BaseChatModel",
      "type": "buttonedge",
      "id": "chatOpenAI_0-chatOpenAI_0-output-chatOpenAI-ChatOpenAI|BaseChatModel|BaseLanguageModel|Runnable-toolAgent_0-toolAgent_0-input-model-BaseChatModel"
    },
    {
      "source": "bufferMemory_1",
      "sourceHandle": "bufferMemory_1-output-bufferMemory-BufferMemory|BaseChatMemory|BaseMemory",
      "target": "toolAgent_0",
      "targetHandle": "toolAgent_0-input-memory-BaseChatMemory",
      "type": "buttonedge",
      "id": "bufferMemory_1-bufferMemory_1-output-bufferMemory-BufferMemory|BaseChatMemory|BaseMemory-toolAgent_0-toolAgent_0-input-memory-BaseChatMemory"
    }
  ]
};

/**
 * Função principal para testar a importação
 */
async function testImportation() {
  console.log('🚀 Iniciando teste de importação de templates do Flowise...\n');
  
  try {
    // Testar importação do Conversational Agent
    console.log('='.repeat(60));
    console.log('📋 TESTE 1: Conversational Agent Template');
    console.log('='.repeat(60));
    
    const conversationalResult = flowiseTemplateImporter.importFromObject(CONVERSATIONAL_AGENT_TEMPLATE);
    
    console.log('\n📊 ANÁLISE DO CONVERSATIONAL AGENT:');
    console.log(JSON.stringify(conversationalResult.analysis, null, 2));
    
    console.log('\n🎯 MAPEAMENTO PARA ZANAI:');
    console.log(JSON.stringify(conversationalResult.zanaiMapping, null, 2));
    
    console.log('\n' + '='.repeat(60));
    console.log('📋 TESTE 2: Tool Agent Template');
    console.log('='.repeat(60));
    
    // Testar importação do Tool Agent
    const toolResult = flowiseTemplateImporter.importFromObject(TOOL_AGENT_TEMPLATE);
    
    console.log('\n📊 ANÁLISE DO TOOL AGENT:');
    console.log(JSON.stringify(toolResult.analysis, null, 2));
    
    console.log('\n🎯 MAPEAMENTO PARA ZANAI:');
    console.log(JSON.stringify(toolResult.zanaiMapping, null, 2));
    
    console.log('\n' + '='.repeat(60));
    console.log('📋 COMPARAÇÃO ENTRE OS TEMPLATES');
    console.log('='.repeat(60));
    
    console.log('\n🔄 COMPARAÇÃO DE ESTRUTURA:');
    console.log(`Conversational Agent - Nós: ${conversationalResult.analysis.totalNodes}, Arestas: ${conversationalResult.analysis.totalEdges}`);
    console.log(`Tool Agent - Nós: ${toolResult.analysis.totalNodes}, Arestas: ${toolResult.analysis.totalEdges}`);
    
    console.log('\n🔄 COMPARAÇÃO DE TIPOS:');
    console.log(`Conversational Agent - Tipo: ${conversationalResult.type}, Complexidade: ${conversationalResult.analysis.complexity}`);
    console.log(`Tool Agent - Tipo: ${toolResult.type}, Complexidade: ${toolResult.analysis.complexity}`);
    
    console.log('\n🔄 COMPARAÇÃO DE MAPEAMENTO:');
    console.log(`Conversational Agent - Agente Sugerido: ${conversationalResult.zanaiMapping.suggestedAgentType}`);
    console.log(`Tool Agent - Agente Sugerido: ${toolResult.zanaiMapping.suggestedAgentType}`);
    
    console.log('\n✅ Teste concluído com sucesso!');
    
    // Salvar resultados em arquivos para análise posterior
    await saveResults(conversationalResult, toolResult);
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

/**
 * Salva os resultados em arquivos para análise
 */
async function saveResults(conversationalResult: any, toolResult: any) {
  const outputDir = path.join(process.cwd(), 'import-analysis');
  
  try {
    await fs.mkdir(outputDir, { recursive: true });
    
    // Salvar análise completa
    await fs.writeFile(
      path.join(outputDir, 'conversational-agent-analysis.json'),
      JSON.stringify(conversationalResult, null, 2)
    );
    
    await fs.writeFile(
      path.join(outputDir, 'tool-agent-analysis.json'),
      JSON.stringify(toolResult, null, 2)
    );
    
    // Salvar análise resumida
    const summary = {
      conversational: {
        name: conversationalResult.name,
        type: conversationalResult.type,
        complexity: conversationalResult.analysis.complexity,
        nodes: conversationalResult.analysis.totalNodes,
        edges: conversationalResult.analysis.totalEdges,
        suggestedAgentType: conversationalResult.zanaiMapping.suggestedAgentType,
        patterns: conversationalResult.analysis.patterns
      },
      tool: {
        name: toolResult.name,
        type: toolResult.type,
        complexity: toolResult.analysis.complexity,
        nodes: toolResult.analysis.totalNodes,
        edges: toolResult.analysis.totalEdges,
        suggestedAgentType: toolResult.zanaiMapping.suggestedAgentType,
        patterns: toolResult.analysis.patterns
      },
      keyInsights: {
        conversationalVsTool: {
          difference: 'Tool Agent é mais moderno e eficiente',
          recommendation: 'Tool Agent é preferido para novos projetos',
          reason: 'Usa Function Calling nativo em vez de prompts'
        },
        structure: {
          commonComponents: ['ChatOpenAI', 'Buffer Memory', 'Tools'],
          keyDifference: 'Tool Agent vs Conversational Agent',
          complexity: 'Ambos são complexos, mas Tool Agent é mais otimizado'
        },
        zanaiMapping: {
          conversational: 'custom agent com capacidades complexas',
          tool: 'custom agent com ferramentas modernas'
        }
      }
    };
    
    await fs.writeFile(
      path.join(outputDir, 'import-summary.json'),
      JSON.stringify(summary, null, 2)
    );
    
    console.log('\n💾 Resultados salvos em:', outputDir);
    
  } catch (error) {
    console.error('❌ Erro ao salvar resultados:', error);
  }
}

// Executar o teste
testImportation().catch(console.error);