import FlowiseWorkflowManager from '@/components/flowise-workflow-manager';

export default function FlowiseWorkflowsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto py-8">
        <FlowiseWorkflowManager />
      </div>
    </div>
  );
}

// Force recompile