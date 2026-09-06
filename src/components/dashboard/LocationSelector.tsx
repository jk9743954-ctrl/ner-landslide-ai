import React from 'react';
import { useSimulation } from '../../context/SimulationContext';

export const LocationSelector: React.FC = () => {
  const {
    activeZone,
    setActiveZone,
    allZones,
    locationStatus,
    locationMessage,
    requestUserLocation,
    userCoords,
    setSimulatedRainfall,
  } = useSimulation();

  const handleZoneChange = (zoneId: string) => {
    const found = allZones.find((z) => z.id === zoneId);
    if (found) {
      setActiveZone(found);
      setSimulatedRainfall(found.rainfall24h);
    }
  };

  return (
    <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Location indicator */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-slate-200">Your Current Location</span>
            {locationStatus === 'granted' ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                ● GPS ACTIVE
              </span>
            ) : locationStatus === 'denied' || locationStatus === 'fallback' ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-700">
                DEMO LOCATION
              </span>
            ) : null}
          </div>

          <p className="text-xs text-slate-400">
            {locationMessage}
          </p>

          {userCoords && (
            <p className="text-[11px] font-mono text-slate-500">
              Coordinates: {userCoords[0].toFixed(4)}° N, {userCoords[1].toFixed(4)}° E
            </p>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={requestUserLocation}
            disabled={locationStatus === 'loading'}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white text-xs font-bold shadow-md transition-colors"
          >
            <span>📍</span>
            <span>{locationStatus === 'loading' ? 'Locating...' : 'Use My Location'}</span>
          </button>

          {/* Quick Zone Switcher */}
          <div className="relative">
            <select
              value={activeZone.id}
              onChange={(e) => handleZoneChange(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer pr-8 font-medium"
              aria-label="Select Monitoring Zone"
            >
              {allZones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.state}: {z.name.split(' (')[0]} ({z.riskLevel})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
