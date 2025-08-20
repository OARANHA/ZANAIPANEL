# Flowise 数据处理架构与集成方案

## 核心架构分析

Flowise 拥有两个主要的数据管理系统：

### 1. Dataset 系统
- **用途**：存储结构化数据用于训练和微调
- **结构**：Dataset（主表）+ DatasetRow（输入输出对）
- **数据格式**：input（问题/命令）+ output（预期答案）
- **API 端点**：`/api/v1/dataset/*`

### 2. DocumentStore 系统
- **用途**：存储文档用于 RAG（检索增强生成）
- **结构**：DocumentStore（主表）+ DocumentStoreFileChunk（文档分块）
- **支持格式**：PDF、DOCX、TXT、CSV、JSON
- **处理流程**：上传 → 分块 → 嵌入 → 向量存储
- **API 端点**：`/api/v1/documentstore/*`

## 数据输入流程

### Dataset 输入：
1. **CSV 上传** - 支持批量导入
2. **REST API** - 单条记录添加
3. **格式要求**：第一列为输入，第二列为输出

### DocumentStore 输入：
1. **多格式文件上传**
2. **自动分块处理**
3. **嵌入和向量存储配置**
4. **预览和处理分离**

## 智能代理集成方案

### 三层代理架构：

#### 1. 数据收集代理 (Data Collector Agent)
- 从多个源收集数据（API、数据库、文件）
- 格式验证和元数据提取
- 发送到处理层

#### 2. 数据处理代理 (Data Processing Agent)
- 清洗和标准化数据
- 应用业务规则转换
- 生成嵌入向量（如需要）
- 格式化为 Flowise 兼容格式

#### 3. Flowise 集成代理 (Flowise Integration Agent)
- 与 Flowise API 通信
- 管理认证和授权
- 监控处理状态
- 错误处理和重试机制

## 客户端价值

### 简化操作：
- 统一接口处理多种数据格式
- 自动化复杂处理流程
- 实时监控和状态反馈
- 质量保证和错误恢复

### 技术优势：
- 解耦架构，各代理独立运行
- 高弹性和容错能力
- 可扩展性，易于添加新数据源
- 完整的处理可见性

## 实施路径

1. **客户端提供数据** → 2. **收集代理接收** → 3. **处理代理清洗** → 4. **集成代理发送至 Flowise** → 5. **状态反馈和报告**

该方案使智能代理组合成为 Flowise 的智能编排层，既简化了客户端的数据输入复杂性，又保留了 Flowise 的全部 AI 处理能力。

## 数据库状态与连接问题解决

### 当前数据库配置
- **数据库类型**: SQLite
- **数据库文件**: `./db/custom.db`
- **ORM**: Prisma Client v6.14.0
- **环境变量**: `DATABASE_URL="file:./db/custom.db"`

### 数据库表结构
项目包含完整的数据库表结构，主要表包括：

#### 核心业务表
- **users** - 用户管理
- **Workspace** - 工作空间管理
- **Agent** - 智能代理
- **Composition** - 代理组合
- **Client** - 客户管理
- **Company** - 公司管理

#### Flowise 集成表
- **flowise_workflows** - Flowise 工作流
- **flowise_executions** - Flowise 执行记录
- **sync_logs** - 同步日志

#### 系统支持表
- **audit_logs** - 审计日志
- **projects** - 项目管理
- **tasks** - 任务管理
- **reports** - 报告系统

### 连接问题诊断与解决

#### 问题现象
API 路由中出现数据库连接错误：
```
TypeError: Cannot read properties of undefined (reading 'findMany')
```

#### 解决过程
1. **验证数据库文件存在** ✅
   - 确认 `db/custom.db` 文件存在
   - 数据库包含 22 个表

2. **验证 Prisma 配置** ✅
   - Prisma Client 正确安装 (v6.14.0)
   - Schema 文件验证通过
   - 环境变量正确配置

3. **数据库连接测试** ✅
   - 成功连接到数据库
   - 可以执行查询操作
   - 确认有 6 个用户和 6 个工作空间的测试数据

4. **Prisma Client 生成** ✅
   - 重新生成 Prisma Client
   - 验证模块导入路径正确

### 当前状态
- ✅ 数据库连接正常
- ✅ 表结构完整
- ✅ 测试数据存在
- ✅ Prisma Client 配置正确
- ⚠️ 部分API路由仍存在连接问题（需要进一步调试模块导入）

### 下一步行动
1. 检查 TypeScript 编译配置
2. 验证 Next.js 路由的模块解析
3. 测试所有 API 端点的数据库连接
4. 确保生产环境的数据库配置

## 技术栈确认

### 后端技术栈
- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript 5
- **数据库**: SQLite + Prisma ORM
- **认证**: NextAuth.js v4
- **实时通信**: Socket.IO

### 前端技术栈
- **样式**: Tailwind CSS 4
- **组件库**: shadcn/ui
- **状态管理**: Zustand + TanStack Query
- **图标**: Lucide Icons

### 集成服务
- **AI 服务**: Z.ai SDK
- **外部集成**: Flowise API
- **文件存储**: 本地文件系统
- **缓存**: 内存缓存