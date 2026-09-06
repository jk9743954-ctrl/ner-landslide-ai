import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { RiskBadge } from '../common/RiskBadge';

export const CurrentRiskCard: React.FC = () => {
  const {
    activeZone,
    simulatedRainfall,
    dynamicRiskScore,
    dynamicRiskLevel,
    dynamicSoilMoisture,
    dynamicGroundDisplacement,
    navigateTo,
  } = useSimulation();

  // Dynamic styling based on current risk level
  const getCardTheme = () => {
    switch (dynamicRiskLevel) {
      case 'CRITICAL':
        return {
          border: 'border-red-600/90 shadow-red-950/50',
          gradient: 'from-red-950/70 via-slate-900 to-slate-950',
          titleColor: 'text-red-400',
          ringColor: 'stroke-red-500',
          meterBg: 'bg-red-500',
          statusText: 'text-red-200',
        };
      case 'HIGH':
        return {
          border: 'border-orange-500/90 shadow-orange-950/50',
          gradient: 'from-orange-950/70 via-slate-900 to-slate-950',
          titleColor: 'text-orange-400',
          ringColor: 'stroke-orange-500',
          meterBg: 'bg-orange-500',
          statusText: 'text-orange-200',
        };
      case 'MODERATE':
        return {
          border: 'border-amber-500/80 shadow-amber-950/40',
          gradient: 'from-amber-950/60 via-slate-900 to-slate-950',
          titleColor: 'text-amber-400',
          ringColor: 'stroke-amber-400',
          meterBg: 'bg-amber-400',
          statusText: 'text-amber-200',
        };
      case 'LOW':
      default:
        return {
          border: 'border-emerald-600/70 shadow-emerald-950/30',
          gradient: 'from-emerald-950/50 via-slate-900 to-slate-950',
          titleColor: 'text-emerald-400',
          ringColor: 'stroke-emerald-400',
          meterBg: 'bg-emerald-400',
          statusText: 'text-emerald-200',
        };
    }
  };

  const theme = getCardTheme();

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-b ${theme.gradient} border-2 ${theme.border} p-5 sm:p-6 shadow-2xl transition-all duration-300`}
    >
      {/* Background Watermark */}
      <div className="absolute top-2 right-3 text-[10px] font-mono uppercase tracking-widest text-slate-500/60 select-none">
        Simulated prototype data
      </div>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            CURRENT LANDSLIDE RISK
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5 flex items-center gap-2">
            <span>Monitoring Zone:</span>
            <span className="text-blue-300">{activeZone.name.split(' (')[0]}</span>
          </h2>
          <p className="text-xs text-slate-400">
            {activeZone.district}, {activeZone.state} • Elev: {activeZone.elevation}m
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <RiskBadge level={dynamicRiskLevel} size="lg" showPulse />
        </div>
      </div>

      {/* Main Score Gauge + Status Transition */}
      <div className="my-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Gauge */}
        <div className="md:col-span-5 flex items-center justify-center">
          <div className="relative flex h-36 w-36 items-center justify-center">
            {/* SVG Circular Meter */}
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
              <circle
                className={`${theme.ringColor} transition-all duration-700 ease-out`}
                strokeWidth="10"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * dynamicRiskScore) / 100}
                strokeLinecap="round"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
            </svg>

            {/* Score in center */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-white tracking-tight">
                {dynamicRiskScore}
              </span>
              <span className="text-[11px] font-bold uppercase text-slate-400">/ 100</span>
              <span className="text-[10px] font-semibold text-slate-400">Risk Score</span>
            </div>
          </div>
        </div>

        {/* Right: Status transition and details */}
        <div className="md:col-span-7 space-y-3">
          {/* Dynamic transition banner */}
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3 flex items-center justify-between">
            <span className="text-xs text-slate-300">Status Trend:</span>
            <div className="flex items-center space-x-1.5 text-xs font-bold font-mono">
              <span className="text-slate-400">{activeZone.previousRiskLevel}</span>
              <span className="text-slate-500">→</span>
              <span className={theme.statusText}>{dynamicRiskLevel}</span>
            </div>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-white">Expected Hazard Window: </span>
            <span className="font-medium text-amber-300">{activeZone.expectedRiskWindow}</span>
          </div>

          <div className="text-xs text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-300">Lithology / Strata: </span>
            {activeZone.soilType}
          </div>

          {/* Quick link to map */}
          <button
            onClick={() => navigateTo('/map')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
          >
            <span>View this zone on 8-state map</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Core Environmental Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-4 border-t border-slate-800/80">
        {/* Rainfall */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>🌧️ Rain (24h)</span>
          </div>
          <div className="text-lg font-black text-white font-mono">{simulatedRainfall} mm</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Threshold: 120 mm</div>
        </div>

        {/* Soil Moisture */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>💧 Moisture</span>
          </div>
          <div className="text-lg font-black text-white font-mono">{dynamicSoilMoisture}%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Saturation Level</div>
        </div>

        {/* Slope Angle */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>⛰️ Slope</span>
          </div>
          <div className="text-lg font-black text-white font-mono">{activeZone.slope}°</div>
          <div className="text-[10px] text-slate-400 mt-0.5">DEM Incline</div>
        </div>

        {/* Ground Movement */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>📡 Movement</span>
          </div>
          <div className="text-lg font-black text-white font-mono">{dynamicGroundDisplacement} mm</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Inclinometer Creep</div>
        </div>

        {/* Temperature */}
        <div className="col-span-2 sm:col-span-1 rounded-xl bg-slate-900/80 border border-slate-800 p-3">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>🌡️ Temp</span>
          </div>
          <div className="text-lg font-black text-white font-mono">{activeZone.temperature}°C</div>
          <div className="text-[10px] text-slate-400 mt-0.5">AWS Station</div>
        </div>
      </div>
    </div>
  );
};
