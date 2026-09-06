import React from 'react';
import { useSimulation } from '../../context/SimulationContext';

export const Navigation: React.FC = () => {
  const { currentRoute, navigateTo, dynamicRiskLevel } = useSimulation();

  const mobileNavItems = [
    { label: 'Home', route: '/', icon: '🏠' },
    { label: 'Risk', route: '/dashboard', icon: '📊', badge: dynamicRiskLevel === 'CRITICAL' || dynamicRiskLevel === 'HIGH' },
    { label: 'Map', route: '/map', icon: '🗺️' },
    { label: 'AI', route: '/ai-assistant', icon: '🤖' },
    { label: 'Report', route: '/report', icon: '🚨' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-[#0B132B]/95 backdrop-blur-lg lg:hidden pb-safe"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex h-16 items-center justify-around px-2 max-w-lg mx-auto">
        {mobileNavItems.map((item) => {
          const isActive = currentRoute === item.route;
          return (
            <button
              key={item.route}
              onClick={() => navigateTo(item.route)}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 text-xs transition-all ${
                isActive
                  ? 'text-blue-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-lg relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 animate-ping" />
                )}
              </span>
              <span className="mt-0.5 tracking-tight text-[11px]">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-0.5 bg-blue-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
