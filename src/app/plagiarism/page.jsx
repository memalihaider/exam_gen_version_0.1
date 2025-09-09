"use client";

import { useState } from "react";
import { Scan, FileText, Search } from "lucide-react";

/**
 * Plagiarism UI
 * - Submit text to /api/plagiarism (not implemented here)
 * - Shows placeholder results to integrate with a real scanner later.
 */

export default function Page() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runScan() {
    setLoading(true);
    setResult(null);
    try {
      // Replace with real API call when available:
      // const res = await fetch('/api/plagiarism', { method: 'POST', body: JSON.stringify({ text }) })
      // const data = await res.json()
      // setResult(data)
      // For now show mocked output:
      await new Promise((r) => setTimeout(r, 600));
      setResult({
        score: 12,
        matches: [
          { source: "Open textbook (Bioenergetics)", percent: 6 },
          { source: "Wikipedia – Cell theory", percent: 4 },
          { source: "Past paper 2023", percent: 2 },
        ],
      });
    } catch (err) {
      alert("Scan failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2"><Scan className="w-6 h-6" /> Plagiarism Check</h1>
      <p className="text-sm text-gray-500">Scan questions or answers for similarity before approval.</p>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border p-4">
          <div className="flex items-center gap-2 text-sm font-medium"><FileText className="w-4 h-4" /> Paste text</div>
          <textarea rows={10} value={text} onChange={(e) => setText(e.target.value)} className="mt-2 w-full px-3 py-2 rounded-xl border" placeholder="Paste question or answer text here..." />
          <div className="mt-3 flex justify-end">
            <button onClick={runScan} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white" disabled={loading}>
              <Search className="w-4 h-4" /> {loading ? "Scanning..." : "Run Scan"}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border p-4">
          <div className="text-sm font-medium">Results</div>
          {!result && <p className="mt-2 text-gray-500">No scan yet.</p>}
          {result && (
            <div className="mt-3">
              <div className="text-sm">Similarity Index</div>
              <div className="mt-1 w-full bg-gray-200 rounded-full h-2"><div className="h-2 bg-green-500 rounded-full" style={{ width: `${Math.min(result.score, 100)}%` }} /></div>
              <div className="text-sm mt-1 font-medium">{result.score}%</div>
              <div className="mt-3 text-sm">Matches</div>
              <ul className="mt-1 space-y-1 text-sm">
                {result.matches.map((m, i) => (
                  <li key={i} className="flex items-center justify-between border rounded-lg p-2">
                    <span>{m.source}</span>
                    <span className="text-gray-500">{m.percent}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
