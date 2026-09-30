import React, { useState, useRef } from 'react';
import { submitComplaint } from '../api/complaintApi';
import { 
  Wrench, 
  Wifi, 
  Building2, 
  Zap, 
  Sparkles, 
  BookOpen, 
  MapPin, 
  User, 
  GraduationCap, 
  FileText, 
  Upload, 
  X, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertCircle,
  Clock,
  ChevronRight
} from 'lucide-react';

const CATEGORIES = [
  { id: 'Infrastructure', label: 'Civil & Infra', icon: Building2, desc: 'Benches, doors, windows, structural repairs' },
  { id: 'Electrical', label: 'Electrical & AC', icon: Zap, desc: 'Fans, switchboards, ACs, faulty wiring' },
  { id: 'Wi-Fi & Network', label: 'Wi-Fi & Network', icon: Wifi, desc: 'Hotspots, slow speed, LAN ports' },
  { id: 'Lab Equipment', label: 'Lab & Systems', icon: Wrench, desc: 'Computers, machines, instruments' },
  { id: 'Hostel', label: 'Hostel Living', icon: Sparkles, desc: 'Cleanliness, water coolers, washrooms' },
  { id: 'Academics', label: 'Library & Classes', icon: BookOpen, desc: 'Audio-visuals, books, schedules' }
];

