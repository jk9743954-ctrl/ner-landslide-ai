import React, { useEffect, useRef, useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { MonitoringZone, RiskLevel, NEState } from '../../types/risk';
import { RiskBadge } from '../common/RiskBadge';

// Declare Leaflet global type
declare const L: any;

export const RiskMap: React.FC = () => {
  const {
    allZones,
    activeZone,
    setActiveZone,
    userCoords,
    navigateTo,
    setShowSafeAreasModal,
  } = useSimulation();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [selectedZone, setSelectedZone] = useState<MonitoringZone>(activeZone);
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [filterState, setFilterState] = useState<string>('ALL');
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  // Colors for markers
  const getColorForLevel = (level: RiskLevel): string => {
    switch (level) {
      case 'CRITICAL':
        return '#EF4444'; // Red
      case 'HIGH':
        return '#F97316'; // Orange
      case 'MODERATE':
        return '#F59E0B'; // Amber
      case 'LOW':
      default:
        return '#10B981'; // Emerald
    }
  };

  // Filtered zones
  const filteredZones = allZones.filter((zone) => {
    const matchLevel = filterLevel === 'ALL' || zone.riskLevel === filterLevel;
    const matchState = filterState === 'ALL' || zone.state === filterState;
    return matchLevel && matchState;
  });

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (typeof L === 'undefined') {
      console.warn('Leaflet script not found on window, fallback mode');
      return;
    }

    // Centered around Northeast India [25.9, 92.8]
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [25.9, 92.8],
        zoom: 7,
        minZoom: 6,
        maxZoom: 14,
        zoomControl: false,
      });

      // Add zoom control on top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Add CartoDB Dark Matter / OSM tiles
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }
      ).addTo(map);

      mapInstanceRef.current = map;
      setMapLoaded(true);
    }

    return () => {
      // Keep instance alive during state updates
    };
  }, []);

  // Update Markers whenever filtered zones change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || typeof L === 'undefined') return;

    // Clear existing markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    // Add user location marker if available
    if (userCoords) {
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `<div style="background-color: #2563EB; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(37,99,235,0.8); animation: pulse 1.5s infinite;"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      const userMarker = L.marker(userCoords, { icon: userIcon }).bindPopup(
        `<strong>📍 Your Current Location</strong><br/>Lat: ${userCoords[0].toFixed(4)}, Lng: ${userCoords[1].toFixed(4)}`
      );
      userMarker.addTo(map);
      markersRef.current.push(userMarker);
    }

    // Add zone markers
    filteredZones.forEach((zone) => {
      const color = getColorForLevel(zone.riskLevel);
      const isCritical = zone.riskLevel === 'CRITICAL';
      const isHigh = zone.riskLevel === 'HIGH';

      // Circle marker
      const circle = L.circleMarker(zone.coordinates, {
        radius: isCritical ? 14 : isHigh ? 11 : 9,
        fillColor: color,
        color: '#FFFFFF',
        weight: 2,
        opacity: 0.9,
        fillOpacity: 0.85,
      });

      // Tooltip on hover
      circle.bindTooltip(
        `<strong>${zone.name.split(' (')[0]}</strong><br/>Risk: ${zone.riskLevel} (${zone.riskScore}/100)`,
        { direction: 'top', offset: [0, -10] }
      );

      // Click event
      circle.on('click', () => {
        setSelectedZone(zone);
        setActiveZone(zone);
        setIsPanelOpen(true);
        map.panTo(zone.coordinates, { animate: true, duration: 0.8 });
      });

      circle.addTo(map);
      markersRef.current.push(circle);

      // Pulse ring for Critical/High
      if (isCritical || isHigh) {
        const pulseCircle = L.circle(zone.coordinates, {
          radius: isCritical ? 12000 : 8000,
          color: color,
          fillColor: color,
          fillOpacity: 0.15,
          weight: 1,
        });
        pulseCircle.addTo(map);
        markersRef.current.push(pulseCircle);
      }
    });
  }, [filteredZones, userCoords, setActiveZone]);

  // Handle clicking a state filter
  const states: NEState[] = [
    'Meghalaya',
    'Assam',
    'Arunachal Pradesh',
    'Manipur',
    'Mizoram',
    'Nagaland',
    'Tripura',
    'Sikkim',
  ];

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-950 text-slate-100">
      {/* Top Filter & Legend Floating Bar */}
      <div className="absolute top-3 left-3 right-3 sm:right-auto sm:max-w-xl z-20 flex flex-col gap-2">
        <div className="rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h2 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
              <span>🗺️</span> Northeast Landslide Risk Map
            </h2>
            <span className="text-[10px] font-mono text-slate-400">
              Showing {filteredZones.length} of {allZones.length} Zones
            </span>
          </div>

          {/* Risk Level Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map((lvl) => {
              const isSelected = filterLevel === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => setFilterLevel(lvl)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {lvl === 'ALL' ? 'All Risks' : lvl}
                </button>
              );
            })}

            {/* State selector */}
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="ml-auto bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-semibold rounded-md px-2 py-1 outline-none cursor-pointer"
            >
              <option value="ALL">All 8 States</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Leaflet Map Viewport */}
      <div ref={mapContainerRef} className="h-full w-full z-10" />

      {/* Fallback overlay if map tile loading fails */}
      {!mapLoaded && (
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-slate-900 text-slate-300">
          <div className="text-center p-6 space-y-2">
            <span className="text-4xl animate-bounce inline-block">🗺️</span>
            <p className="font-bold text-sm">Loading Northeast India Geospatial Grid...</p>
            <p className="text-xs text-slate-500">Connecting to OpenStreetMap tiles</p>
          </div>
        </div>
      )}

      {/* Map Legend (Bottom Left) */}
      <div className="absolute bottom-20 sm:bottom-4 left-3 z-20 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 shadow-lg text-xs space-y-1.5 hidden xs:block">
        <div className="font-bold text-slate-300 text-[11px] uppercase tracking-wider mb-1">
          Map Legend
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-3 w-3 rounded-full bg-red-500 border border-white" />
          <span className="text-slate-300">Critical Risk (85–100)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-3 w-3 rounded-full bg-orange-500 border border-white" />
          <span className="text-slate-300">High Risk (65–84)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-3 w-3 rounded-full bg-amber-400 border border-white" />
          <span className="text-slate-300">Moderate (35–64)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-3 w-3 rounded-full bg-emerald-400 border border-white" />
          <span className="text-slate-300">Low Risk (0–34)</span>
        </div>
        <div className="flex items-center space-x-2 pt-1 border-t border-slate-800">
          <span className="h-3 w-3 rounded-full bg-blue-600 border border-white" />
          <span className="text-slate-400 font-mono text-[11px]">📍 Your Location</span>
        </div>
      </div>

      {/* Detailed Slide-Over Information Panel (Requirement #6) */}
      {selectedZone && (
        <div
          className={`absolute top-0 right-0 bottom-0 z-30 w-full sm:w-96 bg-slate-900/95 backdrop-blur-lg border-l border-slate-800 p-5 shadow-2xl transition-transform duration-300 overflow-y-auto ${
            isPanelOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Close / Toggle Button */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs text-blue-400 font-bold">{selectedZone.code}</span>
              <span className="text-[10px] text-slate-500">•</span>
              <span className="text-xs text-slate-400">{selectedZone.state}</span>
            </div>
            <button
              onClick={() => setIsPanelOpen(false)}
              className="h-7 w-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-bold"
            >
              ✕
            </button>
          </div>

          {/* Zone Title */}
          <h3 className="text-lg font-black text-white leading-snug">{selectedZone.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {selectedZone.district} District • Elev: {selectedZone.elevation}m
          </p>

          {/* Prototype simulated tag */}
          <div className="my-3 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono text-amber-300 text-center">
            Simulated Prototype Telemetry
          </div>

          {/* Risk Badge & Score */}
          <div className="my-4 rounded-xl bg-slate-800/80 border border-slate-700 p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Assessed Risk Level
              </span>
              <RiskBadge level={selectedZone.riskLevel} size="md" showPulse />
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Risk Score
              </span>
              <span className="text-xl font-black text-white font-mono">
                {selectedZone.riskScore}
                <span className="text-xs text-slate-400">/100</span>
              </span>
            </div>
          </div>

          {/* Sensor Readouts Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs mb-4">
            <div className="rounded-lg bg-slate-800/60 border border-slate-700/60 p-2.5">
              <span className="text-slate-400 block text-[11px]">🌧️ Rainfall (24h)</span>
              <span className="font-mono font-bold text-white text-sm">
                {selectedZone.rainfall24h} mm
              </span>
            </div>
            <div className="rounded-lg bg-slate-800/60 border border-slate-700/60 p-2.5">
              <span className="text-slate-400 block text-[11px]">💧 Soil Moisture</span>
              <span className="font-mono font-bold text-white text-sm">
                {selectedZone.soilMoisture}%
              </span>
            </div>
            <div className="rounded-lg bg-slate-800/60 border border-slate-700/60 p-2.5">
              <span className="text-slate-400 block text-[11px]">⛰️ Slope Gradient</span>
              <span className="font-mono font-bold text-white text-sm">{selectedZone.slope}°</span>
            </div>
            <div className="rounded-lg bg-slate-800/60 border border-slate-700/60 p-2.5">
              <span className="text-slate-400 block text-[11px]">📡 Ground Movement</span>
              <span className="font-mono font-bold text-white text-sm">
                {selectedZone.groundDisplacement} mm
              </span>
            </div>
          </div>

          {/* Primary Trigger */}
          <div className="space-y-1 rounded-lg bg-slate-800/60 border border-slate-700/60 p-3 text-xs mb-3">
            <span className="font-bold text-slate-300 block text-[11px]">Main Trigger:</span>
            <p className="text-slate-300 leading-relaxed">{selectedZone.primaryTrigger}</p>
          </div>

          {/* Expected Risk Window */}
          <div className="space-y-1 rounded-lg bg-slate-800/60 border border-slate-700/60 p-3 text-xs mb-4">
            <span className="font-bold text-slate-300 block text-[11px]">
              Expected Risk Window:
            </span>
            <p className="text-amber-300 font-semibold">{selectedZone.expectedRiskWindow}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                setActiveZone(selectedZone);
                navigateTo('/dashboard');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white shadow-md transition-colors text-center"
            >
              Monitor in Citizen Dashboard
            </button>

            <button
              onClick={() => {
                setActiveZone(selectedZone);
                setShowSafeAreasModal(true);
              }}
              className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold text-xs text-slate-300 transition-colors text-center"
            >
              View Safe Shelters ({selectedZone.safeEvacuationAreas.length})
            </button>

            <button
              onClick={() => navigateTo('/report')}
              className="w-full py-2 px-4 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-800/50 font-semibold text-xs text-red-300 transition-colors text-center"
            >
              Report Hazard at this Zone
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle button to reopen panel if closed */}
      {!isPanelOpen && selectedZone && (
        <button
          onClick={() => setIsPanelOpen(true)}
          className="absolute top-4 right-4 z-20 rounded-xl bg-slate-900/90 border border-slate-700 p-2.5 text-xs font-bold text-white shadow-xl flex items-center gap-1.5"
        >
          <span>📋</span>
          <span>View Zone Details</span>
        </button>
      )}
    </div>
  );
};
