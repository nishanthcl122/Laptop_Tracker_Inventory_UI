import React from 'react';
import { MousePointerClick } from 'lucide-react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

const ALLOC_COLORS = {
  'Allocated': '#3b82f6',
  'In Stock': '#10b981',
  'Lost': '#f43f5e'
};
const AGE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
const RAS_COLORS = {
  ACTIVE: '#10b981',
  LOST: '#f43f5e',
  'NOT IN UHG': '#f59e0b',
  INACTIVE: '#ef4444',
  UNKNOWN: '#94a3b8'
};
const LWD_COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6'];
const LOCATION_COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#6366f1', '#14b8a6'];
const RAS_IDLE_COLORS = ['#8b5cf6', '#a855f7', '#7c3aed', '#6366f1', '#4f46e5', '#9333ea', '#c084fc', '#d8b4fe'];

export default function DashboardCharts({ charts, onChartClick, onOpenLocationModal, onOpenRasIdleModal }) {
  if (!charts) return null;

  return (
    <div className="mb-5 space-y-2.5">
      {/* Interactive Graph Banner */}
      {/* <div className="flex items-center justify-between px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium">
        <div className="flex items-center space-x-2">
          <MousePointerClick className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span>Click any chart bar or segment to open filtered laptops in modal</span>
        </div>
        <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider hidden sm:inline">Operational Analytics</span>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* 1. Allocation Status */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors flex flex-col justify-between">
          <div
            onClick={() => onChartClick && onChartClick('allocation', null)}
            className="cursor-pointer group select-none"
            title="Click to view all laptops"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 group-hover:text-blue-600 transition-colors">
                Total Laptops Distribution
              </h3>
              {/* <span className="text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-medium">Clickable</span> */}
            </div>
            {/* <p className="text-[11px] text-slate-400 mt-0.5">Allocated vs In Stock</p> */}
          </div>
          <div className="h-36 w-full flex items-center justify-center cursor-pointer">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.allocationStatus.filter(
                    item => item.name !== 'Lost'
                  )}
                  cx="50%"
                  cy="50%"
                  innerRadius={28}
                  outerRadius={50}
                  paddingAngle={4}
                  dataKey="value"
                  onClick={(entry) => onChartClick && onChartClick('allocation', entry.name)}
                >
                  {charts.allocationStatus
                    .filter(item => item.name !== 'Lost')
                    .map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={ALLOC_COLORS[entry.name] || '#3b82f6'}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    ))}
                </Pie>

                <Tooltip formatter={(value, name) => [value.toLocaleString(), name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-2 text-[11px] font-medium text-slate-600">
            {charts.allocationStatus
              .filter((item) => item.name !== 'Lost')
              .map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() =>
                    onChartClick && onChartClick('allocation', item.name)
                  }
                  className="flex items-center space-x-1 hover:text-blue-600 cursor-pointer transition-colors"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: ALLOC_COLORS[item.name] || '#3b82f6',
                    }}
                  />
                  <span>
                    {item.name}: <b>{item.value}</b>
                  </span>
                </button>
              ))}
          </div>
        </div>

        {/* 2. Stock Ageing */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors flex flex-col justify-between">
          <div
            onClick={() => onChartClick && onChartClick('stockAge', null)}
            className="cursor-pointer group select-none"
            title="Click to view all in-stock laptops"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 group-hover:text-blue-600 transition-colors">
                Stock Ageing
              </h3>
              {/* <span className="text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-medium">Clickable</span> */}
            </div>
            {/* <p className="text-[11px] text-slate-400 mt-0.5">In-stock duration buckets</p> */}
          </div>
          <div className="h-36 w-full cursor-pointer">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={charts.stockAgeing}
                margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
                onClick={(state) => {
                  if (state && state.activePayload && state.activePayload.length) {
                    onChartClick && onChartClick('stockAge', state.activePayload[0].payload.name);
                  } else {
                    onChartClick && onChartClick('stockAge', null);
                  }
                }}
              >
                <XAxis dataKey="name" tick={{ fontSize: 8.5, fill: '#64748b' }} interval={0} />
                <YAxis tick={{ fontSize: 8.5, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip formatter={(val) => [val, 'Laptops']} />
                <Bar dataKey="value" radius={[3, 3, 0, 0]} className="cursor-pointer">
                  {charts.stockAgeing.map((entry, idx) => (
                    <Cell
                      key={`age-${idx}`}
                      fill={AGE_COLORS[idx % AGE_COLORS.length]}
                      onClick={() => onChartClick && onChartClick('stockAge', entry.name)}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div
            onClick={() => onChartClick && onChartClick('stockAge', '> 90 days')}
            className="text-[10.5px] text-center text-slate-500 font-medium cursor-pointer hover:text-amber-700 transition-colors truncate"
            title="Filter by In Stock > 90 days"
          >
            <span className="text-amber-600 font-bold">{charts.stockAgeing.find(x => x.name.includes('90'))?.value ?? 0}</span> in stock &gt;90d
          </div>
        </div>

        {/* 3. RAS Status for Allocated */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors flex flex-col justify-between">
          <div
            onClick={() => onChartClick && onChartClick('rasStatus', null)}
            className="cursor-pointer group select-none"
            title="Click to view all allocated laptops"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 group-hover:text-blue-600 transition-colors">
                Allocated Distribution
              </h3>
              {/* <span className="text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-medium">Clickable</span> */}
            </div>
            {/* <p className="text-[11px] text-slate-400 mt-0.5">Allocated workforce status</p> */}
          </div>
          <div className="h-36 w-full cursor-pointer">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={charts.rasStatus}
                margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
                onClick={(state) => {
                  if (state && state.activePayload && state.activePayload.length) {
                    onChartClick && onChartClick('rasStatus', state.activePayload[0].payload.name);
                  } else {
                    onChartClick && onChartClick('rasStatus', null);
                  }
                }}
              >
                <XAxis dataKey="name" tick={{ fontSize: 8.5, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 8.5, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip formatter={(val) => [val, 'Laptops']} />
                <Bar dataKey="value" radius={[3, 3, 0, 0]} className="cursor-pointer">
                  {charts.rasStatus.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={RAS_COLORS[entry.name] || '#64748b'}
                      onClick={() => onChartClick && onChartClick('rasStatus', entry.name)}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-2 text-[10.5px] text-slate-600 truncate">
            {charts.rasStatus.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => onChartClick && onChartClick('rasStatus', item.name)}
                className="flex items-center space-x-1 hover:text-blue-600 cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: RAS_COLORS[item.name] || '#64748b' }} />
                <span>{item.name}: <b>{item.value}</b></span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. LWD Exit Risk */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors flex flex-col justify-between">
          <div
            onClick={() => onChartClick && onChartClick('lwdRisk', null)}
            className="cursor-pointer group select-none"
            title="Click to view all laptops with LWD risk"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 group-hover:text-blue-600 transition-colors">
                LWD Exit Risk
              </h3>
              {/* <span className="text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-medium">Clickable</span> */}
            </div>
            {/* <p className="text-[11px] text-slate-400 mt-0.5">Exit timeline horizon</p> */}
          </div>
          <div className="h-36 w-full cursor-pointer">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={charts.lwdRisk}
                margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
                onClick={(state) => {
                  if (state && state.activePayload && state.activePayload.length) {
                    onChartClick && onChartClick('lwdRisk', state.activePayload[0].payload.name);
                  } else {
                    onChartClick && onChartClick('lwdRisk', null);
                  }
                }}
              >
                <XAxis dataKey="name" tick={{ fontSize: 8.5, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 8.5, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip formatter={(val) => [val, 'Laptops']} />
                <Bar dataKey="value" radius={[3, 3, 0, 0]} className="cursor-pointer">
                  {charts.lwdRisk.map((entry, idx) => (
                    <Cell
                      key={`lwd-${idx}`}
                      fill={LWD_COLORS[idx % LWD_COLORS.length]}
                      onClick={() => onChartClick && onChartClick('lwdRisk', entry.name)}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center flex-wrap gap-1 text-[10.5px] text-slate-600">
            {charts.lwdRisk.map((item, idx) => (
              <button
                key={item.name}
                type="button"
                onClick={() => onChartClick && onChartClick('lwdRisk', item.name)}
                className="inline-flex items-center space-x-1 px-1 py-0.5 rounded hover:bg-slate-100 hover:text-blue-600 cursor-pointer transition-colors"
                title={`Filter by ${item.name}`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: LWD_COLORS[idx % LWD_COLORS.length] }} />
                <span>{item.name}: <b>{item.value}</b></span>
              </button>
            ))}
          </div>
        </div>

        {/* 5. Laptop Count by Location (Opens LaptopResultsModal) */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors flex flex-col justify-between">
          <div
            onClick={() => onChartClick && onChartClick('location', null)}
            className="cursor-pointer group select-none"
            title="Click to view all laptops by location"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 group-hover:text-blue-600 transition-colors">
                Laptops In Specific Locations
              </h3>
              {/* <span className="text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-medium">Clickable</span> */}
            </div>
            {/* <p className="text-[11px] text-slate-400 mt-0.5">Asset count by branch</p> */}
          </div>
          <div className="h-36 w-full cursor-pointer">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={charts.locationDistribution || []}
                margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
                onClick={(state) => {
                  if (state && state.activePayload && state.activePayload.length) {
                    const loc = state.activePayload[0].payload.name;
                    onChartClick && onChartClick('location', loc);
                  } else {
                    onChartClick && onChartClick('location', null);
                  }
                }}
              >
                <XAxis dataKey="name" tick={{ fontSize: 8, fill: '#64748b' }} interval={0} />
                <YAxis tick={{ fontSize: 8.5, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip formatter={(val) => [val, 'Laptops']} />
                <Bar dataKey="value" radius={[3, 3, 0, 0]} className="cursor-pointer">
                  {(charts.locationDistribution || []).map((entry, idx) => (
                    <Cell
                      key={`loc-${idx}`}
                      fill={LOCATION_COLORS[idx % LOCATION_COLORS.length]}
                      onClick={() => onChartClick && onChartClick('location', entry.name)}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10.5px] text-center text-slate-500 truncate">
            {charts.locationDistribution?.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  const loc = charts.locationDistribution[0].name;
                  onChartClick && onChartClick('location', loc);
                }}
                className="hover:text-blue-600 cursor-pointer transition-colors"
                title={`View all laptops at ${charts.locationDistribution[0].name}`}
              >
                Top: <b className="text-slate-800">{charts.locationDistribution[0].name}</b> ({charts.locationDistribution[0].value})
              </button>
            ) : 'No location data'}
          </div>
        </div>

        {/* 6. RAS Idle by Location (Opens RasIdleModal) */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors flex flex-col justify-between">
          <div
            onClick={() => onOpenRasIdleModal && onOpenRasIdleModal(null)}
            className="cursor-pointer group select-none"
            title="Click to view all RAS Idle workforce"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 group-hover:text-purple-600 transition-colors">
                Resource Without Laptops (Location-Wise)
              </h3>
              {/* <span className="text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-medium">Clickable</span> */}
            </div>
            {/* <p className="text-[11px] text-slate-400 mt-0.5">Unallocated workforce by city</p> */}
          </div>
          <div className="h-36 w-full cursor-pointer">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={charts.rasIdleLocationDistribution || []}
                margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
                onClick={(state) => {
                  if (state && state.activePayload && state.activePayload.length) {
                    const loc = state.activePayload[0].payload.name;
                    if (onOpenRasIdleModal) onOpenRasIdleModal(loc);
                  }
                }}
              >
                <XAxis
                  dataKey="name"
                  hide={true}
                />

                <YAxis
                  tick={{ fontSize: 8.5, fill: '#7c3aed' }}
                  allowDecimals={false}
                />

                <Tooltip formatter={(val) => [val, 'Idle Employees']} />

                <Bar dataKey="value" radius={[3, 3, 0, 0]} className="cursor-pointer">
                  {(charts.rasIdleLocationDistribution || []).map((entry, idx) => (
                    <Cell
                      key={`idle-loc-${idx}`}
                      fill={RAS_IDLE_COLORS[idx % RAS_IDLE_COLORS.length]}
                      onClick={() => {
                        if (onOpenRasIdleModal) onOpenRasIdleModal(entry.name);
                      }}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10.5px] text-center text-slate-500 truncate">
            {charts.rasIdleLocationDistribution?.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  const loc = charts.rasIdleLocationDistribution[0].name;
                  if (onOpenRasIdleModal) onOpenRasIdleModal(loc);
                }}
                className="hover:text-purple-600 cursor-pointer transition-colors"
                title={`View RAS Idle workforce at ${charts.rasIdleLocationDistribution[0].name}`}
              >
                Top: <b className="text-purple-800">{charts.rasIdleLocationDistribution[0].name}</b> ({charts.rasIdleLocationDistribution[0].value})
              </button>
            ) : 'No idle employees'}
          </div>
        </div>
      </div>
    </div>
  );
}
