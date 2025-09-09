"use client";

import { BarChart3, Users, Clock, FileText } from "lucide-react";

/**
 * Lightweight analytics page (static example)
 * - You can plug real analytics data via API and charting libs later.
 */

export default function Page() {
  const kpis = [
    { label: "Papers Generated", value: 1240, icon: <FileText className="w-5 h-5" /> },
    { label: "Active Users", value: 86, icon: <Users className="w-5 h-5" /> },
    { label: "Avg Time Saved", value: "72%", icon: <Clock className="w-5 h-5" /> },
    { label: "Drafts", value: 213, icon: <FileText className="w-5 h-5" /> },
  ];

  const series = [50, 80, 65, 120, 90, 140, 160]; // sample weekly numbers

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2"><BarChart3 className="w-6 h-6" /> Analytics</h1>
      <p className="text-sm text-gray-500">Impact metrics and usage trends.</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="rounded-2xl border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{k.label}</p>
                <p className="text-2xl font-semibold">{k.value}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600">{k.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border p-4">
        <div className="text-sm font-medium">Weekly Papers Generated</div>
        <div className="mt-4 flex items-end gap-3 h-40">
          {series.map((v, i) => (
            <div key={i} className="flex-1 grid place-items-end">
              <div style={{ height: `${v}%` }} className="w-full max-w-[28px] bg-blue-600/80 rounded-xl"></div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-xs text-gray-500 grid grid-cols-7"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
      </div>
    </div>
  );
}
