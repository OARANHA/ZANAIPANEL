# Zanai Project Dashboard

A comprehensive AI agent management system built with Next.js, TypeScript, and Prisma. This dashboard provides a complete solution for creating, managing, and executing AI agents across different workspaces and projects.

## 🚀 Features

### Core Functionality
- **Agent Management**: Create, edit, execute, and archive AI agents
- **Workspace System**: Organize agents into different project workspaces
- **Specialist Generator**: AI-powered specialist creation for various business domains
- **Composition System**: Combine multiple agents to create complex workflows
- **Real-time Execution**: Monitor agent executions with live updates
- **Learning & Analytics**: Track performance and optimize agent behavior

### Agent Types
- **Template Agents**: Pre-configured agents for common tasks
- **Custom Agents**: User-defined agents with specific configurations
- **Composed Agents**: Multi-agent workflows for complex operations

### User Interface
- **Modern Design**: Built with shadcn/ui components and Tailwind CSS
- **Responsive Layout**: Works seamlessly across desktop and mobile devices
- **Dark Mode Support**: Automatic theme switching
- **Interactive Dashboard**: Real-time statistics and performance metrics

## 🛠️ Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript 5**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern UI component library
- **Lucide React**: Beautiful icons

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Prisma ORM**: Database toolkit and ORM
- **SQLite**: Lightweight database
- **Socket.IO**: Real-time bidirectional communication
- **Z-AI Web Dev SDK**: AI integration for agent generation

### Development Tools
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **Nodemon**: Development server auto-restart

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/OARANHA/zanai-project-dashboard.git
   cd zanai-project-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-here"
   ZAI_API_KEY="your-zai-api-key"
   ```

4. **Initialize database**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── agents/        # Agent management
│   │   ├── compositions/   # Workflow composition
│   │   ├── executions/    # Execution tracking
│   │   ├── specialists/   # Specialist generation
│   │   ├── workspaces/    # Workspace management
│   │   └── ...
│   ├── agents/            # Agents dashboard
│   ├── compositions/      # Composition management
│   ├── learning/          # Learning analytics
│   ├── specialists/       # Specialist generator
│   ├── studio/            # Development studio
│   └── ...
├── components/            # Reusable components
│   ├── agents/           # Agent-specific components
│   ├── layout/           # Layout components
│   ├── specialists/     # Specialist components
│   └── ui/              # shadcn/ui components
├── lib/                  # Utility libraries
│   ├── db/              # Database connection
│   ├── socket.ts        # Socket.IO configuration
│   └── ...
└── ...
```

## 🚀 Usage

### Creating Agents
1. Navigate to the **Agents** page
2. Click **"Criar Agente"**
3. Fill in agent details:
   - Name and description
   - Agent type (template, custom, composed)
   - Configuration and knowledge base
   - Select workspace
4. Save and start using the agent

### Generating Specialists
1. Go to **Specialists** page
2. Click **"Gerar Especialista"**
3. Provide requirements:
   - Business category
   - Specialty area
   - Specific requirements
4. AI will generate a specialized agent template

### Creating Compositions
1. Visit **Compositions** page
2. Click **"Criar Composição"**
3. Select multiple agents to combine
4. Define workflow and execution order
5. Save and execute the composition

### Monitoring Executions
1. Check **Executions** page for real-time tracking
2. View execution history and results
3. Analyze performance metrics
4. Debug failed executions

## 🔧 Configuration

### Environment Variables
- `DATABASE_URL`: SQLite database connection string
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `ZAI_API_KEY`: API key for AI services
- `NODE_ENV`: Environment (development/production)

### Database Schema
The application uses Prisma with SQLite. Key entities include:
- **Users**: Application users
- **Workspaces**: Project organization
- **Agents**: AI agents with configurations
- **Compositions**: Multi-agent workflows
- **Executions**: Execution records and results
- **Learning**: Performance data and analytics

## 📊 API Endpoints

### Agents
- `GET /api/agents` - List all agents
- `POST /api/agents` - Create new agent
- `GET /api/agents/[id]` - Get agent details
- `PATCH /api/agents/[id]` - Update agent
- `DELETE /api/agents/[id]` - Delete agent

### Compositions
- `GET /api/compositions` - List compositions
- `POST /api/compositions` - Create composition
- `POST /api/compositions/execute` - Execute composition

### Specialists
- `GET /api/specialists` - Get specialist templates
- `POST /api/specialists` - Generate specialist
- `POST /api/specialists/download` - Download specialist

### Executions
- `GET /api/executions` - List executions
- `POST /api/execute` - Execute agent

## 🎨 UI Components

### ElegantCard
Beautiful card component with gradient backgrounds and icons:
```tsx
<ElegantCard
  title="Card Title"
  description="Card description"
  icon={IconComponent}
  iconColor="text-blue-600"
  bgColor="bg-blue-100 dark:bg-blue-900/20"
  value={42}
  badge="Active"
  badgeColor="bg-blue-50 text-blue-700 border-blue-200"
/>
```

### MainLayout
Consistent layout across all pages with navigation and theming.

## 🔄 Development Workflow

### Making Changes
1. Create a new branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run tests: `npm run lint`
4. Commit changes: `git commit -m "Your commit message"`
5. Push branch: `git push origin feature/your-feature`
6. Create pull request

### Database Changes
1. Update `prisma/schema.prisma`
2. Run `npx prisma db push`
3. Update seed data if needed
4. Test changes thoroughly

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Reset database
npx prisma db push --force-reset
npm run db:seed
```

**Port Already in Use**
```bash
# Find process using port 3000
lsof -ti:3000 | xargs kill -9
```

**Build Errors**
```bash
# Clean and rebuild
rm -rf .next
npm run build
```

### Performance Issues
- Use `npm run analyze` to check bundle size
- Monitor database queries with Prisma
- Optimize images and assets

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the excellent framework
- **Prisma Team** for the amazing ORM
- **shadcn/ui** for the beautiful components
- **Tailwind CSS** for the utility-first CSS framework

## 🤖 Z.ai Code Assistant Integration

This project is enhanced with **Z.ai Code Assistant** - an advanced AI-powered development assistant that provides intelligent code completion, debugging, and project management capabilities.

### AI-Powered Features
- **Smart Code Completion**: Context-aware code suggestions and completions
- **Intelligent Debugging**: AI-powered error detection and resolution suggestions
- **Project Analysis**: Automated code review and optimization recommendations
- **Documentation Generation**: Automatic documentation creation and updates
- **Architecture Planning**: AI-assisted system design and structure planning

### Development with Z.ai Code
- **Real-time Assistance**: Get instant help while coding with context-aware suggestions
- **Multi-language Support**: Works seamlessly with TypeScript, JavaScript, Prisma, and more
- **Best Practices**: Enforces coding standards and best practices automatically
- **Learning Integration**: Continuously learns from project patterns to provide better assistance

### Z.ai Code Configuration
The project includes `.z-ai-config` file with optimized settings:
- **Model**: GLM-4.5-Flash for fast and accurate responses
- **Temperature**: 0.6 for balanced creativity and precision
- **Max Tokens**: 2000 for comprehensive responses
- **Custom API Integration**: Seamless integration with Z.ai services

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code comments
- Use Z.ai Code Assistant for real-time development help

---

**Built with ❤️ using Next.js, TypeScript, and Z.ai Code Assistant**