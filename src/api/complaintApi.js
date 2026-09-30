import axios from 'axios';

// Dynamically uses Vercel environment variable in production, falls back to local in dev
const API_BASE_URL = "https://complaint-backend-ou0s.onrender.com";

// Central Axios instance for standard configurations
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ==========================================================
   PUBLIC STUDENT ENDPOINTS
   ========================================================== */

// Submit a new complaint
export const submitComplaint = (data) => 
  api.post('/complaints/submit', data);

// Track complaint status by ID
export const trackComplaint = (id) => 
  api.get(`/complaints/track/${id}`);

/* ==========================================================
   ADMIN PORTAL ENDPOINTS
   ========================================================== */

// Fetch all complaints for admin dashboard
export const fetchAllComplaints = () => 
  api.get('/complaints/admin/all');

// Fetch dashboard statistical metrics
export const fetchStats = () => 
  api.get('/complaints/admin/stats');

// Update complaint details (status, remark, assigned department)
export const updateComplaintDetails = (id, { status, remark, department }) =>
  api.put(`/complaints/admin/update/${id}`, null, {
    params: { status, remark, department }
  });

// Update status and remark only
export const updateComplaintStatus = (id, status, remark) =>
  api.put(`/complaints/admin/update/${id}`, null, {
    params: { status, remark }
  });

// Delete a complaint record by ID
export const deleteComplaint = (id) =>
  api.delete(`/complaints/admin/delete/${id}`);

export default api;