
import React from 'react';

interface EnterpriseSidebarProps {
  activeModule: string;
  onSelect: (id: string) => void;
  onLogout: () => void;
}

export const EnterpriseSidebar: React.FC<EnterpriseSidebarProps> = ({ activeModule, onSelect, onLogout }) => {
  const menuItems = [
    { id: 'client_projects', label: 'Client Projects', icon: '📂' },
    { id: 'jurisdiction_library', label: 'Jurisdiction Library', icon: '🌍' },
    { id: 'spv_builder', label: 'SPV Structuring', icon: '🏗️' },
    { id: 'valuation_engine', label: 'Valuation Engine', icon: '📊' },
    { id: 'token_blueprint_generator', label: 'Token Blueprint', icon: '🪙' },
    { id: 'audit_module', label: 'Compliance Audit', icon: '🛡️' },
    { id: 'document_generation', label: 'Legal Docs', icon: '📄' },
    { id: 'investor_package_builder', label: 'Data Room', icon: '📦' },
    { id: 'deployments_connector', label: 'Chain Deployments', icon: '⚡' },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen shrink-0">
        
        {/* Brand */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800 shrink-0">
            <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center font-bold text-slate-900 mr-3">E</div>
            <span className="font-display font-bold text-white tracking-tight">PropertyDEX <span className="text-amber-500">Ent.</span></span>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
            {menuItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => onSelect(item.id)}
                    className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
                        ${activeModule === item.id 
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }
                    `}
                >
                    <span className="text-lg opacity-80">{item.icon}</span>
                    <span>{item.label}</span>
                </button>
            ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 shrink-0">
            <div className="bg-slate-800 rounded-xl p-4 mb-4">
                <p className="text-xs text-slate-400 uppercase font-bold mb-2">System Status</p>
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Mainnet Operational
                </div>
            </div>
            <button 
                onClick={onLogout}
                className="w-full py-2 text-xs font-bold text-slate-500 hover:text-white uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Exit Workspace
            </button>
        </div>

    </aside>
  );
};
