import React from 'react';
import { useSimulation } from '../../context/SimulationContext';

export const RiskExplanation: React.FC = () => {
  const {
    activeZone,
    simulatedRainfall,
    dynamicSoilMoisture,
    dynamicGroundDisplacement,
    dynamicRiskLevel,
    dynamicTrigger,
    navigateTo,
  } = useSimulation();

  // Factor normalized severity values (0 - 100%)
  const rainSeverity = Math.min(100, Math.round((simulatedRainfall / 180) * 100));
  const moistureSeverity = Math.min(100, dynamicSoilMoisture);
  const slopeSeverity = Math.min(100, Math.round((activeZone.slope / 50) * 100));
  const movementSeverity = Math.min(100, Math.round((dynamicGroundDisplacement / 15) * 100));

  const getSeverityBadge = (val: number) => {
    if (val >= 80) return { label: 'Severe Impact', color: 'text-red-400 bg-red-950 border-red-800' };
    if (val >= 55) return { label: 'Elevated Impact', color: 'text-orange-400 bg-orange-950 border-orange-800' };
    if (val >= 35) return { label: 'Moderate Impact', color: 'text-amber-400 bg-amber-950 border-amber-800' };
    return { label: 'Normal / Low', color: 'text-emerald-400 bg-emerald-950 border-emerald-800' };
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-5">
      {/* Title & dynamic explanation summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <span>🔍</span> Why is the risk {dynamicRiskLevel.toLowerCase()}?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {dynamicRiskLevel === 'CRITICAL' || dynamicRiskLevel === 'HIGH'
              ? `Risk has escalated due to cumulative rainfall (${simulatedRainfall} mm), elevated pore-water saturation (${dynamicSoilMoisture}%), and steep terrain (${activeZone.slope}°) in ${activeZone.name.split(' (')[0]}.`
              : `Current baseline sensors in ${activeZone.name.split(' (')[0]} indicate manageable slope equilibrium, though continuous precipitation requires observation.`}
          </p>
        </div>

        {/* Ask NER AI button */}
        <button
          onClick={() => navigateTo('/ai-assistant')}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all shrink-0 self-start sm:self-auto"
        >
          <span>🤖</span>
          <span>Ask NER AI</span>
        </button>
      </div>

      {/* Dynamic Trigger description */}
      <div className="rounded-xl bg-slate-800/60 border border-slate-700/60 p-3.5 text-xs text-slate-300">
        <span className="font-bold text-blue-300">Dominant Physical Trigger: </span>
        <span>{dynamicTrigger}</span>
      </div>

      {/* 4 Contributing Factors Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Factor 1: Heavy Rainfall */}
        <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-white flex items-center gap-2">
              <span>🌧️</span> Heavy Rainfall
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                getSeverityBadge(rainSeverity).color
              }`}
            >
              {getSeverityBadge(rainSeverity).label}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            24-hour accumulation: <strong className="text-slate-200">{simulatedRainfall} mm</strong>.
            Surface runoff and infiltration raise internal pore pressure across the slip plane.
          </p>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                rainSeverity > 75 ? 'bg-red-500' : rainSeverity > 50 ? 'bg-orange-500' : 'bg-blue-500'
              }`}
              style={{ width: `${rainSeverity}%` }}
            />
          </div>
        </div>

        {/* Factor 2: High Soil Moisture */}
        <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-white flex items-center gap-2">
              <span>💧</span> High Soil Moisture
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                getSeverityBadge(moistureSeverity).color
              }`}
            >
              {getSeverityBadge(moistureSeverity).label}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Soil water saturation: <strong className="text-slate-200">{dynamicSoilMoisture}%</strong>.
            Over-saturation degrades matric suction, dissolving cohesion between soil particles.
          </p>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                moistureSeverity > 80 ? 'bg-red-500' : moistureSeverity > 60 ? 'bg-amber-500' : 'bg-teal-500'
              }`}
              style={{ width: `${moistureSeverity}%` }}
            />
          </div>
        </div>

        {/* Factor 3: Steep Slope */}
        <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-white flex items-center gap-2">
              <span>⛰️</span> Steep Slope Gradient
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                getSeverityBadge(slopeSeverity).color
              }`}
            >
              {getSeverityBadge(slopeSeverity).label}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Terrain inclination: <strong className="text-slate-200">{activeZone.slope}°</strong>.
            Himalayan slopes exceeding 30° experience elevated gravitational shear driving forces.
          </p>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                slopeSeverity > 75 ? 'bg-red-500' : slopeSeverity > 55 ? 'bg-orange-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${slopeSeverity}%` }}
            />
          </div>
        </div>

        {/* Factor 4: Ground Movement */}
        <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-white flex items-center gap-2">
              <span>📡</span> Ground Movement (Inclinometer)
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                getSeverityBadge(movementSeverity).color
              }`}
            >
              {getSeverityBadge(movementSeverity).label}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Cumulative creep: <strong className="text-slate-200">{dynamicGroundDisplacement} mm</strong>.
            Sub-surface lateral displacement detected by wireless in-place MEMS sensor nodes.
          </p>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                movementSeverity > 70 ? 'bg-red-500' : movementSeverity > 40 ? 'bg-orange-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${movementSeverity}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
