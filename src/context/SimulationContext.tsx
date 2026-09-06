import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { MonitoringZone, RiskLevel, ActiveAlert, HazardReport } from '../types/risk';
import { MOCK_MONITORING_ZONES, MOCK_ACTIVE_ALERTS } from '../data/mockRiskData';
import { riskService, calculateDynamicRisk } from '../services/riskService';

interface SimulationContextType {
  // Navigation
  currentRoute: string;
  navigateTo: (route: string) => void;

  // Selected Zone & Location
  activeZone: MonitoringZone;
  setActiveZone: (zone: MonitoringZone) => void;
  userCoords: [number, number] | null;
  locationStatus: 'idle' | 'loading' | 'granted' | 'denied' | 'fallback';
  locationMessage: string;
  requestUserLocation: () => void;

  // Environmental Simulation State
  simulatedRainfall: number;
  setSimulatedRainfall: (rainfall: number) => void;
  dynamicRiskScore: number;
  dynamicRiskLevel: RiskLevel;
  dynamicSoilMoisture: number;
  dynamicGroundDisplacement: number;
  dynamicTrigger: string;

  // Escalation Demo
  isEscalating: boolean;
  escalationStep: string;
  runEscalationDemo: () => void;
  stopEscalationDemo: () => void;

  // Emergency Modal
  showEmergencyModal: boolean;
  setShowEmergencyModal: (show: boolean) => void;
  dismissEmergencyModal: () => void;

  // Data Collections
  allZones: MonitoringZone[];
  activeAlerts: ActiveAlert[];
  citizenReports: HazardReport[];
  refreshReports: () => Promise<void>;
  submitReport: (
    report: Omit<HazardReport, 'id' | 'timestamp' | 'status' | 'aiAssessment'>
  ) => Promise<HazardReport>;
  updateReportStatus: (reportId: string, status: HazardReport['status']) => Promise<void>;

  // Safe Shelter modal
  showSafeAreasModal: boolean;
  setShowSafeAreasModal: (show: boolean) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Routing state
  const [currentRoute, setCurrentRoute] = useState<string>('/');

  // Active Zone (default: Shillong Zone 04)
  const [allZones] = useState<MonitoringZone[]>(MOCK_MONITORING_ZONES);
  const [activeZone, setActiveZone] = useState<MonitoringZone>(MOCK_MONITORING_ZONES[0]);

  // Geolocation
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [locationStatus, setLocationStatus] = useState<
    'idle' | 'loading' | 'granted' | 'denied' | 'fallback'
  >('idle');
  const [locationMessage, setLocationMessage] = useState<string>(
    'Default demo location: Shillong Zone 04 (Meghalaya)'
  );

  // Environmental Simulation
  const [simulatedRainfall, setSimulatedRainfall] = useState<number>(142);
  const [isEscalating, setIsEscalating] = useState<boolean>(false);
  const [escalationStep, setEscalationStep] = useState<string>('');

  // Emergency Banner & Modals
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const [showSafeAreasModal, setShowSafeAreasModal] = useState<boolean>(false);

  // Alerts & Reports
  const [activeAlerts] = useState<ActiveAlert[]>(MOCK_ACTIVE_ALERTS);
  const [citizenReports, setCitizenReports] = useState<HazardReport[]>([]);

