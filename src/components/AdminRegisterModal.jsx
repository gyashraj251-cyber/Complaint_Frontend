import React, { useState } from 'react';
import { registerAdmin, verifyOtp } from '../api'; // Ensure path matches your api.js location

export default function AdminRegisterModal({ onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1: Details & Secret Key, 2: OTP Verification
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // Calls backend endpoint (/api/admin/register) via central Axios instance
      const response = await registerAdmin({ email, password, secretKey });
      alert(response.data?.message || `OTP sent successfully to ${email}`);
      setStep(2);
    } catch (err) {
      console.error("Registration request failed:", err);
      setErrorMsg(err.response?.data?.message || 'Failed to register. Verify secret key.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // Calls backend endpoint (/api/admin/verify-otp) via central Axios instance
      const response = await verifyOtp({ email, otp });
      alert(response.data?.message || 'Admin account created and verified successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      console.error("OTP verification failed:", err);
      setErrorMsg(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
        <h3 className="text-lg font-bold text-slate-800 mb-4">
          {step === 1 ? 'Register New Admin' : 'Enter Email OTP'}
        </h3>

        {errorMsg && (
          <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-600">
            {errorMsg}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Admin Email</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full border p-2 rounded text-sm outline-none focus:border-indigo-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full border p-2 rounded text-sm outline-none focus:border-indigo-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Secret Admin Creation Key</label>
              <input 
                type="password" 
                required 
                placeholder="Enter master key" 
                value={secretKey} 
                onChange={(e) => setSecretKey(e.target.value)} 
                className="w-full border p-2 rounded text-sm outline-none focus:border-indigo-500" 
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={onClose} 
                disabled={loading}
                className="px-4 py-2 border rounded text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-4 py-2 bg-[#7c69af] hover:bg-[#6b589e] text-white rounded text-sm font-medium disabled:opacity-50"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-xs text-slate-500">We have sent a 6-digit verification code to <strong>{email}</strong>.</p>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Enter 6-Digit OTP</label>
              <input 
                type="text" 
                maxLength="6" 
                required 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                className="w-full border p-2 rounded text-sm tracking-widest text-center font-bold outline-none focus:border-emerald-500" 
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => {
                  setErrorMsg('');
                  setStep(1);
                }} 
                disabled={loading}
                className="px-4 py-2 border rounded text-sm hover:bg-slate-50"
              >
                Back
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm font-medium disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify & Register'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
