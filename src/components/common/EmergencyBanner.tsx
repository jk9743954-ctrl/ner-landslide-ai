import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { RiskBadge } from './RiskBadge';

export const EmergencyBanner: React.FC = () => {
  const {
    dynamicRiskLevel,
    activeZone,
    simulatedRainfall,
    navigateTo,
    showEmergencyModal,
    dismissEmergencyModal,
    showSafeAreasModal,
    setShowSafeAreasModal,
  } = useSimulation();

  const isCritical = dynamicRiskLevel === 'CRITICAL';
  const isHigh = dynamicRiskLevel === 'HIGH';

  if (!isCritical && !isHigh && !showEmergencyModal) {
    return null;
  }

  return (
    <>
      {/* Top sticky persistent warning strip when in High/Critical */}
      <div
        className={`w-full border-b transition-all duration-300 ${
          isCritical
            ? 'bg-red-950/90 border-red-600/80 text-red-100'
            : 'bg-orange-950/90 border-orange-600/80 text-orange-100'
        }`}
        role="alert"
      >
        <div className="mx-auto max-w-7xl px-3 py-2.5 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-start sm:items-center space-x-2.5">
              <span className="text-xl sm:text-2xl animate-bounce">⚠️</span>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold uppercase text-xs sm:text-sm tracking-wider">
                    {isCritical ? '🚨 CRITICAL LANDSLIDE RISK ALERT' : '⚠️ ELEVATED LANDSLIDE RISK ALERT'}
                  </span>
                  <RiskBadge level={dynamicRiskLevel} size="sm" showPulse />
                </div>
                <p className="text-xs text-slate-200 mt-0.5">
                  Elevated landslide risk detected in{' '}
                  <span className="font-semibold text-white underline">{activeZone.name}</span>.
                  Heavy rainfall ({simulatedRainfall} mm) and elevated slope instability indicators have increased the risk level.
                  Follow instructions from local disaster-management authorities.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
              <button
                onClick={() => setShowSafeAreasModal(true)}
                className="px-3 py-1 text-xs font-bold rounded bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-700 shadow-sm transition-colors"
              >
                Safe Shelters
              </button>
              <button
                onClick={() => navigateTo('/safety')}
                className={`px-3 py-1 text-xs font-bold rounded shadow-sm text-white transition-colors ${
                  isCritical ? 'bg-red-600 hover:bg-red-500' : 'bg-orange-600 hover:bg-orange-500'
                }`}
              >
                Safety Guide
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pop-up Emergency Modal when triggered by Escalation Demo */}
      {showEmergencyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-xl bg-slate-900 border-2 border-red-600 shadow-2xl p-6 text-white text-left relative">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600/20 text-red-400 text-2xl border border-red-500/50">
                🚨
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-red-400">
                  CRITICAL HAZARD WARNING
                </h3>
                <p className="text-xs text-slate-400">Simulated Emergency Alert Protocol</p>
              </div>
            </div>

            <div className="rounded-lg bg-red-950/40 border border-red-800/60 p-3.5 mb-4 text-xs space-y-2 text-slate-200">
              <p className="font-semibold text-white">
                Zone: <span className="text-red-300">{activeZone.name}</span>
              </p>
              <p>
                Simulated precipitation reached <span className="font-bold text-red-300">{simulatedRainfall} mm</span>.
                Borehole soil pore water saturation has surpassed the geotechnical stability factor of safety threshold (FS &lt; 1.0).
              </p>
              <p className="text-[11px] text-amber-300/90 font-mono">
                NOTICE: This is a demonstration escalation scenario for the SIH prototype.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-300 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400">✓</span>
                <span>Avoid cutting faces and steep valley trails</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400">✓</span>
                <span>Keep emergency document kits and radios on hand</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400">✓</span>
                <span>Standby for SDRF/District Magistrate advisories</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={() => {
                  dismissEmergencyModal();
                  setShowSafeAreasModal(true);
                }}
                className="w-full py-2 px-4 rounded-lg bg-red-600 hover:bg-red-500 font-bold text-xs tracking-wide shadow-lg text-white transition-colors"
              >
                View Safe Areas & Shelters
              </button>
              <button
                onClick={dismissEmergencyModal}
                className="w-full py-2 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Acknowledge Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safe Areas Modal */}
      {showSafeAreasModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-white text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>🏛️</span> Designated Safe Evacuation Shelters
                </h3>
                <p className="text-xs text-slate-400">
                  Assigned assembly points for {activeZone.name}
                </p>
              </div>
              <button
                onClick={() => setShowSafeAreasModal(false)}
                className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {activeZone.safeEvacuationAreas.map((shelter, idx) => (
                <div
                  key={idx}
                  className="rounded-lg bg-slate-800/80 border border-slate-700 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-blue-300">{shelter.name}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-900/60 text-blue-200 border border-blue-700/50">
                        {shelter.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Distance: <span className="font-semibold text-emerald-400">{shelter.distance}</span> • Capacity:{' '}
                      <span className="font-semibold text-white">{shelter.capacity} persons</span>
                    </p>
                  </div>
                  <a
                    href={`tel:${shelter.contact}`}
                    className="inline-flex items-center justify-center px-3 py-1.5 rounded bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 text-xs font-semibold shrink-0"
                  >
                    📞 {shelter.contact}
                  </a>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-blue-950/40 border border-blue-800/40 p-3 text-xs text-slate-300 mb-4">
              <p className="font-semibold text-blue-300 mb-1">Evacuation Protocol Tip:</p>
              <p>
                Follow ridge crest paths or designated paved collector roads. Never take shortcuts
                through steep gully lines or stream crossings during continuous precipitation.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowSafeAreasModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
