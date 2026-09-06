# 🏔️ NER LANDSLIDE AI
### AI-Based Early Warning & Landslide Risk Monitoring System for North Eastern Region of India
**Smart India Hackathon (SIH) High-Impact Prototype**

> **PROTOTYPE • DEMO DATA NOTICE**  
> This application is an early-warning demonstration prototype engineered for SIH. All sensor readouts, borehole inclinometer measurements, precipitation figures, and AI inferences are simulated demonstrations. It is structured with a decoupled service layer to directly interface with live IoT sensor arrays, Sentinel-1 InSAR data, IMD weather radar feeds, and PyTorch ML models.

---

## 🌟 Key Features & Architecture

### 1. Citizen Early Warning & Risk Monitoring (`/dashboard`)
- **GPS Location Detection:** Geolocation with intelligent nearest-zone matching across the 8 Northeastern states. Graceful fallback to **Shillong Zone 04 (Meghalaya)** if location permission is denied.
- **Dynamic Risk Gauge:** Real-time 0–100 Landslide Risk Index dynamically calculated from multi-variable sensor feeds.
- **Physical Factor Breakdown:** Explains why risk is elevated (Rainfall Infiltration, Soil Moisture Saturation, Slope Angle, Ground Creep).
- **Safe Shelters Finder:** Immediate modal listing assigned disaster shelters, capacities, distances, and contact numbers.

### 2. Live Risk Simulation (SIH Presentation Feature)
- **Interactive Rainfall Slider:** Demonstrates how the system reacts in real time to worsening environmental conditions (40mm → LOW, 80mm → MODERATE, 120mm → HIGH, 160+mm → CRITICAL).
- **"▶ Run Risk Escalation Demo":** 12-second automated presentation sequence demonstrating step-by-step risk escalation from LOW to CRITICAL with Web Audio alert chimes and emergency warning modal triggers.

### 3. Interactive Geospatial Risk Map (`/map`)
- **Full-Screen Leaflet + OpenStreetMap:** Centered on the Northeast Indian Himalayan terrain.
- **8-State Coverage:** Over 28 calibrated monitoring zones across Assam, Arunachal Pradesh, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, and Sikkim.
- **Slide-Over Detail Drawer:** Click any zone to inspect elevation, slope angle, 24h rainfall, soil moisture, borehole displacement, primary geological trigger, and expected risk window.
- **Layer & Severity Filters:** Filter by Risk Level (Critical, High, Moderate, Low) or State.

### 4. NER AI Assistant (`/ai-assistant`)
- **Telemetry-Grounded Intelligence:** Answers questions grounded strictly in active prototype telemetry without hallucinating nonexistent sensors.
- **Quick Inquiries:** "Why is my area at high risk?", "Which areas are currently critical?", "What factors are increasing the risk?", "What should I do during a high-risk warning?".

### 5. Citizen Hazard Reporting (`/report`)
- **Crowdsourced Field Telemetry:** Citizens can upload photos, capture GPS coordinates, select hazard types (Landslide, Road Crack, Rockfall, Mudflow, Road Blockage), and submit descriptions.
- **Persistent Local Storage:** Synchronizes instantly with the Authority Dashboard review queue.

### 6. Disaster Operations Center (`/authority`)
- **Control Room UI:** High-contrast emergency management dashboard designed after NDMA and GSI control rooms.
- **Key Performance Indicators:** 67 Monitored Zones, 7 Critical, 18 High Risk, 5 Active Broadcasts, Citizen Queue.
- **Environmental Telemetry Time-Series:** Interactive charts for 24h, 7d, and 30d timeframes showing Rainfall, Soil Moisture, Displacement, and Risk Index.
- **Citizen Report Triage:** Review queue with interactive status toggle (New, Under Review, Verified, Resolved).
- **Demo Mode Environmental Injector:** Authority operators can manipulate simulated variables during live presentations.

### 7. Safety Guide & 8-State Helplines (`/safety`)
- **Comprehensive Protocols:** Before, During, and After a landslide.
- **Official Emergency Helplines:** SDMA contact numbers for Meghalaya, Assam, Sikkim, Manipur, Mizoram, Nagaland, Arunachal Pradesh, and Tripura, plus NDRF 24/7 Hotline 1078.

---

## 🚀 How to Run the Prototype

### Option 1: Instant Launch (Zero Installation Required)
Using the built-in Python server (already installed on Windows):
```powershell
python server.py
```
Open your browser and navigate to:
```
http://localhost:5173
```
*Or simply double-click `index.html` directly in any web browser (Chrome, Edge, Firefox, Safari).*

### Option 2: Standard Vite / Node Toolchain
If Node.js and npm are installed:
```powershell
npm install
npm run dev
```

---

## 📂 Project Structure

```
ner-landslide-ai/
├── index.html                  # Master entry point with React 18, Leaflet, Tailwind
├── server.py                   # Python lightweight development server
├── manifest.json               # PWA Web App Manifest
├── sw.js                       # Service Worker for offline shell caching
├── package.json                # Standard dependencies and build scripts
├── tsconfig.json               # TypeScript configuration
├── README.md                   # System documentation
└── src/
    ├── types/
    │   └── risk.ts             # RiskLevel, Zone, SensorData, HazardReport models
    ├── data/
    │   └── mockRiskData.ts     # Authentic 8-state Northeast India dataset
    ├── services/
    │   ├── riskService.ts      # API abstraction matching future FastAPI backend
    │   └── aiAssistantService.ts # Contextual AI assistant query engine
    ├── context/
    │   └── SimulationContext.tsx # Global simulation state & escalation runner
    ├── components/
    │   ├── common/             # Header, Navigation, RiskBadge, EmergencyBanner
    │   ├── landing/            # LandingPage hero & 8-state overview
    │   ├── dashboard/          # LocationSelector, CurrentRiskCard, SimulationControls
    │   ├── map/                # RiskMap Leaflet integration
    │   ├── ai/                 # AIAssistant chat interface
    │   ├── report/             # HazardReportForm with image & GPS capture
    │   ├── authority/          # AuthorityDashboard, Charts, ReportsList
    │   └── safety/             # SafetyGuide & SDMA Directory
    └── App.tsx                 # Application root & routing
```

---

## 🏗️ Future FastAPI + ML Integration Blueprint

```
[IoT Inclinometers & Piezometers]
              │
[IMD Doppler & AWS Rain Gauges]   ──▶  FastAPI Ingestion Gateway  ──▶  PostGIS Spatial DB
              │                               │
[Sentinel-1 InSAR Ground Creep]                ▼
                                      PyTorch / LightGBM
                                  Geotechnical Stability Engine
                                              │
                                              ▼
                                 NER LANDSLIDE AI Frontend
                              (React / WebSockets / Push API)
```
