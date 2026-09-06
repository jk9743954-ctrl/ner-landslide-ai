import {
  MonitoringZone,
  ActiveAlert,
  HazardReport,
  EnvironmentalTelemetry,
  RiskLevel,
} from '../types/risk';
import {
  MOCK_MONITORING_ZONES,
  MOCK_ACTIVE_ALERTS,
  MOCK_CITIZEN_REPORTS,
  GENERATE_TIME_SERIES,
} from '../data/mockRiskData';

/**
 * =========================================================================
 * FUTURE FASTAPI BACKEND ARCHITECTURE CONTRACT
 * =========================================================================
 * In production, these methods will proxy to the FastAPI microservice:
 *
 *   Frontend (React)
 *       │
 *       ▼ [HTTP REST / WebSocket]
 *   FastAPI Gateway (`/api/v1/risk/...`)
 *       │
 *       ├──▶ Geotechnical ML Model (PyTorch / XGBoost on AWS/NIC Cloud)
 *       ├──▶ InSAR Earth Observation (Sentinel-1 / NISAR slope deformation)
 *       ├──▶ IMD Doppler Radar & Automated Weather Stations (AWS)
 *       ├──▶ IoT Piezometer & Inclinometer Ingestion Pipeline
 *       └──▶ PostGIS Spatio-Temporal Database
 * =========================================================================
 */

const LOCAL_STORAGE_REPORTS_KEY = 'ner_landslide_ai_citizen_reports';

/**
 * Computes Haversine distance in km between two GPS coordinates
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Helper to determine categorical risk level from a numeric score
 */
export function getRiskLevelFromScore(score: number): RiskLevel {
  if (score >= 85) return 'CRITICAL';
  if (score >= 65) return 'HIGH';
  if (score >= 35) return 'MODERATE';
  return 'LOW';
}

/**
 * Simulates risk recalculation based on interactive rainfall parameter
 */
export function calculateDynamicRisk(
  baseZone: MonitoringZone,
  simulatedRainfallMm: number
): {
  riskScore: number;
  riskLevel: RiskLevel;
  soilMoisture: number;
  groundDisplacement: number;
  primaryTrigger: string;
} {
  // Demonstration calculation: dynamically scales with rainfall
  const slopeFactor = baseZone.slope / 45; // steeper slope increases impact

  const dynamicMoisture = Math.min(
    99,
    Math.max(25, Math.round(35 + (simulatedRainfallMm / 200) * 58 * (1 + slopeFactor * 0.1)))
  );

  const dynamicDisplacement = parseFloat(
    Math.max(0.5, (0.8 + Math.pow(simulatedRainfallMm / 40, 2) * 0.9 * slopeFactor)).toFixed(1)
  );

  let score = Math.round(
    simulatedRainfallMm * 0.35 * slopeFactor +
      dynamicMoisture * 0.4 +
      dynamicDisplacement * 1.5
  );

  score = Math.min(100, Math.max(12, score));
  const level = getRiskLevelFromScore(score);

  let trigger = 'Baseline environmental metrics within seasonal threshold';
  if (level === 'CRITICAL') {
    trigger = `Extreme rainfall saturation (${simulatedRainfallMm}mm) exceeding critical pore pressure limit on ${baseZone.slope}° slope`;
  } else if (level === 'HIGH') {
    trigger = `Heavy cumulative rainfall (${simulatedRainfallMm}mm) and accelerated ground creep (${dynamicDisplacement}mm)`;
  } else if (level === 'MODERATE') {
    trigger = `Moderate rainfall (${simulatedRainfallMm}mm) with rising soil water saturation`;
  }

  return {
    riskScore: score,
    riskLevel: level,
    soilMoisture: dynamicMoisture,
    groundDisplacement: dynamicDisplacement,
    primaryTrigger: trigger,
  };
}

class RiskService {
  /**
   * Fetches the nearest monitoring zone given latitude & longitude.
   * Defaults to Shillong Zone 04 if far from Northeast India.
   */
  async getCurrentRisk(
    latitude: number,
    longitude: number
  ): Promise<{ zone: MonitoringZone; distanceKm: number; isFallback: boolean }> {
    // Simulate brief network latency
    await new Promise((resolve) => setTimeout(resolve, 150));

    let closestZone = MOCK_MONITORING_ZONES[0]; // default: Shillong Zone 04
    let minDistance = Infinity;

    for (const zone of MOCK_MONITORING_ZONES) {
      const dist = calculateDistanceKm(
        latitude,
        longitude,
        zone.coordinates[0],
        zone.coordinates[1]
      );
      if (dist < minDistance) {
        minDistance = dist;
        closestZone = zone;
      }
    }

    // If user is more than 300km away from any Northeast zone, fallback gracefully to Shillong
    const isFallback = minDistance > 300;
    const finalZone = isFallback ? MOCK_MONITORING_ZONES[0] : closestZone;
    const finalDistance = isFallback
      ? calculateDistanceKm(latitude, longitude, finalZone.coordinates[0], finalZone.coordinates[1])
      : minDistance;

    return {
      zone: finalZone,
      distanceKm: Math.round(finalDistance),
      isFallback,
    };
  }

