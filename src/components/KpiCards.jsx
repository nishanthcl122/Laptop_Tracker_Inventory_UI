import React, { useState } from 'react';
import {
  Laptop,
  CheckCircle2,
  Package,
  UserMinus,
  CalendarClock,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function KpiCards({ summary, onOpenResultsModal, onOpenRasIdleModal }) {
  const [isTotalExpanded, setIsTotalExpanded] = useState(true);
  const [isAllocatedExpanded, setIsAllocatedExpanded] = useState(true);

  const totalCount = summary?.totalLaptops ?? 0;
  const allocatedCount = summary?.allocatedLaptops ?? 0;
  const inStockCount = summary?.inStock ?? 0;
  const rasActiveCount = summary?.rasActive ?? 0;
  const lostCount = summary?.lost ?? 0;
  const notInUhgCount = summary?.notInUhg ?? 0;
  const rasIdleCount = summary?.rasIdle ?? 0;
  const lwd15Count = summary?.lwdApproaching15Days ?? 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 mb-5 items-start">
      {/* ======================================================== */}
      {/* LEFT SECTION: LAPTOP DETAILS (Hierarchy)                 */}
      {/* ======================================================== */}
      <div className="lg:col-span-8 bg-slate-50/60 border border-slate-200 rounded-xl p-3 space-y-2.5">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/70">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-slate-700 inline-block" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Laptop Details
            </h2>
          </div>
          {/* <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            Total ({totalCount.toLocaleString()}) = Allocated ({allocatedCount.toLocaleString()}) + In Stock ({inStockCount.toLocaleString()})
          </span> */}
        </div>

        {/* LEVEL 1: Total Laptops Accordion Header (DOES NOT OPEN MODAL) */}
        <div
          onClick={() => setIsTotalExpanded((prev) => !prev)}
          className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-3 cursor-pointer transition-colors shadow-sm select-none"
          title={isTotalExpanded ? 'Click to collapse child categories' : 'Click to expand child categories'}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-700 shrink-0">
                <Laptop className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">
                  Total Laptops
                </div>
                {/* <div className="text-[11px] text-slate-500">
                  Complete fleet in registry
                </div> */}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {totalCount.toLocaleString()}
              </div>
              <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors shrink-0">
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isTotalExpanded ? 'rotate-0' : '-rotate-90'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* LEVEL 2: Allocated & In Stock (Rendered when Total is expanded) */}
        {isTotalExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 items-start">
            {/* COLUMN 1: Allocated Laptops Card */}
            <div className="bg-white border border-slate-200 rounded-lg p-3 transition-colors shadow-sm">
              {/* Allocated Header Row (Toggles breakdown, DOES NOT OPEN MODAL) */}
              <div
                onClick={() => setIsAllocatedExpanded((prev) => !prev)}
                className="flex items-center justify-between cursor-pointer select-none group"
                title={isAllocatedExpanded ? 'Click to collapse breakdown' : 'Click to expand breakdown'}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      Allocated
                    </div>
                    <div className="text-[10.5px] text-slate-500">
                      Active + Lost + Not in UHG
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                    {allocatedCount.toLocaleString()}
                  </div>
                  <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-slate-800 transition-colors shrink-0">
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isAllocatedExpanded ? 'rotate-0' : '-rotate-90'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* LEVEL 3: Sub-cards rendered directly INSIDE Allocated card */}
              {isAllocatedExpanded && (
                <div className="mt-2.5 pt-2.5 border-t border-slate-100">
                  <div className="grid grid-cols-3 gap-1.5">
                    {/* RAS Active */}
                    <div
                      onClick={() =>
                        onOpenResultsModal({
                          title: 'RAS Active Laptops',
                          subtitle: 'Allocated laptops whose assigned staff is present in latest RAS roster',
                          filters: { status: 'Allocated', rasStatus: 'ACTIVE', isLost: false }
                        })
                      }
                      className="bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-300 rounded-md p-2 text-center cursor-pointer transition-all group"
                      title="Click to view RAS Active laptops in modal"
                    >
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        <span className="text-[10.5px] font-semibold text-slate-700 group-hover:text-emerald-700 truncate">
                          Active
                        </span>
                      </div>
                      <div className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {rasActiveCount.toLocaleString()}
                      </div>
                      <div className="text-[9.5px] text-slate-400 mt-0.5 truncate">
                        Active In UHG
                      </div>
                    </div>

                    {/* Lost */}
                    <div
                      onClick={() =>
                        onOpenResultsModal({
                          title: 'Lost Laptops',
                          subtitle: 'Laptops whose assigned staff was missing during initial RAS baseline',
                          filters: { status: 'Allocated', rasStatus: 'LOST', isLost: true }
                        })
                      }
                      className="bg-slate-50 hover:bg-rose-50/60 border border-slate-200/80 hover:border-rose-300 rounded-md p-2 text-center cursor-pointer transition-all group"
                      title="Click to view Lost laptops in modal"
                    >
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
                        <span className="text-[10.5px] font-semibold text-slate-700 group-hover:text-rose-700 truncate">
                          Lost
                        </span>
                      </div>
                      <div className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-rose-700 transition-colors">
                        {lostCount.toLocaleString()}
                      </div>
                      <div className="text-[9.5px] text-slate-400 mt-0.5 truncate">
                        Marked Lost
                      </div>
                    </div>

                    {/* Not in UHG */}
                    <div
                      onClick={() =>
                        onOpenResultsModal({
                          title: 'Not in UHG Laptops',
                          subtitle: 'Allocated laptops whose assigned staff exited from subsequent RAS roster',
                          filters: { status: 'Allocated', rasStatus: 'NOT_IN_UHG', isLost: false }
                        })
                      }
                      className="bg-slate-50 hover:bg-amber-50/60 border border-slate-200/80 hover:border-amber-300 rounded-md p-2 text-center cursor-pointer transition-all group"
                      title="Click to view Not in UHG laptops in modal"
                    >
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                        <span className="text-[10.5px] font-semibold text-slate-700 group-hover:text-amber-700 truncate">
                          Not in UHG
                        </span>
                      </div>
                      <div className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                        {notInUhgCount.toLocaleString()}
                      </div>
                      <div className="text-[9.5px] text-slate-400 mt-0.5 truncate">
                        Track Laptops
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* COLUMN 2: In Stock Laptops Card (Click opens modal) */}
            <div
              onClick={() =>
                onOpenResultsModal({
                  title: 'In Stock Laptops',
                  subtitle: 'Laptops currently available in project inventory',
                  filters: { status: 'In Stock' }
                })
              }
              className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 rounded-lg p-4 cursor-pointer transition-all shadow-sm group select-none flex flex-col justify-between"
              title="Click to view In Stock laptops in modal"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                        In Stock
                      </div>
                      <div className="text-[10.5px] text-slate-500">
                        Available Inventory
                      </div>
                    </div>
                  </div>
                  {/* <span className="text-[11px] text-slate-400 font-mono">
                    {totalCount > 0 ? `${Math.round((inStockCount / totalCount) * 100)}%` : '0%'}
                  </span> */}
                </div>

                <div className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-emerald-700 tracking-tight transition-colors">
                  {inStockCount.toLocaleString()}
                </div>
                <p className="text-[10.5px] text-slate-500 mt-0.5">
                  Unassigned assets ready for deployment
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[10.5px] text-emerald-700 font-medium flex items-center justify-between">
                <span>View Inventory</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* RIGHT SECTION: NUMBERS FROM RAS                          */}
      {/* ======================================================== */}
      <div className="lg:col-span-4 bg-slate-50/60 border border-slate-200 rounded-xl p-3 space-y-2.5">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/70">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-slate-700 inline-block" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Numbers from RAS
            </h2>
          </div>
          {/* <span className="text-[11px] text-slate-500 font-mono">
            Roster Analysis
          </span> */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
          {/* Card 1: RAS Idle (PSA-wise) -> Opens existing RAS Idle modal */}
          <div
            onClick={onOpenRasIdleModal}
            className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 rounded-lg p-3 cursor-pointer transition-all shadow-sm group select-none"
            title="Click to open RAS Idle Location Breakdown modal"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                  <UserMinus className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                  Resources Without Laptops
                </span>
              </div>
              <div className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-purple-700 tracking-tight transition-colors">
                {rasIdleCount.toLocaleString()}
              </div>
            </div>
            <p className="text-[10.5px] text-slate-500">
              Active RAS staff without an allocated laptop
            </p>
            <div className="mt-2 pt-2 border-t border-slate-100 text-[10.5px] text-purple-700 font-medium flex items-center justify-between">
              <span>View Location Breakdown</span>
              <ChevronRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 2: LWD < 15 Days -> Opens centered LaptopResultsModal */}
          <div
            onClick={() =>
              onOpenResultsModal({
                title: 'LWD ≤ 15 Days Exit Risk',
                subtitle: 'Allocated laptops whose assigned staff has Last Working Day within the next 15 days',
                filters: { status: 'Allocated', lwdApproaching15Days: true }
              })
            }
            className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 rounded-lg p-3 cursor-pointer transition-all shadow-sm group select-none"
            title="Click to view LWD exit risk laptops in modal"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <CalendarClock className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-amber-700 transition-colors">
                  LWD &lt; 15 Days
                </span>
              </div>
              <div className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-amber-700 tracking-tight transition-colors">
                {lwd15Count.toLocaleString()}
              </div>
            </div>
            <p className="text-[10.5px] text-slate-500">
              Allocated assets with employee exit within 15 days
            </p>
            <div className="mt-2 pt-2 border-t border-slate-100 text-[10.5px] text-amber-700 font-medium flex items-center justify-between">
              <span>View Exit Risk Laptops</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
