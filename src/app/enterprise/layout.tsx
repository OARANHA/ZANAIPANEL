import { ReactNode } from 'react';

interface EnterpriseLayoutProps {
  children: ReactNode;
}

export default function EnterpriseLayout({ children }: EnterpriseLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-slate-800 shadow-lg">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">
              Zanai Enterprise
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Painel Corporativo
            </p>
          </div>
          
          <nav className="mt-6">
            <div className="px-6 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Empresa
            </div>
            <a href="/enterprise" className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-slate-700">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Dashboard
            </a>
            <a href="/enterprise/admin" className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-slate-700">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Administração
            </a>
            <a href="/enterprise/user" className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-slate-700">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Meu Espaço
            </a>
            
            <div className="px-6 py-2 mt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Recursos
            </div>
            <a href="/enterprise/agents" className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-slate-700">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Agentes
            </a>
            <a href="/enterprise/analytics" className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-slate-700">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </a>
            <a href="/enterprise/settings" className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-slate-700">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configurações
            </a>
          </nav>
          
          <div className="absolute bottom-0 w-64 p-6">
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <a href="/login" className="flex items-center text-red-600 dark:text-red-400 hover:text-red-700">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sair
              </a>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}