import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import DashboardPage from './pages/DashboardPage';
import LaptopDetailsPage from './pages/LaptopDetailsPage';
import RasDataPage from './pages/RasDataPage';
import ImportPage from './pages/ImportPage';
import BatchMasterPage from './pages/BatchMasterPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [importInitialTab, setImportInitialTab] = useState('laptop');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleImportSuccess = () => {
    // Increment refresh key to trigger re-renders
    setRefreshKey(k => k + 1);
    // Switch to Dashboard to inspect results
    setActiveTab('dashboard');
  };

  const handleNavigateImport = (tab = 'laptop') => {
    setImportInitialTab(tab);
    setActiveTab('import');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-800">
      {/* Global Toast Notifications */}
      <ToastContainer />

      {/* Top Application Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1520px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardPage
            key={refreshKey}
            onNavigateDetails={() => setActiveTab('laptops')}
          />
        )}

        {activeTab === 'laptops' && (
          <LaptopDetailsPage
            key={refreshKey}
          />
        )}

        {activeTab === 'ras' && (
          <RasDataPage
            key={refreshKey}
            onNavigateImport={handleNavigateImport}
          />
        )}

        {activeTab === 'import' && (
          <ImportPage
            key={importInitialTab}
            initialTab={importInitialTab}
            onImportSuccess={handleImportSuccess}
          />
        )}

        {activeTab === 'batches' && (
          <BatchMasterPage
            key={refreshKey}
          />
        )}
      </main>
    </div>
  );
}
