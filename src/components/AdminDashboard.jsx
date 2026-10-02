import React, { useState } from 'react';
import { fetchAllComplaints, fetchStats, updateComplaintDetails, deleteComplaint } from '../api/complaintApi';
import axios from 'axios';

// Backend API Base URL

const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://complaint-backend-ou0s.onrender.com/api") + "/admin";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'verify-otp'

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [otp, setOtp] = useState('');
  
  // UI Status
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dashboard Data State
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(false);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('PENDING');
  const [assignedDepartment, setAssignedDepartment] = useState('');
  const [remark, setRemark] = useState('');

  // Image Preview Lightbox State
  const [viewingImage, setViewingImage] = useState(null);

  // --- Auth Handlers ---

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
      if (response.status === 200) {
        setIsAuthenticated(true);
        loadDashboardData();
      }
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        email,
        password,
        secretKey
      });
      setAuthSuccess(response.data.message || 'OTP sent successfully to your email.');
      setAuthMode('verify-otp');
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Failed to register. Verify secret key.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/verify-otp`, {
        email,
        otp
      });
      setAuthSuccess(response.data.message || 'Verification successful! You can now log in.');
      setAuthMode('login');
      setPassword('');
      setOtp('');
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    setSecretKey('');
    setOtp('');
    setAuthMode('login');
  };

  // --- Dashboard Data Handlers ---

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [complaintsRes, statsRes] = await Promise.all([
        fetchAllComplaints(),
        fetchStats()
      ]);
      setComplaints(complaintsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      alert('Error fetching complaints from backend. Verify Spring Boot is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setAssignedDepartment(complaint.assignedDepartment || 'General Maintenance');
    setRemark(complaint.adminRemark || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateComplaintDetails(selectedComplaint.complaintId, {
        status: newStatus,
        remark,
        department: assignedDepartment
      });
      setSelectedComplaint(null);
      loadDashboardData();
    } catch (err) {
      alert('Failed to update complaint');
    }
  };

  const handleDelete = async (complaintId) => {
    if (window.confirm(`Are you sure you want to delete ${complaintId}? This action cannot be undone.`)) {
      try {
        await deleteComplaint(complaintId);
        loadDashboardData();
      } catch (err) {
        alert('Failed to delete complaint');
      }
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.complaintId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // --- Render Authentication Forms ---
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="w-12 h-12 bg-[#7c69af]/10 text-[#7c69af] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          👨‍💼
        </div>
        <h2 className="text-xl font-bold text-center text-slate-800">
          {authMode === 'login' && 'Admin Login'}
          {authMode === 'register' && 'Register New Admin'}
          {authMode === 'verify-otp' && 'Verify Email OTP'}
        </h2>
        <p className="text-slate-500 text-xs text-center mt-1 mb-6">
          {authMode === 'login' && 'Enter administrative credentials to proceed'}
          {authMode === 'register' && 'Enter master key to create an admin account'}
          {authMode === 'verify-otp' && `Enter the 6-digit code sent to ${email}`}
        </p>

        {authError && (
          <div className="bg-red-50 text-red-700 border border-red-200 text-xs p-3 rounded mb-4 text-center font-medium">
            {authError}
          </div>
        )}

        {authSuccess && (
          <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs p-3 rounded mb-4 text-center font-medium">
            {authSuccess}
          </div>
        )}

        {/* LOGIN FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Admin Email</label>
              <input
                type="email"
                required
                placeholder="admin@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#7c69af] focus:ring-1 focus:ring-[#7c69af]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#7c69af] focus:ring-1 focus:ring-[#7c69af]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#7c69af] text-white py-2.5 rounded-md font-medium text-sm hover:bg-[#6b5b95] transition disabled:opacity-50"
            >
              {isSubmitting ? 'Authenticating...' : 'Login to Admin Panel'}
            </button>

            <p className="text-xs text-center text-slate-500 mt-4">
              Need to create an admin account?{' '}
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setAuthError(''); setAuthSuccess(''); }}
                className="text-[#7c69af] font-semibold hover:underline"
              >
                Register Here
              </button>
            </p>
          </form>
        )}

        {/* REGISTER FORM */}
        {authMode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Admin Email</label>
              <input
                type="email"
                required
                placeholder="admin@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#7c69af] focus:ring-1 focus:ring-[#7c69af]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#7c69af] focus:ring-1 focus:ring-[#7c69af]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Master Admin Secret Key</label>
              <input
                type="password"
                required
                placeholder="Secret Key"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#7c69af] focus:ring-1 focus:ring-[#7c69af]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#7c69af] text-white py-2.5 rounded-md font-medium text-sm hover:bg-[#6b5b95] transition disabled:opacity-50"
            >
              {isSubmitting ? 'Sending OTP...' : 'Generate OTP & Register'}
            </button>

            <p className="text-xs text-center text-slate-500 mt-4">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess(''); }}
                className="text-[#7c69af] font-semibold hover:underline"
              >
                Login Instead
              </button>
            </p>
          </form>
        )}

        {/* VERIFY OTP FORM */}
        {authMode === 'verify-otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Enter 6-Digit OTP</label>
              <input
                type="text"
                maxLength="6"
                required
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 border text-center font-mono text-lg tracking-widest rounded-md outline-none focus:border-[#7c69af] focus:ring-1 focus:ring-[#7c69af]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#7c69af] text-white py-2.5 rounded-md font-medium text-sm hover:bg-[#6b5b95] transition disabled:opacity-50"
            >
              {isSubmitting ? 'Verifying...' : 'Verify OTP & Complete Account'}
            </button>

            <p className="text-xs text-center text-slate-500 mt-4">
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setAuthError(''); setAuthSuccess(''); }}
                className="text-slate-500 hover:underline"
              >
                ← Back to Registration
              </button>
            </p>
          </form>
        )}
      </div>
    );
  }

  // --- Render Dashboard Interface ---
  return (
    <div className="space-y-6 max-w-6xl mx-auto my-2 md:my-4">
      {/* Top Bar with Logout */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-800">Welcome, {email || 'Administrator'}</h2>
          <p className="text-xs text-slate-500">Live College Complaint Overview</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-md transition"
        >
          Logout
        </button>
      </div>

      {/* Analytics Dashboard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Complaints</span>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm">
          <span className="text-xs font-bold text-amber-600 uppercase">Pending</span>
          <p className="text-2xl font-bold text-amber-700 mt-1">{stats.pending || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm">
          <span className="text-xs font-bold text-blue-600 uppercase">In Progress</span>
          <p className="text-2xl font-bold text-blue-700 mt-1">{stats.inProgress || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm">
          <span className="text-xs font-bold text-emerald-600 uppercase">Resolved</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{stats.resolved || 0}</p>
        </div>
      </div>

      {/* Complaints Table & Filter Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 mb-4 gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Manage Complaints Queue</h3>
            <p className="text-slate-500 text-xs mt-0.5">Filter by status, review images, assign departments, and update remarks.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Search by ID, name, branch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-slate-300 rounded px-3 py-1.5 text-xs outline-none focus:border-[#7c69af] w-48 sm:w-56"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-300 rounded px-3 py-1.5 text-xs outline-none focus:border-[#7c69af] bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
            <button
              onClick={loadDashboardData}
              className="bg-[#7c69af] text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-[#6b5b95] transition"
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-slate-500 text-sm py-8">Loading complaints...</p>
        ) : filteredComplaints.length === 0 ? (
          <p className="text-center text-slate-500 text-sm py-8">No matching complaints found.</p>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-sm min-w-[850px]">
              <thead className="bg-[#7c69af] text-white text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3 border-r border-[#8d7cbf]">Complaint ID</th>
                  <th className="p-3 border-r border-[#8d7cbf]">Student & Branch</th>
                  <th className="p-3 border-r border-[#8d7cbf]">Category & Location</th>
                  <th className="p-3 border-r border-[#8d7cbf]">Department</th>
                  <th className="p-3 border-r border-[#8d7cbf]">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {filteredComplaints.map((c) => (
                  <tr key={c.complaintId} className="hover:bg-slate-50 bg-white">
                    <td className="p-3 font-mono font-bold text-[#7c69af]">{c.complaintId}</td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800">{c.studentName}</div>
                      <div className="text-xs text-slate-500">{c.branch}</div>
                    </td>
                    <td className="p-3">
                      <div>{c.category}</div>
                      <div className="text-xs text-slate-500">{c.location}</div>
                    </td>
                    <td className="p-3">
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200">
                        {c.assignedDepartment || 'Unassigned'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          c.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : c.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-center space-x-2">
                      <button
                        onClick={() => handleOpenModal(c)}
                        className="bg-[#7c69af] text-white px-3 py-1 rounded text-xs font-medium hover:bg-[#6b5b95] transition"
                      >
                        Manage
                      </button>
                      <button
                        onClick={() => handleDelete(c.complaintId)}
                        className="bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded text-xs font-medium hover:bg-red-100 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Complaint Management Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">
              Manage Complaint: <span className="font-mono text-[#7c69af]">{selectedComplaint.complaintId}</span>
            </h3>

            <div className="text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded border space-y-1">
              <p><strong>Student:</strong> {selectedComplaint.studentName} ({selectedComplaint.branch})</p>
              <p><strong>Location:</strong> {selectedComplaint.location} ({selectedComplaint.category})</p>
              <p><strong>Description:</strong> {selectedComplaint.description}</p>
              
              {/* Proof Image Inline Thumbnail */}
              {selectedComplaint.imageUrl && (
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <strong className="block text-slate-700 mb-1">Attached Photographic Proof:</strong>
                  <img
                    src={selectedComplaint.imageUrl}
                    alt="Complaint Attachment"
                    onClick={() => setViewingImage(selectedComplaint.imageUrl)}
                    className="w-28 h-20 object-cover rounded border border-slate-300 cursor-pointer hover:opacity-90 shadow-sm transition"
                    title="Click to view full image"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">Click thumbnail to enlarge</span>
                </div>
              )}
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assign Concerned Department</label>
                <select
                  value={assignedDepartment}
                  onChange={(e) => setAssignedDepartment(e.target.value)}
                  className="w-full border p-2 rounded text-sm outline-none focus:border-[#7c69af] bg-white"
                >
                  <option value="General Maintenance">General Maintenance</option>
                  <option value="IT Support / Wi-Fi Cell">IT Support / Wi-Fi Cell</option>
                  <option value="Electrical Department">Electrical Department</option>
                  <option value="Civil / Infrastructure">Civil / Infrastructure</option>
                  <option value="Hostel Administration">Hostel Administration</option>
                  <option value="Academic Dean Office">Academic Dean Office</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border p-2 rounded text-sm outline-none focus:border-[#7c69af] bg-white"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Admin / Action Remark</label>
                <textarea
                  rows="3"
                  placeholder="Add remark (e.g. Electrician dispatched to replace bulb)..."
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  className="w-full border p-2 rounded text-sm outline-none focus:border-[#7c69af]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 border rounded-md text-sm text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#7c69af] text-white rounded-md text-sm hover:bg-[#6b5b95] font-medium transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full-Screen Image Lightbox */}
      {viewingImage && (
        <div
          className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4"
          onClick={() => setViewingImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] bg-white p-2 rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setViewingImage(null)}
              className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-md"
            >
              ✕
            </button>
            <img
              src={viewingImage}
              alt="Full Preview"
              className="max-h-[85vh] max-w-full rounded object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
