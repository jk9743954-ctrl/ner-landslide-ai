import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { HazardReport, ReportStatus } from '../../types/risk';
import { RiskBadge } from '../common/RiskBadge';

export const CitizenReportsList: React.FC = () => {
  const { citizenReports, updateReportStatus } = useSimulation();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filtered = citizenReports.filter((r) => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  const handleStatusChange = async (reportId: string, newStatus: ReportStatus) => {
    await updateReportStatus(reportId, newStatus);
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'New':
        return 'bg-blue-950 text-blue-300 border-blue-700';
      case 'Under Review':
        return 'bg-amber-950 text-amber-300 border-amber-700';
      case 'Verified':
        return 'bg-red-950 text-red-300 border-red-700';
      case 'Resolved':
        return 'bg-emerald-950 text-emerald-300 border-emerald-700';
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl space-y-4">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🚨</span> Citizen Hazard Reports Queue
          </h3>
          <p className="text-xs text-slate-400">
            Crowdsourced field telemetry synchronized from mobile citizen submissions ({citizenReports.length} total)
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'New', 'Under Review', 'Verified', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No reports matching filter criteria.
          </div>
        ) : (
          filtered.map((rep) => (
            <div
              key={rep.id}
              className="rounded-xl bg-slate-800/70 border border-slate-700 p-4 space-y-3 hover:border-slate-600 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl mt-0.5">
                    {rep.hazardType === 'Landslide'
                      ? '⛰️'
                      : rep.hazardType === 'Road Crack'
                      ? '⚡'
                      : rep.hazardType === 'Rockfall'
                      ? '🪨'
                      : rep.hazardType === 'Mudflow'
                      ? '💧'
                      : '🚧'}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-white">{rep.hazardType}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(
                          rep.status
                        )}`}
                      >
                        {rep.status}
                      </span>
                      <RiskBadge level={rep.severity} size="sm" />
                    </div>
                    <p className="text-xs text-slate-300 font-semibold mt-1">
                      📍 {rep.locationName}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Reported: {rep.timestamp} by {rep.reporterName || 'Citizen'}
                    </p>
                  </div>
                </div>

                {/* Status Updater Dropdown */}
                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-[11px] text-slate-400">Update Status:</span>
                  <select
                    value={rep.status}
                    onChange={(e) =>
                      handleStatusChange(rep.id, e.target.value as ReportStatus)
                    }
                    className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 outline-none cursor-pointer font-semibold"
                  >
                    <option value="New">New</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Verified">Verified</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                "{rep.description}"
              </p>

              {/* Photo preview if present */}
              {rep.imageUrl && (
                <div className="mt-2">
                  <img
                    src={rep.imageUrl}
                    alt="Hazard evidence"
                    className="h-32 w-full max-w-xs object-cover rounded-lg border border-slate-700"
                  />
                </div>
              )}

              {/* AI Assessment */}
              <div className="rounded-lg bg-indigo-950/40 border border-indigo-800/40 p-2.5 text-xs text-slate-300 flex items-start gap-2">
                <span className="text-sm">🤖</span>
                <div>
                  <span className="font-bold text-indigo-300">AI Geospatial Assessment: </span>
                  <span>{rep.aiAssessment}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
