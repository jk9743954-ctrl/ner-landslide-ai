import React, { useState, useEffect } from 'react';
import { EnvironmentalTelemetry } from '../../types/risk';
import { riskService } from '../../services/riskService';
import { useSimulation } from '../../context/SimulationContext';

export const EnvironmentalCharts: React.FC = () => {
  const { activeZone } = useSimulation();
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [telemetry, setTelemetry] = useState<EnvironmentalTelemetry | null>(null);

  useEffect(() => {
    let isMounted = true;
    riskService.getEnvironmentalData(activeZone.id, timeRange).then((data) => {
      if (isMounted) setTelemetry(data);
    });
    return () => {
      isMounted = false;
    };
  }, [activeZone.id, timeRange]);

  if (!telemetry) {
    return (
      <div className="p-6 text-center text-xs text-slate-400">
        Loading environmental time series...
      </div>
    );
  }

  const series = telemetry.series;
  const maxRain = Math.max(...series.map((s) => s.rainfall), 100);

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl space-y-5">
      {/* Title & Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>📈</span> Environmental Telemetry Time-Series
          </h3>
          <p className="text-xs text-slate-400">
            Station: <span className="text-blue-300 font-semibold">{activeZone.name}</span>
          </p>
        </div>

        {/* Range Buttons */}
        <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-lg self-start sm:self-auto">
          {(['24h', '7d', '30d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                timeRange === r
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 4 Sensor Telemetry Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Rainfall Accumulation */}
        <div className="rounded-xl bg-slate-800/60 border border-slate-700/60 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span>🌧️</span> Cumulative Rainfall (mm)
            </span>
            <span className="font-mono text-blue-400 font-bold">
              Peak: {Math.max(...series.map((s) => s.rainfall))} mm
            </span>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-32 flex items-end justify-between gap-1.5 pt-4 pb-1 border-b border-slate-700">
            {series.map((pt, i) => {
              const heightPct = Math.min(100, Math.round((pt.rainfall / maxRain) * 100));
              return (
                <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end">
                  <div className="text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    {pt.rainfall}m
                  </div>
                  <div
                    className="w-full bg-blue-500 rounded-t hover:bg-blue-400 transition-all duration-300"
                    style={{ height: `${Math.max(8, heightPct)}%` }}
                  />
                  <span className="text-[9px] text-slate-400 mt-1 truncate max-w-[40px]">
                    {pt.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Soil Moisture Saturation */}
        <div className="rounded-xl bg-slate-800/60 border border-slate-700/60 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span>💧</span> Soil Moisture (%)
            </span>
            <span className="font-mono text-teal-400 font-bold">
              Current: {series[series.length - 1].soilMoisture}%
            </span>
          </div>

          <div className="h-32 flex items-end justify-between gap-1.5 pt-4 pb-1 border-b border-slate-700">
            {series.map((pt, i) => {
              return (
                <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end">
                  <div className="text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    {pt.soilMoisture}%
                  </div>
                  <div
                    className="w-full bg-teal-500 rounded-t hover:bg-teal-400 transition-all duration-300"
                    style={{ height: `${pt.soilMoisture}%` }}
                  />
                  <span className="text-[9px] text-slate-400 mt-1 truncate max-w-[40px]">
                    {pt.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Inclinometer Displacement */}
        <div className="rounded-xl bg-slate-800/60 border border-slate-700/60 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span>📡</span> Ground Movement (mm)
            </span>
            <span className="font-mono text-orange-400 font-bold">
              Max: {Math.max(...series.map((s) => s.groundMovement))} mm
            </span>
          </div>

          <div className="h-32 flex items-end justify-between gap-1.5 pt-4 pb-1 border-b border-slate-700">
            {series.map((pt, i) => {
              const heightPct = Math.min(100, Math.round((pt.groundMovement / 20) * 100));
              return (
                <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end">
                  <div className="text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    {pt.groundMovement}
                  </div>
                  <div
                    className="w-full bg-orange-500 rounded-t hover:bg-orange-400 transition-all duration-300"
                    style={{ height: `${Math.max(6, heightPct)}%` }}
                  />
                  <span className="text-[9px] text-slate-400 mt-1 truncate max-w-[40px]">
                    {pt.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Risk Score Progression */}
        <div className="rounded-xl bg-slate-800/60 border border-slate-700/60 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span>⚡</span> Landslide Risk Index (0-100)
            </span>
            <span className="font-mono text-red-400 font-bold">
              Current: {series[series.length - 1].riskScore}/100
            </span>
          </div>

          <div className="h-32 flex items-end justify-between gap-1.5 pt-4 pb-1 border-b border-slate-700">
            {series.map((pt, i) => {
              const isCrit = pt.riskScore >= 85;
              const isHigh = pt.riskScore >= 65;
              return (
                <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end">
                  <div className="text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    {pt.riskScore}
                  </div>
                  <div
                    className={`w-full rounded-t transition-all duration-300 ${
                      isCrit ? 'bg-red-500' : isHigh ? 'bg-orange-500' : 'bg-emerald-500'
                    }`}
                    style={{ height: `${Math.max(6, pt.riskScore)}%` }}
                  />
                  <span className="text-[9px] text-slate-400 mt-1 truncate max-w-[40px]">
                    {pt.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
