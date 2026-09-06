import React from 'react';
import { LocationSelector } from './LocationSelector';
import { CurrentRiskCard } from './CurrentRiskCard';
import { RiskExplanation } from './RiskExplanation';
import { SimulationControls } from './SimulationControls';
import { useSimulation } from '../../context/SimulationContext';

export const CitizenDashboard: React.FC = () => {
  const { navigateTo, setShowSafeAreasModal } = useSimulation();

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-24 bg-[#0B132B] text-slate-100">
      <div className="mx-auto max-w-5xl px-3 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Page Title & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-blue-400 font-semibold mb-1">
              <span className="cursor-pointer hover:underline" onClick={() => navigateTo('/')}>
                Home
              </span>
              <span>/</span>
              <span className="text-slate-400">Citizen Risk Monitoring</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>📊</span> Citizen Landslide Risk Monitor
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSafeAreasModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            >
              🏛️ View Safe Shelters
            </button>
            <button
              onClick={() => navigateTo('/report')}
              className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-bold transition-colors"
            >
              🚨 Report Hazard
            </button>
          </div>
        </div>

        {/* 1. Location Selector with Geolocation */}
        <LocationSelector />

        {/* 2. Large Visually Prominent Risk Card */}
        <CurrentRiskCard />

        {/* 3. Live Risk Simulation (SIH Presentation Feature) */}
        <SimulationControls />

        {/* 4. Risk Explanation with 4 Physical Factor Cards & Ask NER AI */}
        <RiskExplanation />
      </div>
    </div>
  );
};
