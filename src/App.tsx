import React from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import { EmergencyBanner } from './components/common/EmergencyBanner';
import { LandingPage } from './components/landing/LandingPage';
import { CitizenDashboard } from './components/dashboard/CitizenDashboard';
import { RiskMap } from './components/map/RiskMap';
import { AIAssistant } from './components/ai/AIAssistant';
import { HazardReportForm } from './components/report/HazardReportForm';
import { AuthorityDashboard } from './components/authority/AuthorityDashboard';
import { SafetyGuide } from './components/safety/SafetyGuide';

const AppContent: React.FC = () => {
  const { currentRoute } = useSimulation();

  const renderCurrentView = () => {
    switch (currentRoute) {
      case '/dashboard':
        return <CitizenDashboard />;
      case '/map':
        return <RiskMap />;
      case '/ai-assistant':
        return <AIAssistant />;
      case '/report':
        return <HazardReportForm />;
      case '/authority':
        return <AuthorityDashboard />;
      case '/safety':
        return <SafetyGuide />;
      case '/':
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0B132B] font-sans antialiased text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Emergency Warning Banner (Active when High/Critical or Escalation Demo triggered) */}
      <EmergencyBanner />

      {/* Dynamic Main Body Content */}
      <main className="flex-1 w-full">{renderCurrentView()}</main>

      {/* Mobile Bottom Navigation */}
      <Navigation />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <SimulationProvider>
      <AppContent />
    </SimulationProvider>
  );
};

export default App;
