import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { MOCK_STATE_SUMMARIES } from '../../data/mockRiskData';
import { RiskBadge } from '../common/RiskBadge';

export const LandingPage: React.FC = () => {
  const { navigateTo, allZones, activeAlerts } = useSimulation();

  const criticalAlertsCount = activeAlerts.filter((a) => a.riskLevel === 'CRITICAL').length;
  const highAlertsCount = activeAlerts.filter((a) => a.riskLevel === 'HIGH').length;

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-20 bg-gradient-to-b from-[#0B132B] via-[#101B39] to-[#0B132B] text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20 border-b border-slate-800/80">
        {/* Subtle decorative background topography lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Top Hackathon & Prototype Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-950/60 px-3 py-1 mb-6 text-xs text-blue-300 shadow-inner">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-ping" />
              <span className="font-semibold tracking-wide">SMART INDIA HACKATHON PROTOTYPE</span>
              <span className="text-slate-500">•</span>
              <span className="font-bold text-amber-400">DEMO TELEMETRY</span>
            </div>

            {/* Main Title & Hero */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Know the Risk <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-400">
                Before the Slope Moves.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="mt-5 text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Monitor real-time slope stability, pore-water pressure, and precipitation thresholds.
              Receive predictive location-based early warnings for landslide-vulnerable corridors
              across the 8 North Eastern States of India.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={() => navigateTo('/dashboard')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm md:text-base shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
              >
                <span>📍</span>
                <span>Check My Risk</span>
              </button>

              <button
                onClick={() => navigateTo('/map')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 border border-slate-700 hover:border-slate-600 font-bold text-sm md:text-base shadow-md flex items-center justify-center gap-2.5 transition-all"
              >
                <span>🗺️</span>
                <span>View Risk Map</span>
              </button>

              <button
                onClick={() => navigateTo('/ai-assistant')}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-200 border border-indigo-700/50 text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <span>🤖</span>
                <span>Ask NER AI</span>
              </button>
            </div>

            {/* Fast status metrics bar */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                  Monitored Zones
                </span>
                <span className="text-xl sm:text-2xl font-black text-white">{allZones.length} Nodes</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">8 States Covered</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                  Critical Zones
                </span>
                <span className="text-xl sm:text-2xl font-black text-red-400">
                  {criticalAlertsCount}
                </span>
                <span className="text-[10px] text-red-300/80 block mt-0.5">Immediate Danger</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                  High Risk Zones
                </span>
                <span className="text-xl sm:text-2xl font-black text-orange-400">
                  {highAlertsCount}
                </span>
                <span className="text-[10px] text-orange-300/80 block mt-0.5">Active Monitoring</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                  Early Warning SLA
                </span>
                <span className="text-xl sm:text-2xl font-black text-blue-400">6–12 Hrs</span>
                <span className="text-[10px] text-blue-300/80 block mt-0.5">Lead Time Window</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual representation of Northeast India with Risk Zones */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>⛰️</span> Northeast India Risk Distribution
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Geomorphological monitoring clusters covering all 8 North Eastern States
            </p>
          </div>
          <button
            onClick={() => navigateTo('/map')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Open Full Interactive Map</span>
            <span>→</span>
          </button>
        </div>

        {/* State Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_STATE_SUMMARIES.map((st) => {
            const hasCritical = st.criticalZones > 0;
            const hasHigh = st.highZones > 0;
            const badgeLevel = hasCritical ? 'CRITICAL' : hasHigh ? 'HIGH' : 'MODERATE';

            return (
              <div
                key={st.state}
                onClick={() => navigateTo('/map')}
                className="group relative rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/50 p-4 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-extrabold text-base text-white group-hover:text-blue-300 transition-colors">
                    {st.state}
                  </h3>
                  <RiskBadge level={badgeLevel} size="sm" />
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 mt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Zones:</span>
                    <span className="font-mono font-bold text-white">{st.totalZones}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Peak Risk Index:</span>
                    <span className="font-mono font-bold text-amber-300">{st.peakRiskScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active High/Crit:</span>
                    <span className="font-mono font-bold text-red-400">
                      {st.criticalZones + st.highZones} zones
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400 truncate">
                  <span className="font-semibold text-slate-300">Hazard Focus: </span>
                  {st.primaryActiveAlert}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Authority & Citizen Quick Gateways */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Citizen Risk Check */}
          <div
            onClick={() => navigateTo('/dashboard')}
            className="rounded-xl bg-gradient-to-br from-blue-950/50 to-slate-900 border border-blue-800/40 p-5 cursor-pointer hover:border-blue-600/60 transition-all"
          >
            <div className="text-2xl mb-2">📱</div>
            <h3 className="text-base font-bold text-white">Citizen Early Warning</h3>
            <p className="text-xs text-slate-300 mt-1">
              Use GPS location to determine nearest monitoring zone, calculate immediate slope risk,
              and find designated community disaster shelters.
            </p>
            <span className="inline-block mt-3 text-xs font-semibold text-blue-400">
              Open Citizen Dashboard →
            </span>
          </div>

          {/* Card 2: Report Hazard */}
          <div
            onClick={() => navigateTo('/report')}
            className="rounded-xl bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-800/40 p-5 cursor-pointer hover:border-amber-600/60 transition-all"
          >
            <div className="text-2xl mb-2">🚨</div>
            <h3 className="text-base font-bold text-white">Crowdsourced Hazard Report</h3>
            <p className="text-xs text-slate-300 mt-1">
              Spot a road crack, rockfall, or mudflow? Submit a geotagged photo report to alert
              disaster authorities and local highway teams.
            </p>
            <span className="inline-block mt-3 text-xs font-semibold text-amber-400">
              Submit Field Report →
            </span>
          </div>

          {/* Card 3: Authority Operations */}
          <div
            onClick={() => navigateTo('/authority')}
            className="rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-800/40 p-5 cursor-pointer hover:border-indigo-600/60 transition-all"
          >
            <div className="text-2xl mb-2">🏛️</div>
            <h3 className="text-base font-bold text-white">Disaster Operations Center</h3>
            <p className="text-xs text-slate-300 mt-1">
              Dedicated authority control room with telemetry time-series analytics, active alert
              broadcasts, and citizen report triaging.
            </p>
            <span className="inline-block mt-3 text-xs font-semibold text-indigo-400">
              Access Control Room →
            </span>
          </div>
        </div>
      </section>

      {/* Mandatory Disclaimer Footer */}
      <footer className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-4 border-t border-slate-800 text-center text-xs text-slate-500">
        <p className="max-w-3xl mx-auto">
          ⚠️ <span className="font-bold text-slate-400">Prototype Disclaimer:</span> This website is an
          educational prototype built for Smart India Hackathon (SIH). Risk information shown in
          this demonstration uses simulated data and is not an operational disaster warning system.
          Always follow instructions from official disaster-management authorities (NDMA / SDMA).
        </p>
      </footer>
    </div>
  );
};
