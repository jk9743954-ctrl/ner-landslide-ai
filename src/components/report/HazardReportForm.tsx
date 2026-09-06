import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { HazardType, RiskLevel } from '../../types/risk';

export const HazardReportForm: React.FC = () => {
  const {
    activeZone,
    submitReport,
    navigateTo,
    userCoords,
    requestUserLocation,
    locationStatus,
  } = useSimulation();

  const [hazardType, setHazardType] = useState<HazardType>('Road Crack');
  const [locationName, setLocationName] = useState<string>(activeZone.name.split(' (')[0]);
  const [description, setDescription] = useState<string>('');
  const [reporterName, setReporterName] = useState<string>('');
  const [reporterPhone, setReporterPhone] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const hazardTypes: HazardType[] = [
    'Landslide',
    'Road Crack',
    'Rockfall',
    'Mudflow',
    'Road Blockage',
    'Other',
  ];

  // Image Upload handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Image size exceeds 5MB limit.');
        return;
      }
      setErrorMsg('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg('Please describe the hazard you observed.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    // Estimate severity based on hazard type
    let severity: RiskLevel = 'MODERATE';
    if (hazardType === 'Landslide' || hazardType === 'Rockfall') severity = 'CRITICAL';
    else if (hazardType === 'Mudflow' || hazardType === 'Road Crack') severity = 'HIGH';

    const coords: [number, number] = userCoords || activeZone.coordinates;

    try {
      await submitReport({
        hazardType,
        locationName: locationName || activeZone.name,
        coordinates: coords,
        description,
        reporterName: reporterName.trim() || 'Anonymous Citizen',
        reporterPhone: reporterPhone.trim() || undefined,
        imageUrl: imagePreview || undefined,
        severity,
      });

      setIsSubmitting(false);
      setSubmittedSuccess(true);
    } catch {
      setIsSubmitting(false);
      setErrorMsg('Failed to submit report. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-24 bg-[#0B132B] text-slate-100">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center space-x-2 text-xs text-blue-400 font-semibold mb-1">
            <span className="cursor-pointer hover:underline" onClick={() => navigateTo('/')}>
              Home
            </span>
            <span>/</span>
            <span className="text-slate-400">Citizen Hazard Reporting</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <span>🚨</span> Report a Landslide Hazard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Crowdsource vital slope instability data to assist NDRF, SDRF, and district control rooms.
          </p>
        </div>

        {/* Success State */}
        {submittedSuccess ? (
          <div className="rounded-2xl bg-slate-900 border-2 border-emerald-500/80 p-6 sm:p-8 text-center space-y-4 shadow-2xl animate-fade-in">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-950 text-emerald-400 text-3xl border border-emerald-500/50">
              ✅
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">Report Submitted Successfully</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Your hazard report has been recorded locally and forwarded to the{' '}
              <strong className="text-white">NER Monitoring Operations Center</strong>. Local authorities
              and geologists can now review your observations.
            </p>

            <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-3.5 text-xs text-slate-400 max-w-md mx-auto text-left space-y-1">
              <p>
                <strong className="text-slate-200">Hazard:</strong> {hazardType}
              </p>
              <p>
                <strong className="text-slate-200">Location:</strong> {locationName}
              </p>
              <p>
                <strong className="text-slate-200">Status:</strong>{' '}
                <span className="text-amber-400 font-semibold">New (Pending Triaging)</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => {
                  setSubmittedSuccess(false);
                  setDescription('');
                  setImagePreview(null);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white transition-colors"
              >
                Submit Another Report
              </button>
              <button
                onClick={() => navigateTo('/authority')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold text-xs text-slate-200 transition-colors"
              >
                View in Authority Dashboard →
              </button>
            </div>
          </div>
        ) : (
          /* Report Form */
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-7 shadow-xl space-y-5"
          >
            {errorMsg && (
              <div className="rounded-xl bg-red-950/80 border border-red-800 p-3 text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            {/* 1. Hazard Type Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                1. Select Hazard Type *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {hazardTypes.map((type) => {
                  const isSelected = hazardType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setHazardType(type)}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                        isSelected
                          ? 'bg-blue-600/30 border-blue-500 text-blue-300 shadow-sm'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>
                        {type === 'Landslide'
                          ? '⛰️ '
                          : type === 'Road Crack'
                          ? '⚡ '
                          : type === 'Rockfall'
                          ? '🪨 '
                          : type === 'Mudflow'
                          ? '💧 '
                          : type === 'Road Blockage'
                          ? '🚧 '
                          : '⚠️ '}
                      </span>
                      <span>{type}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Geolocation / Location Name */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  2. Hazard Location *
                </label>
                <button
                  type="button"
                  onClick={requestUserLocation}
                  className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <span>📍</span>
                  <span>
                    {locationStatus === 'loading' ? 'Fetching GPS...' : 'Use Current GPS'}
                  </span>
                </button>
              </div>

              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. NH-6 KM-42 near Upper Shillong Peak"
                required
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
              />
              {userCoords && (
                <p className="mt-1 text-[11px] font-mono text-emerald-400">
                  ✓ Geotagged: {userCoords[0].toFixed(4)}°N, {userCoords[1].toFixed(4)}°E
                </p>
              )}
            </div>

            {/* 3. Image Upload */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                3. Photo Evidence (Optional)
              </label>

              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-700 max-h-48">
                  <img
                    src={imagePreview}
                    alt="Hazard preview"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-white hover:bg-black text-xs font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-slate-700 hover:border-blue-500 bg-slate-800/40 hover:bg-slate-800/80 cursor-pointer transition-colors p-4">
                  <span className="text-2xl mb-1">📷</span>
                  <span className="text-xs font-semibold text-slate-300">
                    Tap to capture or upload photo
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">JPG, PNG up to 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* 4. Detailed Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                4. Description of Hazard *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
                placeholder="e.g. I noticed longitudinal cracks developing along the roadside shoulder. Muddy water is pooling in the depression..."
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 placeholder-slate-500 leading-relaxed"
              />
            </div>

            {/* 5. Reporter Contact (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="e.g. Banrap Lyngdoh"
                  className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Phone for Emergency Updates (Optional)
                </label>
                <input
                  type="tel"
                  value={reporterPhone}
                  onChange={(e) => setReporterPhone(e.target.value)}
                  placeholder="+91-XXXXX-XXXXX"
                  className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-extrabold text-sm shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2 transition-all"
              >
                <span>🚨</span>
                <span>{isSubmitting ? 'Submitting Report...' : 'Submit Hazard Report'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
