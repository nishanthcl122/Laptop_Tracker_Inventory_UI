import React, { useEffect, useState } from 'react';
import KpiCards from '../components/KpiCards';
import DashboardCharts from '../components/DashboardCharts';
import LaptopResultsModal from '../components/LaptopResultsModal';
import AuditModal from '../components/AuditModal';
import RasIdleModal from '../components/RasIdleModal';
import { api } from '../services/api';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState(null);

  // Centered Laptop Results Modal state
  const [resultsModal, setResultsModal] = useState({
    isOpen: false,
    title: '',
    subtitle: '',
    filters: {}
  });

  // Selected laptop for detailed audit trail modal
  const [selectedLaptop, setSelectedLaptop] = useState(null);

  // RAS Idle Workforce Modal state
  const [rasIdleModalOpen, setRasIdleModalOpen] = useState(false);
  const [selectedRasIdleLocation, setSelectedRasIdleLocation] = useState('ALL');

  // Load Dashboard Summary & Charts
  const loadDashboardMetrics = () => {
    api.getDashboardSummary().then(setSummary).catch(console.error);
    api.getDashboardCharts().then(setCharts).catch(console.error);
  };

  useEffect(() => {
    loadDashboardMetrics();
  }, []);

  // Helper to open the reusable LaptopResultsModal
  const openResultsModal = (config) => {
    setResultsModal({
      isOpen: true,
      title: config.title || 'Filtered Laptops',
      subtitle: config.subtitle || '',
      filters: config.filters || {}
    });
  };

  const closeResultsModal = () => {
    setResultsModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Handle Chart Clicks -> Open LaptopResultsModal with matching filter
  const handleChartClick = (type, value) => {
    const formatDateStr = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // If clicked chart container/blank area without a specific data point:
    if (!value || typeof value !== 'string' || value.trim() === '') {
      if (type === 'allocation') {
        openResultsModal({
          title: 'All Registered Laptops',
          subtitle: 'Fleet overview from Allocation chart',
          filters: {}
        });
      } else if (type === 'stockAge') {
        openResultsModal({
          title: 'In Stock Laptops',
          subtitle: 'All in-stock laptops from Stock Ageing chart',
          filters: { status: 'In Stock' }
        });
      } else if (type === 'rasStatus') {
        openResultsModal({
          title: 'Allocated Laptops',
          subtitle: 'All allocated laptops from RAS Activity chart',
          filters: { status: 'Allocated' }
        });
      } else if (type === 'lwdRisk' || type === 'lwd') {
        openResultsModal({
          title: 'Allocated Laptops',
          subtitle: 'All allocated laptops from LWD Exit Risk chart',
          filters: { status: 'Allocated' }
        });
      } else if (type === 'location') {
        openResultsModal({
          title: 'All Registered Laptops',
          subtitle: 'Fleet overview across all locations',
          filters: {}
        });
      } else if (type === 'rasIdleLocation') {
        setSelectedRasIdleLocation('ALL');
        setRasIdleModalOpen(true);
      }
      return;
    }

    if (type === 'allocation') {
      const valLower = (value || '').toLowerCase();
      if (valLower.includes('lost')) {
        openResultsModal({
          title: 'Lost Laptops',
          subtitle: 'Laptops whose assigned employee was missing during initial RAS baseline',
          filters: { status: 'Allocated', rasStatus: 'LOST', isLost: true }
        });
      } else if (valLower.includes('stock')) {
        openResultsModal({
          title: 'In Stock Laptops',
          subtitle: 'Laptops currently available in project inventory',
          filters: { status: 'In Stock' }
        });
      } else if (valLower.includes('allocat')) {
        openResultsModal({
          title: 'Allocated Laptops',
          subtitle: 'All laptops currently assigned to employees',
          filters: { status: 'Allocated' }
        });
      } else {
        openResultsModal({
          title: 'All Registered Laptops',
          subtitle: 'Fleet overview from Allocation chart',
          filters: {}
        });
      }
    } else if (type === 'stockAge') {
      let min = null;
      let max = null;
      if (value.includes('0–30') || value.includes('0-30')) { min = 0; max = 30; }
      else if (value.includes('31–60') || value.includes('31-60')) { min = 31; max = 60; }
      else if (value.includes('61–90') || value.includes('61-90')) { min = 61; max = 90; }
      else if (value.includes('90')) { min = 91; max = null; }

      openResultsModal({
        title: `Stock Ageing: ${value}`,
        subtitle: `In-stock laptops within ${value} duration window`,
        filters: {
          status: 'In Stock',
          stockAge: value,
          stockAgeMin: min,
          stockAgeMax: max
        }
      });
    } else if (type === 'rasStatus') {
      const valUpper = (value || '').toUpperCase();
      if (valUpper === 'ACTIVE') {
        openResultsModal({
          title: 'RAS Active Laptops',
          subtitle: 'Allocated laptops whose assigned staff is currently present in accepted RAS',
          filters: { status: 'Allocated', rasStatus: 'ACTIVE', isLost: false }
        });
      } else if (valUpper === 'LOST') {
        openResultsModal({
          title: 'Lost Laptops',
          subtitle: 'Laptops whose assigned staff was missing at initial RAS baseline',
          filters: { status: 'Allocated', rasStatus: 'LOST', isLost: true }
        });
      } else if (valUpper.includes('NOT')) {
        openResultsModal({
          title: 'Not in UHG Laptops',
          subtitle: 'Allocated laptops whose assigned staff exited from subsequent RAS roster',
          filters: { status: 'Allocated', rasStatus: 'NOT_IN_UHG', isLost: false }
        });
      } else {
        openResultsModal({
          title: `RAS Status: ${value}`,
          subtitle: 'Allocated laptops matching this workforce status',
          filters: { status: 'Allocated', rasStatus: valUpper }
        });
      }
    } else if (type === 'lwdRisk') {
      const d = new Date();
      d.setHours(0, 0, 0, 0);

      let fromStr = '';
      let toStr = '';
      let isWindow = false;

      const valLower = (value || '').toLowerCase();
      if (valLower.includes('overdue')) {
        const yesterday = new Date(d);
        yesterday.setDate(yesterday.getDate() - 1);
        toStr = formatDateStr(yesterday);
      } else if (value.includes('0–7') || value.includes('0-7')) {
        const plus7 = new Date(d);
        plus7.setDate(plus7.getDate() + 7);
        fromStr = formatDateStr(d);
        toStr = formatDateStr(plus7);
      } else if (value.includes('8–15') || value.includes('8-15')) {
        const plus8 = new Date(d);
        plus8.setDate(plus8.getDate() + 8);
        const plus15 = new Date(d);
        plus15.setDate(plus15.getDate() + 15);
        fromStr = formatDateStr(plus8);
        toStr = formatDateStr(plus15);
      } else if (value.includes('15') || value.includes('> 15')) {
        const plus16 = new Date(d);
        plus16.setDate(plus16.getDate() + 16);
        fromStr = formatDateStr(plus16);
      } else {
        isWindow = true;
      }

      openResultsModal({
        title: `LWD Exit Risk: ${value}`,
        subtitle: `Allocated laptops with Last Working Day in ${value} window`,
        filters: {
          status: 'Allocated',
          lwdFrom: fromStr || undefined,
          lwdTo: toStr || undefined,
          lwdApproaching15Days: isWindow
        }
      });
    } else if (type === 'location') {
      openResultsModal({
        title: `Laptops in ${value}`,
        subtitle: `Asset inventory assigned or in stock at ${value}`,
        filters: { location: value }
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Top KPI Hierarchy Cards */}
      <KpiCards
        summary={summary}
        onOpenResultsModal={openResultsModal}
        onOpenRasIdleModal={() => {
          setSelectedRasIdleLocation('ALL');
          setRasIdleModalOpen(true);
        }}
      />

      {/* 2. Operational Analytics Charts */}
      <DashboardCharts
        charts={charts}
        onChartClick={handleChartClick}
        onOpenLocationModal={(loc) => {
          openResultsModal({
            title: `Laptops in ${loc}`,
            subtitle: `Asset inventory assigned or in stock at ${loc}`,
            filters: { location: loc }
          });
        }}
        onOpenRasIdleModal={(loc) => {
          setSelectedRasIdleLocation(loc || 'ALL');
          setRasIdleModalOpen(true);
        }}
      />

      {/* 3. Reusable Centered Laptop Results Modal */}
      {resultsModal.isOpen && (
        <LaptopResultsModal
          isOpen={resultsModal.isOpen}
          title={resultsModal.title}
          subtitle={resultsModal.subtitle}
          initialFilters={resultsModal.filters}
          onClose={closeResultsModal}
          onSelectLaptop={(lap) => setSelectedLaptop(lap)}
        />
      )}

      {/* 4. Audit History Lifecycle Modal */}
      {selectedLaptop && (
        <AuditModal
          laptop={selectedLaptop}
          onClose={() => setSelectedLaptop(null)}
        />
      )}

      {/* 5. RAS Idle Workforce Centered Modal */}
      {rasIdleModalOpen && (
        <RasIdleModal
          initialLocation={selectedRasIdleLocation}
          onClose={() => setRasIdleModalOpen(false)}
        />
      )}
    </div>
  );
}