  // Navigation helper
  const navigateTo = useCallback((route: string) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Update hash for browser back/forward and bookmarking
    if (window.location.hash !== route) {
      window.location.hash = route;
    }
  }, []);

  // Listen to hash change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      setCurrentRoute(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    if (window.location.hash) {
      handleHashChange();
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch citizen reports on mount
  const refreshReports = useCallback(async () => {
    const reports = await riskService.getCitizenReports();
    setCitizenReports(reports);
  }, []);

  useEffect(() => {
    refreshReports();
  }, [refreshReports]);

  // Compute dynamic risk values
  const dynamicCalc = useMemo(() => {
    return calculateDynamicRisk(activeZone, simulatedRainfall);
  }, [activeZone, simulatedRainfall]);

  const dynamicRiskScore = dynamicCalc.riskScore;
  const dynamicRiskLevel = dynamicCalc.riskLevel;
  const dynamicSoilMoisture = dynamicCalc.soilMoisture;
  const dynamicGroundDisplacement = dynamicCalc.groundDisplacement;
  const dynamicTrigger = dynamicCalc.primaryTrigger;

  // Request browser geolocation with graceful demo fallback
  const requestUserLocation = useCallback(() => {
    setLocationStatus('loading');
    setLocationMessage('Requesting GPS location...');

    if (!navigator.geolocation) {
      setLocationStatus('denied');
      setLocationMessage('Geolocation not supported by your browser. Using demo location: Shillong Zone 04.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserCoords([lat, lng]);

        try {
          const result = await riskService.getCurrentRisk(lat, lng);
          setActiveZone(result.zone);
          setSimulatedRainfall(result.zone.rainfall24h);

          if (result.isFallback) {
            setLocationStatus('fallback');
            setLocationMessage(
              `Coordinates: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E. You are outside the Northeast Region. Using nearest demo zone: ${result.zone.name}`
            );
          } else {
            setLocationStatus('granted');
            setLocationMessage(
              `GPS Location Active: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E. Matched to ${result.zone.name} (${result.distanceKm} km away)`
            );
          }
        } catch {
          setLocationStatus('fallback');
          setLocationMessage('Error matching zone. Using demo location: Shillong Zone 04.');
        }
      },
      (error) => {
        console.warn('Geolocation denied or timed out:', error.message);
        setLocationStatus('denied');
        setLocationMessage(
          'Location access was not granted. Gracefully using demo location: Shillong Zone 04 (Meghalaya).'
        );
        // Fallback gracefully without breaking UI
        setActiveZone(MOCK_MONITORING_ZONES[0]);
        setSimulatedRainfall(MOCK_MONITORING_ZONES[0].rainfall24h);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  // Web Audio alert chime
  const playAlertTone = useCallback((isCritical: boolean) => {
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = isCritical ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(isCritical ? 880 : 440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(isCritical ? 440 : 220, ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Audio context disabled or unavailable in background
    }
  }, []);

  // "Run Risk Escalation Demo" simulation runner
  const runEscalationDemo = useCallback(() => {
    if (isEscalating) return;
    setIsEscalating(true);
    setEscalationStep('Initializing Demo Simulation: 40mm Rainfall (LOW Risk)...');
    setSimulatedRainfall(40);

    // Step 1: Low -> Moderate at 3s (80mm)
    const t1 = setTimeout(() => {
      setSimulatedRainfall(80);
      setEscalationStep('Escalating Precipitation: 80mm Rainfall (MODERATE Risk)...');
      playAlertTone(false);
    }, 3000);

    // Step 2: Moderate -> High at 6s (125mm)
    const t2 = setTimeout(() => {
      setSimulatedRainfall(125);
      setEscalationStep('Warning Triggered: 125mm Rainfall (HIGH Risk)...');
      playAlertTone(false);
    }, 6500);

    // Step 3: High -> Critical at 10s (180mm)
    const t3 = setTimeout(() => {
      setSimulatedRainfall(180);
      setEscalationStep('CRITICAL THRESHOLD: 180mm Extreme Rainfall (CRITICAL Risk)!');
      playAlertTone(true);
      setShowEmergencyModal(true);
      setIsEscalating(false);
    }, 10500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isEscalating, playAlertTone]);

  const stopEscalationDemo = useCallback(() => {
    setIsEscalating(false);
    setEscalationStep('');
  }, []);

  const dismissEmergencyModal = useCallback(() => {
    setShowEmergencyModal(false);
  }, []);

  // Submit hazard report
  const submitReport = useCallback(
    async (report: Omit<HazardReport, 'id' | 'timestamp' | 'status' | 'aiAssessment'>) => {
      const created = await riskService.submitHazardReport(report);
      await refreshReports();
      return created;
    },
    [refreshReports]
  );

  // Update report status
  const updateReportStatus = useCallback(
    async (reportId: string, status: HazardReport['status']) => {
      await riskService.updateReportStatus(reportId, status);
      await refreshReports();
    },
    [refreshReports]
  );

  const value: SimulationContextType = {
    currentRoute,
    navigateTo,
    activeZone,
    setActiveZone,
    userCoords,
    locationStatus,
    locationMessage,
    requestUserLocation,
    simulatedRainfall,
    setSimulatedRainfall,
    dynamicRiskScore,
    dynamicRiskLevel,
    dynamicSoilMoisture,
    dynamicGroundDisplacement,
    dynamicTrigger,
    isEscalating,
    escalationStep,
    runEscalationDemo,
    stopEscalationDemo,
    showEmergencyModal,
    setShowEmergencyModal,
    dismissEmergencyModal,
    allZones,
    activeAlerts,
    citizenReports,
    refreshReports,
    submitReport,
    updateReportStatus,
    showSafeAreasModal,
    setShowSafeAreasModal,
  };

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
};

export const useSimulation = (): SimulationContextType => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
