import React, { useState, useEffect } from 'react';
import { useSimulation } from '../../context/SimulationContext';

export const Header: React.FC = () => {
  const { currentRoute, navigateTo, dynamicRiskLevel } = useSimulation();
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
          timeZone: 'Asia/Kolkata',
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { label: 'Home', route: '/' },
    { label: 'Risk Monitoring', route: '/dashboard' },
    { label: 'Risk Map', route: '/map' },
    { label: 'AI Assistant', route: '/ai-assistant' },
    { label: 'Reports', route: '/report' },
    { label: 'Authority Dashboard', route: '/authority' },
    { label: 'Safety', route: '/safety' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0B132B]/95 backdrop-blur-md">
      {/* Top micro alert strip */}
      <div className="bg-slate-900/90 px-3 py-1 text-[11px] text-slate-300 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono font-medium text-slate-300">
            TELEMETRY NODE: NER-OPS-01
          </span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline text-slate-400">
            Northeast Early Warning Network (Assam, Meghalaya, Sikkim, Manipur, Mizoram, Nagaland, Arunachal, Tripura)
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="font-mono text-slate-400 text-[10px] hidden md:inline">
            {timeStr}
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 tracking-wider">
            DEMO SIMULATION
          </span>
        </div>
      </div>

      {/* Main Brand & Nav bar */}
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <div
            onClick={() => navigateTo('/')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 shadow-md border border-blue-400/30 text-white font-bold text-xl group-hover:scale-105 transition-transform">
              🏔️
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  NER LANDSLIDE AI
                </span>
                <span className="inline-flex items-center rounded-full bg-red-500/20 border border-red-500/40 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-red-300">
                  PROTOTYPE • DEMO DATA
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium hidden xs:block">
                AI-Powered Early Warning & Risk Monitoring
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => navigateTo(link.route)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right side quick actions */}
          <div className="flex items-center space-x-2">
            {dynamicRiskLevel === 'CRITICAL' || dynamicRiskLevel === 'HIGH' ? (
              <button
                onClick={() => navigateTo('/dashboard')}
                className="animate-pulse flex items-center space-x-1 px-2.5 py-1 rounded-full bg-red-600/30 border border-red-500/80 text-red-200 text-xs font-bold"
              >
                <span>⚠️</span>
                <span className="hidden sm:inline">ELEVATED RISK</span>
              </button>
            ) : null}

            <button
              onClick={() => navigateTo('/authority')}
              className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            >
              <span className="h-2 w-2 rounded-full bg-blue-400"></span>
              <span>Control Room</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
