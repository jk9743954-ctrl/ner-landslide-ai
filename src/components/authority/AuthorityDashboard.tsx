import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { EnvironmentalCharts } from './EnvironmentalCharts';
import { CitizenReportsList } from './CitizenReportsList';
import { SimulationOverrideDrawer } from './SimulationOverrideDrawer';
import { RiskBadge } from '../common/RiskBadge';
import { ActiveAlert, } from '../../types/risk';

export const AuthorityDashboard: React.FC = () => {
  const {
    allZones,
    activeZone,
    setActiveZone,
    activeAlerts,
    citizenReports,
    navigateTo,
  } = useSimulation();

  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [selectedAlert, setSelectedAlert] = useState<ActiveAlert | null>(null);

  // Statistics
  const totalMonitoredZones = 67; // Official network nodes count
  const criticalZonesCount = allZones.filter((z) => z.riskLevel === 'CRITICAL').length;
  const highRiskCount = allZones.filter((z) => z.riskLevel === 'HIGH').length;
  const activeAlertsCount = activeAlerts.length;
  const totalCitizenReports = citizenReports.length;

  const filteredZones = allZones.filter((z) => {
    if (filterRisk === 'ALL') return true;
    return z.riskLevel === filterRisk;
  });

  const handleAlertClick = (alert: ActiveAlert) => {
    setSelectedAlert(alert);
    const targetZone = allZones.find((z) => z.id === alert.zoneId);
    if (targetZone) {
      setActiveZone(targetZone);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-24 bg-[#070D1E] text-slate-100">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Control Room Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-blue-400 font-semibold mb-1">
              <span className="cursor-pointer hover:underline" onClick={() => navigateTo('/')}>
                Home
              </span>
              <span>/</span>
              <span className="text-slate-400">Emergency Operations</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-4 w-4 rounded-full bg-red-500 animate-ping" />
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                NER LANDSLIDE MONITORING CENTER
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Geotechnical Situation Room • National Disaster Management Framework
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
              ● SYSTEMS ONLINE
            </span>
            <button
              onClick={() => navigateTo('/map')}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-colors"
            >
              🗺️ Full Geospatial Grid
            </button>
          </div>
        </div>

        {/* Top 5 Key Statistics KPIs (Requirement #12) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Card 1: Monitored Zones */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg">
            <span className="text-[11px] font-bold uppercase text-slate-400 block tracking-wider">
              Monitored Zones
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                {totalMonitoredZones}
              </span>
              <span className="text-xs text-emerald-400 font-semibold">Active Nodes</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Across 8 NE States</p>
          </div>

          {/* Card 2: Critical */}
          <div className="rounded-2xl bg-red-950/40 border border-red-800/80 p-4 shadow-lg">
            <span className="text-[11px] font-bold uppercase text-red-300 block tracking-wider">
              Critical
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-red-400 font-mono">
                {criticalZonesCount}
              </span>
              <span className="text-xs text-red-400 font-bold animate-pulse">Red Alert</span>
            </div>
            <p className="text-[10px] text-red-300/70 mt-1">Slope Detachment Imminent</p>
          </div>

          {/* Card 3: High Risk */}
          <div className="rounded-2xl bg-orange-950/40 border border-orange-800/80 p-4 shadow-lg">
            <span className="text-[11px] font-bold uppercase text-orange-300 block tracking-wider">
              High Risk
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-orange-400 font-mono">
                {highRiskCount}
              </span>
              <span className="text-xs text-orange-400 font-semibold">Orange Alert</span>
            </div>
            <p className="text-[10px] text-orange-300/70 mt-1">Heavy Infiltration</p>
          </div>

          {/* Card 4: Active Alerts */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg">
            <span className="text-[11px] font-bold uppercase text-slate-400 block tracking-wider">
              Active Alerts
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                {activeAlertsCount}
              </span>
              <span className="text-xs text-amber-300 font-semibold">Broadcasted</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">CAP Early Warnings</p>
          </div>

          {/* Card 5: Citizen Reports */}
          <div className="col-span-2 sm:col-span-1 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg">
            <span className="text-[11px] font-bold uppercase text-slate-400 block tracking-wider">
              Citizen Reports
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">
                {totalCitizenReports}
              </span>
              <span className="text-xs text-blue-300 font-semibold">Crowdsourced</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Synchronized from App</p>
          </div>
        </div>

        {/* Demo Mode Environmental Condition Simulator (Requirement #27) */}
        <SimulationOverrideDrawer />

        {/* Main 2-Column Command Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Active Alerts Feed (Requirement #14) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">📢</span>
                  <h3 className="text-base font-black text-white tracking-wide uppercase">
                    ACTIVE ALERTS
                  </h3>
                </div>
                <span className="text-xs font-bold text-slate-400 font-mono">
                  {activeAlerts.length} Alerts
                </span>
              </div>

              <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
                {activeAlerts.map((alert) => {
                  const isSelected = selectedAlert?.id === alert.id || activeZone.id === alert.zoneId;
                  return (
                    <div
                      key={alert.id}
                      onClick={() => handleAlertClick(alert)}
                      className={`rounded-xl p-3.5 border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800 border-blue-500 shadow-md'
                          : 'bg-slate-800/60 border-slate-700/70 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <RiskBadge level={alert.riskLevel} size="sm" showPulse={isSelected} />
                          <span className="font-bold text-xs text-white truncate max-w-[180px]">
                            {alert.zoneName.split(' (')[0]}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {alert.issuedAt}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-slate-200 mt-2 line-clamp-2">
                        {alert.headline}
                      </h4>

                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {alert.description}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Pop. at Risk: ~{alert.affectedPopulation.toLocaleString()}</span>
                        <span className="font-bold text-blue-400 hover:underline">
                          Inspect Telemetry →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Authority Zone Matrix (Requirement #13) */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>🗺️</span> Monitored Zone Registry
                </h3>
                <div className="flex gap-1 text-[10px]">
                  {['ALL', 'CRITICAL', 'HIGH'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setFilterRisk(lvl)}
                      className={`px-2 py-0.5 rounded font-bold ${
                        filterRisk === lvl ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {filteredZones.slice(0, 8).map((z) => {
                  const isActive = activeZone.id === z.id;
                  return (
                    <div
                      key={z.id}
                      onClick={() => setActiveZone(z)}
                      className={`p-2.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-all ${
                        isActive
                          ? 'bg-blue-950/60 border-blue-500 text-white'
                          : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{z.name.split(' (')[0]}</div>
                        <div className="text-[10px] text-slate-400">
                          {z.state} • Rain: {z.rainfall24h}mm • Moisture: {z.soilMoisture}%
                        </div>
                      </div>
                      <div className="text-right">
                        <RiskBadge level={z.riskLevel} size="sm" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Telemetry Analytics + Citizen Queue */}
          <div className="lg:col-span-7 space-y-6">
            {/* Environmental Monitoring Charts (Requirement #16) */}
            <EnvironmentalCharts />

            {/* Citizen Reports Review Queue (Requirement #15) */}
            <CitizenReportsList />
          </div>
        </div>
      </div>
    </div>
  );
};
