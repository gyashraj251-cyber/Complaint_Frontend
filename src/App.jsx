import React, { useState } from 'react';
import Navbar from './components/Navbar';
import StudentForm from './components/StudentForm';
import TrackStatus from './components/TrackStatus';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState('submit');

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans antialiased text-slate-800">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="ml-0 md:ml-64 pt-16 md:pt-20 px-3 sm:px-6 md:px-8 pb-12 transition-all">
        {activeTab === 'submit' && <StudentForm />}
        {activeTab === 'track' && <TrackStatus />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>
    </div>
  );
}