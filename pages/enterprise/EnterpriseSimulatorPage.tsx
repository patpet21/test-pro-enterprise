
import React, { useState } from 'react';
import { EnterpriseSidebar } from '../../components/enterprise/EnterpriseSidebar';
import { 
    ClientProjects,
    JurisdictionLibrary,
    SpvBuilder,
    ValuationEngine,
    TokenBlueprintGenerator,
    AuditModule,
    DocumentGeneration,
    InvestorPackageBuilder,
    DeploymentsConnector
} from '../../components/enterprise/steps';

interface EnterpriseSimulatorPageProps {
  onBack: () => void;
}

export const EnterpriseSimulatorPage: React.FC<EnterpriseSimulatorPageProps> = ({ onBack }) => {
  const [activeModule, setActiveModule] = useState('client_projects');
  
  const renderContent = () => {
      switch (activeModule) {
          case 'client_projects': return <ClientProjects />;
          case 'jurisdiction_library': return <JurisdictionLibrary />;
          case 'spv_builder': return <SpvBuilder />;
          case 'valuation_engine': return <ValuationEngine />;
          case 'token_blueprint_generator': return <TokenBlueprintGenerator />;
          case 'audit_module': return <AuditModule />;
          case 'document_generation': return <DocumentGeneration />;
          case 'investor_package_builder': return <InvestorPackageBuilder />;
          case 'deployments_connector': return <DeploymentsConnector />;
          default: return <ClientProjects />;
      }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-slate-200 overflow-hidden">
        
        {/* Enterprise Sidebar */}
        <EnterpriseSidebar 
            activeModule={activeModule}
            onSelect={setActiveModule}
            onLogout={onBack}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <header className="h-20 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-8 shrink-0">
                <div>
                    <h1 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-3">
                        <span className="text-amber-500">❖</span>
                        Enterprise Workspace
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onBack}
                        className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-800 rounded-lg transition-all"
                    >
                        Back to Home
                    </button>
                    <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-slate-900 font-bold">
                        JD
                    </div>
                </div>
            </header>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-900/50">
                <div className="max-w-[1600px] mx-auto">
                    {renderContent()}
                </div>
            </div>
        </main>

    </div>
  );
};
