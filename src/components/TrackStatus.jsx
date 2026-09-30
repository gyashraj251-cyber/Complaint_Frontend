import React, { useState } from 'react';
import { trackComplaint } from '../api/complaintApi';

export default function TrackStatus() {
  const [searchId, setSearchId] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setComplaint(null);
    try {
      const res = await trackComplaint(searchId.trim());
      setComplaint(res.data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 md:p-8 max-w-5xl mx-auto my-2 md:my-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-6 gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-800">Complaint Status Lookup</h2>
          <p className="text-slate-500 text-xs mt-0.5">Track resolution progress in real time.</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center space-x-2 w-full sm:w-auto">
          <input
            type="text"
            required
            placeholder="CMP-XXXXXX"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="flex-1 sm:w-48 border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#7c69af] font-mono uppercase"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#7c69af] text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-[#6b5b95] transition shrink-0"
          >
            {loading ? '...' : 'Search'}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs text-center my-4">
          No record found for Complaint ID: <strong>{searchId}</strong>
        </div>
      )}

      {complaint && (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          {/* Scrollable table container for small screens */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead className="bg-[#7c69af] text-white text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3 border-r border-[#8d7cbf]">Complaint ID</th>
                  <th className="p-3 border-r border-[#8d7cbf]">Student Name</th>
                  <th className="p-3 border-r border-[#8d7cbf]">Branch</th>
                  <th className="p-3 border-r border-[#8d7cbf]">Category</th>
                  <th className="p-3 border-r border-[#8d7cbf]">Location</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr className="hover:bg-slate-50 bg-white">
                  <td className="p-3 font-mono font-bold text-[#7c69af]">{complaint.complaintId}</td>
                  <td className="p-3 font-medium">{complaint.studentName}</td>
                  <td className="p-3">{complaint.branch}</td>
                  <td className="p-3">{complaint.category}</td>
                  <td className="p-3">{complaint.location}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-3 py-1 rounded text-xs font-bold border ${
                        complaint.status === 'PENDING'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : complaint.status === 'IN_PROGRESS'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {complaint.status}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase block">Description:</span>
              <p className="text-sm text-slate-800 mt-1 bg-white p-3 border border-slate-200 rounded">
                {complaint.description}
              </p>
            </div>

            {complaint.adminRemark && (
              <div className="bg-[#7c69af]/10 border border-[#7c69af]/30 p-3 rounded">
                <span className="text-xs font-bold text-[#7c69af] block">Admin Action Remark:</span>
                <p className="text-sm text-slate-800 mt-0.5">{complaint.adminRemark}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}