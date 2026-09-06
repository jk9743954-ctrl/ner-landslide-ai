import { MonitoringZone, RiskLevel } from '../types/risk';
import { MOCK_MONITORING_ZONES, MOCK_ACTIVE_ALERTS } from '../data/mockRiskData';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: Array<{ label: string; route?: string; query?: string }>;
}

export function queryAIAssistant(
  userQuery: string,
  currentZone: MonitoringZone,
  simulatedRainfall?: number,
  dynamicScore?: number,
  dynamicLevel?: RiskLevel
): string {
  const query = userQuery.toLowerCase();
  const effectiveRain = simulatedRainfall ?? currentZone.rainfall24h;
  const effectiveScore = dynamicScore ?? currentZone.riskScore;
  const effectiveLevel = dynamicLevel ?? currentZone.riskLevel;

  // 1. Why is my area at high risk / why high?
  if (
    query.includes('why') &&
    (query.includes('risk') || query.includes('high') || query.includes('critical'))
  ) {
    if (effectiveLevel === 'CRITICAL' || effectiveLevel === 'HIGH') {
      return (
        `**${currentZone.name}** is currently evaluated as **${effectiveLevel} Risk (Score: ${effectiveScore}/100)** ` +
        `in this demonstration prototype.\n\n` +
        `Key contributing environmental indicators:\n` +
        `• **Precipitation:** ${effectiveRain} mm recorded over 24 hours.\n` +
        `• **Soil Moisture:** ${currentZone.soilMoisture}% saturation, drastically reducing internal friction.\n` +
        `• **Slope Gradient:** ${currentZone.slope}° inclination (${currentZone.soilType}).\n` +
        `• **Borehole Displacement:** ${currentZone.groundDisplacement} mm detected by slope inclinometers.\n\n` +
        `*Trigger Summary:* ${currentZone.primaryTrigger}.\n\n` +
        `*(Simulated prototype inference based on active telemetry.)*`
      );
    } else {
      return (
        `**${currentZone.name}** is currently at **${effectiveLevel} Risk (Score: ${effectiveScore}/100)**.\n\n` +
        `The 24h rainfall is ${effectiveRain} mm and soil moisture is ${currentZone.soilMoisture}%, which remain ` +
        `within manageable structural safety thresholds. However, monsoon conditions in ${currentZone.district} ` +
        `can escalate rapidly. Keep monitoring official SDMA updates.\n\n` +
        `*(Simulated prototype inference based on active telemetry.)*`
      );
    }
  }

  // 2. Which areas are currently critical?
  if (
    query.includes('which areas') ||
    query.includes('critical') ||
    query.includes('most dangerous') ||
    query.includes('highest risk')
  ) {
    const criticalZones = MOCK_MONITORING_ZONES.filter((z) => z.riskLevel === 'CRITICAL');
    const highZones = MOCK_MONITORING_ZONES.filter((z) => z.riskLevel === 'HIGH');

    let response = `Across the North Eastern Region, the following zones currently display **CRITICAL** risk levels in this prototype:\n\n`;
    criticalZones.forEach((z) => {
      response += `🚨 **${z.name}** (${z.state})\n`;
      response += `   • Risk Score: ${z.riskScore}/100 | Rain: ${z.rainfall24h}mm | Soil Moisture: ${z.soilMoisture}%\n`;
      response += `   • Primary Danger: ${z.primaryTrigger}\n\n`;
    });

    response += `Additionally, **${highZones.length} zones** (including ${highZones.map((z) => z.name.split(' (')[0]).slice(0, 3).join(', ')}) are categorized as **HIGH** risk.\n\n`;
    response += `*(Prototype notice: All values are simulated demonstrations across 8 NE states.)*`;
    return response;
  }

  // 3. What factors are increasing the risk?
  if (query.includes('factor') || query.includes('trigger') || query.includes('cause')) {
    return (
      `Landslide hazard probability in the North Eastern Himalayan terrain is governed by four primary physical factors:\n\n` +
      `1. **Cumulative Rainfall Infiltration:** High intensity and multi-day precipitation raise subterranean pore-water pressure, reducing shear strength along slip surfaces.\n` +
      `2. **Slope Angle & Geomorphology:** Slopes steeper than 30° (e.g. ${currentZone.name} at ${currentZone.slope}°) exhibit higher shear stress.\n` +
      `3. **Lithology & Geological Strata:** Weak formations such as Disang shales, phyllites, and sheared sandstones weather quickly when wet.\n` +
      `4. **Ground Movement / Creep:** Inclinometers measuring displacement (current reading: ${currentZone.groundDisplacement} mm) identify early toe bulging or tension cracks.\n\n` +
      `*(Simulated prototype analysis based on GSI and NDMA guidelines.)*`
    );
  }

  // 4. What should I do during a high-risk warning / safety?
  if (
    query.includes('what should i do') ||
    query.includes('safety') ||
    query.includes('evacuat') ||
    query.includes('warning') ||
    query.includes('action')
  ) {
    const shelters = currentZone.safeEvacuationAreas
      .map((s) => `• **${s.name}** (${s.distance}) - Tel: ${s.contact}`)
      .join('\n');

    return (
      `### Safety Action Plan for ${effectiveLevel} Alert in ${currentZone.name}:\n\n` +
      `1. **Stay Alert to Slope Changes:** Watch for widening road cracks, tilting trees/poles, and sudden murky runoff in local streams.\n` +
      `2. **Avoid Valley Bottoms & Ravines:** Debris flows travel downstream at high velocity. Do not attempt to cross flooded hill gullies.\n` +
      `3. **Prepare Go-Bag:** Keep identity documents, emergency medicines, torches, power banks, and bottled water ready.\n` +
      `4. **Identified Safe Shelters Nearby:**\n${shelters}\n\n` +
      `📞 **Emergency Toll-Free Helpline:** Call **1070** (State Disaster Helpline) or **1078** (NDRF Control Room).\n\n` +
      `*(Follow all instructions given by local district magistrates and SDRF teams.)*`
    );
  }

  // 5. Active alerts
  if (query.includes('alert') || query.includes('notification')) {
    const alertsCount = MOCK_ACTIVE_ALERTS.length;
    return (
      `There are currently **${alertsCount} active early warning alerts** issued across Northeast India in this prototype.\n\n` +
      `Top priority alerts:\n` +
      `• **${MOCK_ACTIVE_ALERTS[0].zoneName}:** ${MOCK_ACTIVE_ALERTS[0].headline}\n` +
      `• **${MOCK_ACTIVE_ALERTS[1].zoneName}:** ${MOCK_ACTIVE_ALERTS[1].headline}\n` +
      `• **${MOCK_ACTIVE_ALERTS[2].zoneName}:** ${MOCK_ACTIVE_ALERTS[2].headline}\n\n` +
      `You can inspect all alerts in the Authority Dashboard or on the Risk Map.`
    );
  }

  // General fallback response
  return (
    `Regarding **${currentZone.name}**:\n` +
    `Current simulated status is **${effectiveLevel}** with an aggregate risk score of **${effectiveScore}/100**.\n` +
    `Environmental telemetry shows 24h rainfall of **${effectiveRain} mm**, soil moisture at **${currentZone.soilMoisture}%**, ` +
    `and slope inclination of **${currentZone.slope}°**.\n\n` +
    `You can ask me questions such as:\n` +
    `• *"Why is my area at high risk?"*\n` +
    `• *"Which areas are currently critical?"*\n` +
    `• *"What factors are increasing the risk?"*\n` +
    `• *"What should I do during a high-risk warning?"*\n\n` +
    `*(AI responses are based on simulated prototype data for demonstration purposes.)*`
  );
}
