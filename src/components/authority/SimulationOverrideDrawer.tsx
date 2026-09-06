import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { RiskBadge } from '../common/RiskBadge';

export const SimulationOverrideDrawer: React.FC = () => {
  const {
    activeZone,
    simulatedRainfall,
    setSimulatedRainfall,
    dynamicRiskScore,
    dynamicRiskLevel,
    dynamicSoilMoisture,
    dynamicGroundDisplacement,
    runEscalationDemo,
    isEscalating,
  } = useSimulation();

  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border-2 border-indigo-500/50 p-5 shadow-2xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <span className="inline-flex h-3 w-3 rounded-full bg-amber-400 animate-ping" />
          <h3 className="text-sm font-black text-white uppercase tracking-wider">
            DEMO MODE • Real-Time Environmental Injector
          </h3>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            SIH CONTROL PANEL
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <RiskBadge level={dynamicRiskLevel} size="md" showPulse />
        </div>
      </div>

      <p className="text-xs text-slate-300">
        Simulate increasing rainfall, soil pore-pressure saturation, and ground displacement in{' '}
        <strong className="text-white">{activeZone.name}</strong> to test dynamic early-warning
        threshold response.
      </p>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {/* Rainfall Control */}
        <div className="space-y-1.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-semibold">🌧️ Rainfall Infiltration:</span>
            <span className="font-mono font-bold text-blue-400">{simulatedRainfall} mm</span>
          </div>
          <input
            type="range"
            min="20"
            max="220"
            step="5"
            value={simulatedRainfall}
            onChange={(e) => setSimulatedRainfall(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>20mm (Dry)</span>
            <span>220mm (Extreme)</span>
          </div>
        </div>

        {/* Soil Moisture Readout */}
        <div className="space-y-1.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-semibold">💧 Soil Moisture:</span>
            <span className="font-mono font-bold text-teal-400">{dynamicSoilMoisture}%</span>
          </div>
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                dynamicSoilMoisture > 80
                  ? 'bg-red-500'
                  : dynamicSoilMoisture > 60
                  ? 'bg-amber-500'
                  : 'bg-teal-500'
              }`}
              style={{ width: `${dynamicSoilMoisture}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Matric Suction</span>
            <span>{dynamicSoilMoisture > 80 ? 'Liquefaction Risk' : 'Cohesion Stable'}</span>
          </div>
        </div>

        {/* Ground Movement Readout */}
        <div className="space-y-1.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-semibold">📡 Borehole Creep:</span>
            <span className="font-mono font-bold text-orange-400">
              {dynamicGroundDisplacement} mm
            </span>
          </div>
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.round((dynamicGroundDisplacement / 20) * 100))}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>In-Place Inclinometer</span>
            <span>{dynamicGroundDisplacement > 10 ? 'Rapid Slip' : 'Slow Creep'}</span>
          </div>
        </div>
      </div>

      {/* Aggregate Score & Quick Demo Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800">
        <div className="flex items-center space-x-3 text-xs">
          <span className="text-slate-400">Calculated Safety Factor Index:</span>
          <span className="font-mono font-black text-sm text-white bg-slate-800 px-2.5 py-1 rounded">
            {dynamicRiskScore}/100
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            (System state: {dynamicRiskLevel})
          </span>
        </div>

        <button
          onClick={runEscalationDemo}
          disabled={isEscalating}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-xs shadow-md transition-transform transform hover:scale-[1.02]"
        >
          {isEscalating ? 'Escalation In Progress...' : '▶ Run Escalation Sequence'}
        </button>
      </div>
    </div>
  );
};
