export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type NEState =
  | 'Meghalaya'
  | 'Assam'
  | 'Arunachal Pradesh'
  | 'Manipur'
  | 'Mizoram'
  | 'Nagaland'
  | 'Tripura'
  | 'Sikkim';

export interface EvacuationShelter {
  name: string;
  distance: string;
  capacity: number;
  type: 'Community Hall' | 'School Building' | 'Sports Complex' | 'Disaster Shelter';
  contact: string;
}

export interface MonitoringZone {
  id: string;
  name: string;
  code: string;
  state: NEState;
  district: string;
  coordinates: [number, number]; // [lat, lng]
  elevation: number; // meters
  slope: number; // degrees
  soilType: string;
  rainfall24h: number; // mm
  rainfall7d: number; // mm
  soilMoisture: number; // percentage
  groundDisplacement: number; // mm
  temperature: number; // Celsius
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  previousRiskLevel: RiskLevel;
  primaryTrigger: string;
  expectedRiskWindow: string;
  historicalEvents: number;
  lastUpdated: string;
  safeEvacuationAreas: EvacuationShelter[];
}

export type HazardType =
  | 'Landslide'
  | 'Road Crack'
  | 'Rockfall'
  | 'Mudflow'
  | 'Road Blockage'
  | 'Other';

export type ReportStatus = 'New' | 'Under Review' | 'Verified' | 'Resolved';

export interface HazardReport {
  id: string;
  timestamp: string;
  hazardType: HazardType;
  locationName: string;
  coordinates: [number, number];
  description: string;
  reporterName?: string;
  reporterPhone?: string;
  imageUrl?: string;
  status: ReportStatus;
  aiAssessment: string;
  severity: RiskLevel;
}

export interface ActiveAlert {
  id: string;
  zoneId: string;
  zoneName: string;
  state: NEState;
  riskLevel: RiskLevel;
  headline: string;
  description: string;
  issuedAt: string;
  expiresAt: string;
  affectedPopulation: number;
  status: 'ACTIVE' | 'MONITORING' | 'RESOLVED';
}

export interface TimeSeriesPoint {
  time: string;
  rainfall: number;
  soilMoisture: number;
  groundMovement: number;
  riskScore: number;
}

export interface EnvironmentalTelemetry {
  zoneId: string;
  zoneName: string;
  timeRange: '24h' | '7d' | '30d';
  series: TimeSeriesPoint[];
}

export interface StateSummary {
  state: NEState;
  totalZones: number;
  criticalZones: number;
  highZones: number;
  moderateZones: number;
  lowZones: number;
  peakRiskScore: number;
  primaryActiveAlert?: string;
}

export interface EmergencyContact {
  state: string;
  authority: string;
  helpline: string;
  alternate: string;
  email: string;
}