  /**
   * Returns all active monitoring zones across the 8 Northeastern states
   */
  async getRiskZones(): Promise<MonitoringZone[]> {
    return [...MOCK_MONITORING_ZONES];
  }

  /**
   * Finds a specific zone by unique identifier
   */
  async getRiskZone(id: string): Promise<MonitoringZone | undefined> {
    return MOCK_MONITORING_ZONES.find((z) => z.id === id);
  }

  /**
   * Returns active official landslide alerts
   */
  async getAlerts(): Promise<ActiveAlert[]> {
    return [...MOCK_ACTIVE_ALERTS];
  }

  /**
   * Retrieves all citizen hazard reports, merging mock initial dataset with localStorage
   */
  async getCitizenReports(): Promise<HazardReport[]> {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
      if (stored) {
        const parsed: HazardReport[] = JSON.parse(stored);
        return [...parsed, ...MOCK_CITIZEN_REPORTS];
      }
    } catch {
      // LocalStorage access failsafe
    }
    return [...MOCK_CITIZEN_REPORTS];
  }

  /**
   * Submits a newly reported hazard and persists to localStorage
   */
  async submitHazardReport(
    report: Omit<HazardReport, 'id' | 'timestamp' | 'status' | 'aiAssessment'>
  ): Promise<HazardReport> {
    // Generate simulated AI assessment based on hazard and description
    let aiNote = 'Automated computer-vision & spatial assessment: ';
    if (report.hazardType === 'Road Crack') {
      aiNote += 'Transverse tension crack pattern detected. Potential slope crest failure.';
    } else if (report.hazardType === 'Landslide') {
      aiNote += 'Active translational or rotational mass wasting confirmed by local report.';
    } else if (report.hazardType === 'Rockfall') {
      aiNote += 'Jointed bedrock planar detachment. High secondary rolling projectile risk.';
    } else if (report.hazardType === 'Mudflow') {
      aiNote += 'High water-to-sediment slurry flow. Drainage channel scouring danger.';
    } else {
      aiNote += 'General slope instability indicator flagged for ground engineer review.';
    }

    const newReport: HazardReport = {
      ...report,
      id: `rep-${Date.now().toString().slice(-5)}`,
      timestamp: 'Just now',
      status: 'New',
      aiAssessment: aiNote,
    };

    try {
      const existing = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
      const reportsList: HazardReport[] = existing ? JSON.parse(existing) : [];
      reportsList.unshift(newReport);
      localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(reportsList));
    } catch (e) {
      console.warn('LocalStorage unavailable for hazard report:', e);
    }

    return newReport;
  }

  /**
   * Updates report status in localStorage
   */
  async updateReportStatus(
    reportId: string,
    newStatus: HazardReport['status']
  ): Promise<boolean> {
    try {
      const existing = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
      if (existing) {
        const reportsList: HazardReport[] = JSON.parse(existing);
        const target = reportsList.find((r) => r.id === reportId);
        if (target) {
          target.status = newStatus;
          localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(reportsList));
          return true;
        }
      }
    } catch (e) {
      console.warn('Error updating report status:', e);
    }
    return false;
  }

  /**
   * Fetches time-series telemetry data for charting
   */
  async getEnvironmentalData(
    zoneId: string,
    timeRange: '24h' | '7d' | '30d' = '24h'
  ): Promise<EnvironmentalTelemetry> {
    const zone = MOCK_MONITORING_ZONES.find((z) => z.id === zoneId) || MOCK_MONITORING_ZONES[0];
    const series = GENERATE_TIME_SERIES(
      zone.rainfall24h,
      zone.soilMoisture,
      zone.groundDisplacement,
      zone.riskScore,
      timeRange
    );

    return {
      zoneId: zone.id,
      zoneName: zone.name,
      timeRange,
      series,
    };
  }
}

export const riskService = new RiskService();
