import React, { useEffect, useState } from 'react';
import { X, MapPin, Laptop, Search, RefreshCw, CheckCircle2, Package, Filter } from 'lucide-react';
import dayjs from 'dayjs';
import { api } from '../services/api';

export default function LocationLaptopsModal({ location, onClose, onFilterDashboard }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!location) return;
    setLoading(true);
    api.getLaptopsByLocation(location)
      .then(res => {
        setData(res);
      })
      .catch(err => {
        console.error('Failed to load laptops for location ' + location, err);
      })
      .finally(() => setLoading(false));
  }, [location]);

  if (!location) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const parsed = dayjs(dateStr);
    return parsed.isValid() ? parsed.format('DD-MMM-YYYY') : dateStr;
  };

  const laptops = data?.laptops || [];
  const filteredLaptops = laptops.filter((lap) => {
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'Allocated' && lap.status !== 'Allocated') return false;
      if (statusFilter === 'In Stock' && lap.status !== 'In Stock') return false;
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      const matchSerial = lap.serialNumber?.toLowerCase().includes(s);
      const matchUser = lap.userName?.toLowerCase().includes(s);
      const matchSap = lap.sapId?.toLowerCase().includes(s);
      const matchFbr = lap.fbrRequest?.toLowerCase().includes(s);
      const matchSpoc = lap.itSpoc?.toLowerCase().includes(s) || lap.itspoc?.toLowerCase().includes(s);
      if (!matchSerial && !matchUser && !matchSap && !matchFbr && !matchSpoc) return false;
    }
    return true;
  });

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[88vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300 shadow-xs">
              <MapPin className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-base font-bold text-white tracking-tight">
                  {location} — Laptop Inventory
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-blue-950 text-blue-300 rounded-full border border-blue-800">
                  {data?.totalCount ?? 0} Laptops
                </span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Allocated: <b className="text-slate-200">{data?.allocatedCount ?? 0}</b></span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>In Stock: <b className="text-slate-200">{data?.inStockCount ?? 0}</b></span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onFilterDashboard && (
              <button
                type="button"
                onClick={() => {
                  onFilterDashboard(location);
                  onClose();
                }}
                className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer shadow-2xs"
                title="Apply this location filter to main dashboard table"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filter Dashboard</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Search & Status Filters */}
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search serial, user, SAP ID, FBR, SPOC..."
              className="w-full pl-9 pr-3 h-8.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 placeholder-slate-400 shadow-2xs"
            />
          </div>

          <div className="flex items-center space-x-1 bg-slate-200/60 p-0.5 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1 font-medium rounded-md cursor-pointer transition-colors ${
                statusFilter === 'ALL' ? 'bg-white text-blue-600 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({data?.totalCount ?? 0})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Allocated')}
              className={`px-3 py-1 font-medium rounded-md cursor-pointer transition-colors ${
                statusFilter === 'Allocated' ? 'bg-white text-blue-600 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Allocated ({data?.allocatedCount ?? 0})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('In Stock')}
              className={`px-3 py-1 font-medium rounded-md cursor-pointer transition-colors ${
                statusFilter === 'In Stock' ? 'bg-white text-emerald-600 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              In Stock ({data?.inStockCount ?? 0})
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-xs text-slate-600 divide-y divide-slate-100">
            <thead className="bg-slate-100/90 text-slate-700 font-semibold uppercase tracking-wider text-[11px] sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-4">Serial No.</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">User Name</th>
                <th className="py-2.5 px-4">SAP ID</th>
                <th className="py-2.5 px-4">FBR Request</th>
                <th className="py-2.5 px-4">IT SPOC</th>
                <th className="py-2.5 px-4 text-right">Ageing / LWD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-500" />
                    Loading laptops for {location}...
                  </td>
                </tr>
              ) : filteredLaptops.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <Laptop className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No laptop records match current filters at {location}.
                  </td>
                </tr>
              ) : (
                filteredLaptops.map((lap) => {
                  const isAllocated = lap.status === 'Allocated';
                  return (
                    <tr key={lap.serialNumber} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {lap.serialNumber}
                      </td>
                      <td className="py-3 px-4">
                        {isAllocated ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            <CheckCircle2 className="w-3 h-3 text-blue-500" />
                            <span>Allocated</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Package className="w-3 h-3 text-emerald-500" />
                            <span>In Stock</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {lap.userName || '—'}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {lap.sapId || '—'}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {lap.fbrRequest || '—'}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {lap.itSpoc || lap.itspoc || '—'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isAllocated ? (
                          lap.lastWorkingDay ? (
                            <span className="text-amber-700 font-medium">LWD: {formatDate(lap.lastWorkingDay)}</span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )
                        ) : (
                          lap.ageingDays !== null && lap.ageingDays !== undefined ? (
                            <span className="font-mono font-semibold text-slate-700">
                              {lap.ageingDays} <span className="text-[10px] text-slate-400 font-normal">days</span>
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-600">
          <div>
            Showing <span className="font-semibold text-slate-800">{filteredLaptops.length}</span> of{' '}
            <span className="font-semibold text-slate-800">{laptops.length}</span> laptops in {location}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-medium text-slate-700 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
