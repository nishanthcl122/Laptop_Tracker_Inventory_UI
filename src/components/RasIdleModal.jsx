import React, { useEffect, useState } from 'react';
import { X, UserMinus, Search, RefreshCw, Calendar, MapPin } from 'lucide-react';
import dayjs from 'dayjs';
import { api } from '../services/api';

export default function RasIdleModal({ onClose, initialLocation = 'ALL' }) {
  const [employees, setEmployees] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState(initialLocation || 'ALL');
  const [page, setPage] = useState(1);
  const pageSize = 50;

  useEffect(() => {
    if (initialLocation) {
      setLocation(initialLocation);
      setPage(1);
    }
  }, [initialLocation]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const loadData = () => {
    setLoading(true);
    api.getRasIdleEmployees({
      search: search.trim() || undefined,
      location: location === 'ALL' ? undefined : location,
      page,
      pageSize
    })
      .then(res => {
        setEmployees(res.items || []);
        setTotalCount(res.totalCount || 0);
      })
      .catch(err => {
        console.error('Failed to load RAS Idle workforce', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [page, location]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadData();
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const parsed = dayjs(dateStr);
    return parsed.isValid() ? parsed.format('DD-MMM-YYYY') : dateStr;
  };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 text-white flex items-center justify-between border-b border-purple-900/40">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-xs">
              <UserMinus className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-base font-bold text-white tracking-tight">
                  {location !== 'ALL' ? `RAS Idle Workforce — ${location}` : 'RAS Idle Workforce'}
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-purple-900/70 text-purple-200 rounded-full border border-purple-700">
                  {totalCount} Unallocated
                </span>
              </div>
              <p className="text-xs text-purple-200/70 mt-0.5">
                Employees in current RAS roster with no active allocated laptop
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search & Location */}
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by SAP ID, Name, or Location..."
              className="w-full pl-9 pr-3 h-8.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 placeholder-slate-400 shadow-2xs"
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                value={location === 'ALL' ? '' : location}
                onChange={(e) => {
                  setLocation(e.target.value ? e.target.value : 'ALL');
                  setPage(1);
                }}
                placeholder="Filter location..."
                className="w-36 px-2.5 h-8.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-700 shadow-2xs"
              />
            </div>

            <button
              type="button"
              onClick={() => { setSearch(''); setLocation('ALL'); setPage(1); }}
              className="px-2.5 h-8.5 text-xs text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              title="Reset search filters"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-xs text-slate-600 divide-y divide-slate-100">
            <thead className="bg-slate-100/90 text-slate-700 font-semibold uppercase tracking-wider text-[11px] sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-4">SAP ID</th>
                <th className="py-2.5 px-4">Employee Name</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4">RAS Location (PSA)</th>
                <th className="py-2.5 px-4">Last Working Day</th>
                <th className="py-2.5 px-4 text-right">Roster Snapshot</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-purple-500" />
                    Loading unallocated RAS employees...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <UserMinus className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No RAS idle employees found matching criteria.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => {
                  const hasLwd = !!emp.lastWorkingDay;
                  return (
                    <tr key={emp.sapId} className="hover:bg-purple-50/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-purple-900">
                        <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                          {emp.sapId}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {emp.employeeName || '—'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {emp.employeeStatus || '—'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <span className="inline-flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="font-medium text-slate-700">{emp.location || '—'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {hasLwd ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <Calendar className="w-3 h-3 text-rose-500" />
                            <span>{formatDate(emp.lastWorkingDay)}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-500 font-mono text-[11px]">
                        {formatDate(emp.snapshotDate)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-600">
          <div>
            Showing <span className="font-semibold text-slate-800">{employees.length}</span> of{' '}
            <span className="font-semibold text-slate-800">{totalCount}</span> idle employees
          </div>

          {totalPages > 1 && (
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-2.5 py-1 bg-white border border-slate-200 rounded text-xs font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>
              <span className="px-2 font-medium text-slate-700">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 bg-white border border-slate-200 rounded text-xs font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
