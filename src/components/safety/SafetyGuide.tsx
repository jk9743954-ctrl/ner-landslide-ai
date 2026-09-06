import React, { useState } from 'react';
import { MOCK_EMERGENCY_CONTACTS } from '../../data/mockRiskData';
import { useSimulation } from '../../context/SimulationContext';

export const SafetyGuide: React.FC = () => {
  const { navigateTo } = useSimulation();
  const [activeTab, setActiveTab] = useState<'protocols' | 'contacts'>('protocols');

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-24 bg-[#0B132B] text-slate-100">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2 text-xs text-blue-400 font-semibold mb-1">
            <span className="cursor-pointer hover:underline" onClick={() => navigateTo('/')}>
              Home
            </span>
            <span>/</span>
            <span className="text-slate-400">Preparedness</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <span>🛡️</span> Landslide Safety & Disaster Response Guide
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Standard operating procedures based on National Disaster Management Authority (NDMA)
            and Geological Survey of India (GSI) protocols for mountainous terrain.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveTab('protocols')}
            className={`py-2.5 px-5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'protocols'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Safety Protocols (Before, During, After)
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`py-2.5 px-5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'contacts'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            8 North East States Helplines
          </button>
        </div>

        {/* Section 1: Protocols */}
        {activeTab === 'protocols' && (
          <div className="space-y-6">
            {/* Before a Landslide */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-black text-base sm:text-lg">
                <span>🟢</span>
                <h3>Before a Landslide (Preparedness & Vigilance)</h3>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start space-x-2.5">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>
                    <strong>Monitor official warnings:</strong> Track daily IMD heavy rainfall alerts and NER Landslide AI early warning notices.
                  </span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>
                    <strong>Avoid unstable slopes:</strong> Refrain from building, excavating toe slopes, or sleeping in rooms adjacent to steep hill cuttings during intense rainfall.
                  </span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>
                    <strong>Know evacuation routes:</strong> Identify uphill ridge lines and pre-designated community shelters. Memorize at least two exit routes from your village or ward.
                  </span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>
                    <strong>Keep emergency supplies ready:</strong> Pack a water-resistant "Go-Bag" with potable water, non-perishable foods, first-aid kit, torch, radio, and duplicate identity papers.
                  </span>
                </li>
              </ul>
            </div>

            {/* During a Landslide */}
            <div className="rounded-2xl bg-slate-900/90 border border-orange-800/60 p-5 sm:p-6 shadow-xl space-y-3">
              <div className="flex items-center space-x-2 text-orange-400 font-black text-base sm:text-lg">
                <span>🟠</span>
                <h3>During a Landslide (Immediate Survival Action)</h3>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start space-x-2.5">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>
                    <strong>Move away from slopes quickly:</strong> Run across the slope path, never downhill in the direction of the moving slide or debris channel.
                  </span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>
                    <strong>Avoid crossing debris flows:</strong> Water-saturated mud and rock slurries flow at 20–50 km/h and can easily sweep away vehicles and pedestrians.
                  </span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>
                    <strong>If trapped indoors:</strong> Curl into a tight fetal ball under heavy furniture or against an interior wall to shield your head from collapsing structure.
                  </span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>
                    <strong>Stay away from damaged roads:</strong> Embankment undercutting often triggers sudden secondary subsidence even after initial movement stops.
                  </span>
                </li>
              </ul>
            </div>

            {/* After a Landslide */}
            <div className="rounded-2xl bg-slate-900/90 border border-red-800/60 p-5 sm:p-6 shadow-xl space-y-3">
              <div className="flex items-center space-x-2 text-red-400 font-black text-base sm:text-lg">
                <span>🔴</span>
                <h3>After a Landslide (Post-Hazard Protocol)</h3>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start space-x-2.5">
                  <span className="text-red-400 font-bold">•</span>
                  <span>
                    <strong>Avoid unstable areas:</strong> Secondary slides and dam bursts in choked streams can occur hours or days after the primary landslide.
                  </span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="text-red-400 font-bold">•</span>
                  <span>
                    <strong>Report hazards immediately:</strong> Use the Citizen Hazard Report tool in this app to document cracked pavements, broken water mains, or fallen power lines.
                  </span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="text-red-400 font-bold">•</span>
                  <span>
                    <strong>Do not enter damaged structures:</strong> Foundations may have sheared. Wait for civil engineers and municipal authorities to inspect stability.
                  </span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="text-red-400 font-bold">•</span>
                  <span>
                    <strong>Follow authority instructions:</strong> Obey SDRF, BRO, and local administration directives regarding road closures and temporary relief camps.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Section 2: Emergency Helplines */}
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            <div className="rounded-xl bg-blue-950/60 border border-blue-800/60 p-4 text-xs text-blue-200">
              <p className="font-bold mb-1">National Disaster Emergency Numbers:</p>
              <div className="flex flex-wrap gap-4 font-mono font-bold text-sm">
                <span>🚨 NDRF Control Room: 1078</span>
                <span>📞 State Disaster Management: 1070</span>
                <span>🚑 Ambulance: 108 / 112</span>
                <span>👮 Police: 100 / 112</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {MOCK_EMERGENCY_CONTACTS.map((c, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-white">{c.state}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      SDMA Node
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">{c.authority}</p>

                  <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Emergency Toll-Free:</span>
                      <a
                        href={`tel:${c.helpline.split(' ')[0]}`}
                        className="font-mono font-bold text-emerald-400 hover:underline"
                      >
                        {c.helpline}
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Direct Landline:</span>
                      <span className="font-mono text-slate-300">{c.alternate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">E-mail:</span>
                      <span className="font-mono text-[11px] text-blue-400">{c.email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mandatory Disclaimer */}
        <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-4 text-xs text-slate-500 leading-relaxed">
          <p>
            ⚠️ <strong>Emergency Guidance Notice:</strong> These instructions provide general disaster
            preparedness guidelines for educational and demonstration purposes. During an active
            natural disaster, always adhere strictly to broadcast instructions issued by your local
            District Disaster Management Authority (DDMA) and emergency response personnel.
          </p>
        </div>
      </div>
    </div>
  );
};
