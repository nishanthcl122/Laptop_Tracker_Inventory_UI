import React from 'react';
import { Laptop, LayoutDashboard, Users, UploadCloud, History } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'laptops', label: 'Laptop Details', icon: Laptop },
    { id: 'ras', label: 'RAS Data', icon: Users },
    { id: 'import', label: 'Excel Import & Reconcile', icon: UploadCloud },
    { id: 'batches', label: 'Batch Master Data', icon: History },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white shadow-2xs">
              <Laptop className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-2.5">
              <span className="font-semibold text-base tracking-tight text-white">LaptopTracker</span>
              {/* <span className="text-slate-600">|</span> */}
              {/* <span className="text-xs text-slate-400 font-normal hidden sm:inline">Daily Excel Reconciliation & Inventory Monitoring</span> */}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-blue-400 border border-slate-700/80 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
