import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { RiskBadge } from '../common/RiskBadge';

export const SimulationControls: React.FC = () => {
  const {
    simulatedRainfall,
    setSimulatedRainfall,
    dynamicRiskScore,
    dynamicRiskLevel,
    dynamicSoilMoisture,
    dynamicGroundDisplacement,
    isEscalating,
    escalationStep,
    runEscalationDemo,
    stopEscalationDemo,
  } = useSimulation();

  const presets = [
    { rain: 40, label: '40 mm', level: 'LOW' as const, note: 'Normal Monsoon Rain' },
    { rain: 80, label: '80 mm', level: 'MODERATE' as const, note: 'Sustained Showers' },
    { rain: 120, label: '120 mm', level: 'HIGH' as const, note: 'Heavy Downpour' },
    { rain: 160, label: '160 mm', level: 'CRITICAL' as const, note: 'Cloudburst Warning' },
    { rain: 200, label: '200+ mm', level: 'CRITICAL' as const, note: 'Extreme Precipitation' },
  ];

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-indigo-500/40 p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">🧪</span>
            <h3 className="text-lg font-black text-white tracking-tight uppercase">
              LIVE RISK SIMULATION
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/40 tracking-wider">
              SIH PRESENTATION TOOL
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Simulate worsening environmental conditions to demonstrate real-time risk escalation.
            (Educational demonstration simulation).
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <RiskBadge level={dynamicRiskLevel} size="md" showPulse />
        </div>
      </div>

      {/* Escalation Demo Banner / Controller */}
      <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm text-white">Automated Presentation Sequence</span>
            {isEscalating && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-700 animate-pulse">
                ● RUNNING LIVE SCENARIO
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {isEscalating
              ? escalationStep
              : 'Sequentially progresses through LOW → MODERATE → HIGH → CRITICAL with audio alerts and triggers emergency protocols.'}
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {isEscalating ? (
            <button
              onClick={stopEscalationDemo}
              className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white font-bold text-xs shadow-md transition-colors"
            >
              ⏹ Stop Simulation
            </button>
          ) : (
            <button
              onClick={runEscalationDemo}
              className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-orange-600/30 flex items-center space-x-2 transition-transform transform hover:scale-[1.02]"
            >
              <span>▶</span>
              <span>Run Risk Escalation Demo</span>
            </button>
          )}
        </div>
      </div>

      {/* Manual Slider Control */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="rainfall-slider" className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5">
            <span>🌧️ Simulated 24h Rainfall:</span>
            <span className="text-base font-black text-blue-400 font-mono">
              {simulatedRainfall} mm
            </span>
          </label>
          <div className="text-xs text-slate-400 font-mono">
            Score: <span className="font-bold text-white">{dynamicRiskScore}/100</span> | Moisture:{' '}
            <span className="font-bold text-white">{dynamicSoilMoisture}%</span> | Displacement:{' '}
            <span className="font-bold text-white">{dynamicGroundDisplacement} mm</span>
          </div>
        </div>

        <input
          id="rainfall-slider"
          type="range"
          min="20"
          max="240"
          step="5"
          value={simulatedRainfall}
          onChange={(e) => setSimulatedRainfall(Number(e.target.value))}
          disabled={isEscalating}
          className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50"
          aria-label="Simulated Rainfall Slider"
        />

        {/* Preset quick buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
          {presets.map((p) => {
            const isSelected = Math.abs(simulatedRainfall - p.rain) <= 10;
            return (
              <button
                key={p.rain}
                type="button"
                onClick={() => setSimulatedRainfall(p.rain)}
                disabled={isEscalating}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-600/30 border-blue-400 text-white shadow-md'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs font-mono">{p.label}</span>
                  <RiskBadge level={p.level} size="sm" />
                </div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">{p.note}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Methodological Disclaimer */}
      <p className="mt-4 text-[11px] text-slate-500 leading-relaxed border-t border-slate-800/80 pt-3">
        * <strong>Notice:</strong> This interactive slider illustrates how the early warning
        pipeline dynamically synthesizes multi-factor sensor feeds. Threshold transitions shown
        (40mm → LOW, 80mm → MODERATE, 120mm → HIGH, 160+mm → CRITICAL) are modeled for hackathon
        demonstrations and can be calibrated per geological zone when live sensor arrays are integrated.
      </p>
    </div>
  );
};