export default function StudentForm() {
  const [formData, setFormData] = useState({
    studentName: '',
    branch: '',
    category: 'Infrastructure',
    description: '',
    location: '',
    imageUrl: ''
  });

  const [isAnonymous, setIsAnonymous] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [submittedId, setSubmittedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds 2 MB. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCopyId = () => {
    if (!submittedId) return;
    navigator.clipboard.writeText(submittedId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      studentName: isAnonymous ? 'Anonymous Student' : formData.studentName.trim(),
      branch: isAnonymous && !formData.branch.trim() ? 'Confidential' : formData.branch.trim()
    };

    try {
      const res = await submitComplaint(payload);
      setSubmittedId(res.data.complaintId);
    } catch (err) {
      alert('Failed to register complaint. Please verify your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmittedId(null);
    setIsAnonymous(false);
    setImagePreview(null);
    setFormData({
      studentName: '',
      branch: '',
      category: 'Infrastructure',
      description: '',
      location: '',
      imageUrl: ''
    });
  };

  return (
    /* ADDED pt-16 md:pt-20 TO PREVENT TOP FIXED HEADER OVERLAP */
    <div className="max-w-4xl mx-auto pt-16 md:pt-20 pb-10 px-4 space-y-6">
      {/* Problem-Solving Action Banner */}
      <div className="bg-gradient-to-r from-[#2b3548] to-[#3b475e] text-white rounded-2xl p-6 md:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#7c69af]/40 text-purple-200 border border-purple-400/30 mb-3">
            <AlertCircle className="w-3.5 h-3.5" /> Rapid Grievance Resolution Cell
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            See a problem on campus? Let us fix it.
          </h1>
          <p className="text-slate-300 text-xs md:text-sm mt-2 leading-relaxed">
            Report infrastructure damage, lab malfunctions, network drops, or hostel issues. 
            Every ticket is routed directly to the department technician.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-5 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-300" /> 24-48 hr response goal
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-300" /> Identity protection option
            </div>
          </div>
        </div>

        {/* Decorative Watermark Icon */}
        <div className="absolute -right-6 -bottom-6 text-white/5 pointer-events-none hidden md:block">
          <Wrench className="w-64 h-64 transform rotate-12" />
        </div>
      </div>

      {submittedId ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-inner">
            ✓
          </div>
          <h2 className="text-xl font-bold text-slate-800">Your Ticket Has Been Dispatched!</h2>
          <p className="text-xs text-slate-500 mt-1">
            Department supervisors have been notified. Use this reference code to track live progress:
          </p>

          <div className="flex items-center justify-center gap-2 my-5">
            <div className="bg-slate-50 border border-[#7c69af]/40 text-[#7c69af] font-mono font-extrabold text-2xl py-2.5 px-6 rounded-xl shadow-sm">
              {submittedId}
            </div>
            <button
              onClick={handleCopyId}
              type="button"
              className="p-3 bg-[#7c69af] hover:bg-[#6b5b95] text-white rounded-xl transition shadow-sm"
              title="Copy Reference ID"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          <p className="text-[11px] text-slate-400 mb-6">
            Click over to the <strong>Track Status</strong> tab anytime to inspect progress updates and staff remarks.
          </p>

          <button
            onClick={handleReset}
            className="w-full bg-[#7c69af] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#6b5b95] transition shadow"
          >
            Submit Another Ticket
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-7 md:p-8 space-y-7">
          {/* Step 1: Select Issue Category Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>1. Select Issue Type</span>
                <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Routes to the matching department</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = formData.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.id })}
                    className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#7c69af] bg-[#7c69af]/10 ring-1 ring-[#7c69af] shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mb-2 ${isSelected ? 'bg-[#7c69af] text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-bold ${isSelected ? 'text-[#7c69af]' : 'text-slate-800'}`}>
                      {cat.label}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {cat.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Location Coordinate Details */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <span>2. Where is the issue located?</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. Science Block, 3rd Floor, Physics Lab Room 302, Bench #4"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-[#7c69af] focus:ring-2 focus:ring-[#7c69af]/20 bg-slate-50/50 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Step 3: Issue Description */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-400" />
                <span>3. What is broken or malfunctioning?</span>
                <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">{formData.description.length}/500</span>
            </div>
            <textarea
              required
              rows="4"
              maxLength="500"
              placeholder="Explain the problem clearly so repair staff brings the right tools (e.g. Power outlet sparking when laptop plugged in, ceiling fan making high noise)..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-[#7c69af] focus:ring-2 focus:ring-[#7c69af]/20 bg-slate-50/50 focus:bg-white transition"
            />
          </div>

          {/* Step 4: Photographic Proof Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
              4. Attach Photo Evidence (Speeds up approval)
            </label>

            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="border-2 border-dashed border-slate-300 hover:border-[#7c69af] rounded-2xl p-6 text-center cursor-pointer transition bg-slate-50/50 hover:bg-[#7c69af]/5 group"
              >
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition">
                  <Upload className="w-6 h-6 text-[#7c69af]" />
                </div>
                <p className="text-xs text-slate-700 font-semibold">Take a photo or upload screenshot</p>
                <p className="text-[11px] text-slate-400 mt-0.5">JPG, PNG, or WEBP up to 2 MB</p>
              </div>
            ) : (
              <div className="relative w-44 h-32 rounded-xl overflow-hidden border border-slate-300 shadow-sm">
                <img src={imagePreview} alt="Complaint preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1 rounded-full transition"
                  title="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Step 5: Student Details & Confidentiality Toggle */}
          <div className="border-t border-slate-100 pt-6">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 text-[#7c69af]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Report Anonymously</span>
                  <span className="text-[11px] text-slate-500">Your name and personal identification will stay protected.</span>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c69af]"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Student Name {!isAnonymous && <span className="text-red-500">*</span>}</span>
                </label>
                <input
                  type="text"
                  required={!isAnonymous}
                  disabled={isAnonymous}
                  placeholder={isAnonymous ? 'Confidential' : 'Enter your full name'}
                  value={isAnonymous ? '' : formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-[#7c69af] focus:ring-2 focus:ring-[#7c69af]/20 bg-white disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  <span>Branch / Department {!isAnonymous && <span className="text-red-500">*</span>}</span>
                </label>
                <input
                  type="text"
                  required={!isAnonymous}
                  disabled={isAnonymous}
                  placeholder={isAnonymous ? 'Hidden' : 'e.g. Information Technology'}
                  value={isAnonymous ? '' : formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-[#7c69af] focus:ring-2 focus:ring-[#7c69af]/20 bg-white disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Action Submission */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#7c69af] hover:bg-[#6b5b95] text-white font-semibold px-9 py-3 rounded-xl text-sm transition shadow-md disabled:opacity-50"
            >
              {loading ? (
                <span>Lodging Ticket...</span>
              ) : (
                <>
                  <span>Submit Grievance For Repair</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}