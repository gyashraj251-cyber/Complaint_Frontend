import React, { useState } from 'react';

// Navigation configuration array
const NAV_ITEMS = [
  {
    id: 'submit',
    label: 'Submit Complaint',
    breadcrumb: 'Lodge Complaint',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    id: 'track',
    label: 'Track Status',
    breadcrumb: 'Complaint Status',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    id: 'admin',
    label: 'Admin Portal',
    breadcrumb: 'Admin Portal',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export default function Navbar({ activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const currentItem = NAV_ITEMS.find((item) => item.id === activeTab);

  return (
    <>
      {/* --- MOBILE TOP HEADER --- */}
      <header className="md:hidden bg-[#1e2533] text-white px-4 h-16 flex items-center justify-between fixed top-0 left-0 right-0 z-30 shadow-md border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#6b589e] to-[#8d79c4] flex items-center justify-center text-white shadow-inner">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-sm tracking-wider block leading-none">CAMPUS PORTAL</span>
            <span className="text-[10px] text-slate-400 font-medium tracking-tight">Grievance System</span>
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[#7c69af]"
          aria-label="Toggle Navigation Menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* --- DESKTOP SIDEBAR + MOBILE FLYOUT --- */}
      <aside
        className={`w-64 bg-[#232b3b] text-slate-300 flex flex-col fixed left-0 top-0 bottom-0 z-20 shadow-2xl transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0 pt-16 md:pt-0' : '-translate-x-full'
        }`}
      >
        {/* Desktop Brand Header */}
        <div className="hidden md:flex p-5 border-b border-slate-700/50 items-center space-x-3 bg-[#1e2533]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6b589e] to-[#8d79c4] flex items-center justify-center text-white shadow-lg">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wider">CAMPUS PORTAL</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Grievance System</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">
            Main Menu
          </div>

          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative group ${
                  isActive
                    ? 'bg-[#7c69af] text-white shadow-md font-semibold'
                    : 'hover:bg-slate-700/40 text-slate-300 hover:text-white'
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full" />
                )}
                <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* --- DEVELOPMENT TEAM CREDIT FOOTER --- */}
        <div className="p-4 border-t border-slate-700/50 bg-[#1e2533]">
          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 text-center shadow-inner">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              System Credit
            </p>
            <p className="text-xs text-slate-200 mt-1 font-medium">
              Developed by Team{' '}
              <span className="text-[#a595cf] font-bold block sm:inline">
                Kinetic Minds
              </span>
            </p>
          </div>
        </div>
      </aside>

      {/* Backdrop overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-10 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* --- DESKTOP BREADCRUMB / TOPBAR --- */}
      <header className="hidden md:flex fixed top-0 right-0 left-64 bg-white/90 backdrop-blur-sm border-b border-slate-200 px-8 h-16 items-center justify-between z-10 shadow-xs">
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
          <div className="flex items-center text-slate-500 hover:text-slate-700 transition">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Home</span>
          </div>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-900">
            {currentItem?.breadcrumb || 'Dashboard'}
          </span>
        </nav>
      </header>
    </>
  );
}