/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  School, GraduationCap, Laptop, Sparkles, User, 
  MapPin, LogOut, Info, HeartHandshake, Layers,
  Lock, ShieldCheck, Fingerprint, ArrowRight, ShieldAlert, CheckCircle2
} from 'lucide-react';

import { Student, MapCoordinates, AdmissionApplication } from './types';
import InteractiveCampusMap from './components/InteractiveCampusMap';
import ChatbotPanel from './components/ChatbotPanel';
import StudentDashboard from './components/StudentDashboard';
import AdmissionPortal from './components/AdmissionPortal';

export default function App() {
  // Tab states: 'admissions' | 'dashboard'
  const [activeTab, setActiveTab] = useState<'admissions' | 'dashboard'>('admissions');
  
  // College state switcher: 'ZIT' | 'SVYASA'
  const [activeCollege, setActiveCollege] = useState<'ZIT' | 'SVYASA'>('ZIT');

  const handleSwitchCollege = (col: 'ZIT' | 'SVYASA') => {
    setActiveCollege(col);
    setLoggedInStudent(null);
    setHighlightedMapPin(undefined);
    setChatbotFillText('');
    setStudentIdInput('');
    setAuthError('');
    setRegisteredApp(null);
  };
  
  // Student authentication state
  const [studentIdInput, setStudentIdInput] = useState('');
  const [loggedInStudent, setLoggedInStudent] = useState<Student | null>(null);
  const [authError, setAuthError] = useState('');
  const [authenticating, setAuthenticating] = useState(false);

  // Map highlights synced from Chatbot signals
  const [highlightedMapPin, setHighlightedMapPin] = useState<MapCoordinates | undefined>(undefined);
  
  // Sychronized click text from Map to Chatbot input
  const [chatbotFillText, setChatbotFillText] = useState<string>('');

  // Sychronized application assessment state
  const [registeredApp, setRegisteredApp] = useState<AdmissionApplication | null>(null);

  // Authentication logic via Backend Secure API
  const handleStudentLogin = async (id: string) => {
    const cleanId = id.trim().toUpperCase();
    if (!cleanId) return;

    setAuthenticating(true);
    setAuthError('');

    try {
      const resp = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: cleanId })
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || "Login verification failed.");
      }

      setLoggedInStudent(data.student);
      setActiveTab('dashboard'); // Redirect to their beautiful dashboard immediately!
      
      // Auto-trigger clean chatbot feedback welcoming student
      setChatbotFillText('');
    } catch (err: any) {
      setAuthError(err.message || "Unable to reach database server.");
    } finally {
      setAuthenticating(false);
    }
  };

  // Synchronized callback when student submits payments inside dashboard
  const handlePaymentSync = (updatedStudent: Student) => {
    setLoggedInStudent(updatedStudent);
  };

  // Synchronized trigger when prospective applicants launch AI Career Evaluation 
  const handleAICounselingConsult = (config: { gpa: number; program: string; resumeSummary: string }) => {
    // We update the chatbot filling target to trigger the counselor prompt!
    const recommendationPrompt = `Analyze admissions fit and outline a study roadmap for high-school GPA of ${config.gpa} interested in ${config.program}. My skills: "${config.resumeSummary}"`;
    setChatbotFillText(recommendationPrompt);
    // Flash message trigger internally via Chatbot Panel's state
  };

  // Landmark selection trigger on Map click
  const handleLandmarkSelect = (landmarkName: string) => {
    setChatbotFillText(landmarkName);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* 1. TOP PREMIUM NAV BLOCK */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        
        {/* University Brand Label & Switcher */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 ${activeCollege === 'SVYASA' ? 'bg-orange-600 shadow-orange-500/10' : 'bg-blue-600 shadow-blue-500/10'} rounded-xl text-white shadow-lg transition-all duration-300`}>
              <School className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold font-sans tracking-tight text-slate-800 flex items-center gap-1.5 transition-all duration-300">
                {activeCollege === 'SVYASA' ? 'S-VYASA Bengaluru' : 'Zenith Institute of Technology'}
              </h1>
              <p className="text-[9px] text-slate-500 font-mono tracking-wider uppercase">
                {activeCollege === 'SVYASA' ? 'YOGA THERAPY & VEDIC LIFE SCIENCES' : 'METROPOLIS TECH INTEGRATED ECOSYSTEM'}
              </p>
            </div>
          </div>

          {/* S-VYASA vs ZIT segmented controller toggler */}
          <div id="university-selector" className="bg-slate-100 p-1 rounded-xl border border-slate-200/85 flex items-center gap-1">
            <button
              id="switch-college-zit"
              onClick={() => handleSwitchCollege('ZIT')}
              className={`px-3 py-1 rounded-lg text-[10px] font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer font-bold ${
                activeCollege === 'ZIT'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              ZIT TECH
            </button>
            <button
              id="switch-college-svyasa"
              onClick={() => handleSwitchCollege('SVYASA')}
              className={`px-3 py-1 rounded-lg text-[10px] font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer font-bold ${
                activeCollege === 'SVYASA'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              S-VYASA YOGA
            </button>
          </div>
        </div>

        {/* Dynamic Navigation Tabs Controls */}
        <div id="navigation-tabs" className="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex items-center gap-1 select-none">
          
          <button
            id="tab-admissions"
            onClick={() => setActiveTab('admissions')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold tracking-wide flex items-center gap-2 transition-all duration-200 cursor-pointer ${
              activeTab === 'admissions'
                ? `${activeCollege === 'SVYASA' ? 'bg-orange-600' : 'bg-blue-600'} text-white shadow-sm font-bold`
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/40'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Admissions Assessment
          </button>

          <button
            id="tab-student-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold tracking-wide flex items-center gap-2 transition-all duration-200 cursor-pointer ${
              activeTab === 'dashboard'
                ? `${activeCollege === 'SVYASA' ? 'bg-orange-600' : 'bg-blue-600'} text-white shadow-sm font-bold`
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/40'
            }`}
          >
            <Laptop className="w-4 h-4" />
            Student Portal {loggedInStudent && `(${loggedInStudent.name.split(' ')[0]})`}
          </button>

        </div>

        {/* Global Action items */}
        <div className="flex items-center gap-3">
          {loggedInStudent ? (
            <div className="flex items-center gap-3 bg-slate-100/60 p-1.5 pr-3 border border-slate-200 rounded-xl">
              <img 
                src={loggedInStudent.avatar} 
                alt={loggedInStudent.name} 
                className={`w-7 h-7 rounded-full object-cover border ${activeCollege === 'SVYASA' ? 'border-orange-500' : 'border-blue-600'}`}
                referrerPolicy="no-referrer"
              />
              <button
                id="student-logout-action"
                onClick={() => {
                  setLoggedInStudent(null);
                  setActiveTab('admissions');
                }}
                className="text-[11px] font-mono text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer font-bold"
                title="Log out of student session"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          ) : (
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1 ${activeCollege === 'SVYASA' ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'} rounded-lg`}>
              <Sparkles className={`w-3.5 h-3.5 ${activeCollege === 'SVYASA' ? 'text-orange-600' : 'text-blue-600'} animate-pulse`} />
              <span className={`text-[10.5px] font-mono ${activeCollege === 'SVYASA' ? 'text-orange-700' : 'text-blue-700'} uppercase tracking-widest font-semibold`}>
                {activeCollege === 'SVYASA' ? 'Saraswati AI Active' : 'Zenia AI Powered'}
              </span>
            </div>
          )}
        </div>

      </header>

      {/* 2. MAIN COCKPIT SECTION */}
      <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* COLUMN A: Dynamic content section (7 Cols / Switches based on current Tab) */}
        <div className="xl:col-span-12 xl:order-1 2xl:col-span-7 flex flex-col justify-start">
          
          <AnimatePresence mode="wait">
            {activeTab === 'admissions' && (
              <motion.div
                key="admissions-view"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
                className="h-full"
              >
                <div className="space-y-4 mb-5 text-left">
                  <span className={`text-[10px] ${activeCollege === 'SVYASA' ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-blue-50 text-blue-600 border-blue-200'} border font-mono px-3 py-1 rounded-full uppercase tracking-wider font-semibold animate-pulse`}>
                    {activeCollege === 'SVYASA' ? 'S-VYASA Yoga Admissions & Counsel' : 'ZIT Admissions & Engineering Counsel'}
                  </span>
                  <h2 className="text-2xl font-black font-sans tracking-tight text-slate-800 mt-2">
                    {activeCollege === 'SVYASA' ? 'Embark on Vedic Scientific Wellness' : 'Begin Your Technological Flight'}
                  </h2>
                  <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                    {activeCollege === 'SVYASA' 
                      ? 'Evaluate path fitments, discover eligibility for specialized Swami Vivekananda spiritual fellowships, and talk to Saraswati AI to match your clinical yoga goals.'
                      : 'Evaluate your high school credentials through our automated GPA criteria matrices, check your qualification for up to 100% tuition coverage scholarships, or talk to Zenia below to chart a custom subject path.'}
                  </p>
                </div>
                
                {/* Embedded prospective applicant modules */}
                <AdmissionPortal 
                  onRegisterApplication={(app) => {
                    setRegisteredApp(app);
                  }}
                  onConsultAI={handleAICounselingConsult}
                  activeApplication={registeredApp}
                />
              </motion.div>
            )}

            {activeTab === 'dashboard' && (
              <motion.div
                key="portal-view"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
                className="h-full"
              >
                {loggedInStudent ? (
                  /* Authenticated Student view dashboard lists */
                  <StudentDashboard 
                    student={loggedInStudent} 
                    onPaymentProcessed={handlePaymentSync}
                  />
                ) : (
                  /* Login Portal fallback */
                  <div className="max-w-xl mx-auto my-6 space-y-8">
                    
                    {/* Modern Dynamic Badge */}
                    <div id="login-portal-card" className="bg-white border border-slate-200/90 rounded-[32px] overflow-hidden shadow-lg shadow-slate-100/50 text-left transition-all duration-300">
                      
                      {/* Top Brand Banner Gradient */}
                      <div className={`h-3 py-1 ${activeCollege === 'SVYASA' ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`} />

                      <div className="p-8 sm:p-10 space-y-6">
                        
                        {/* Dynamic College Branding Header */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 pb-6 border-b border-slate-100">
                          <div className={`p-4 rounded-2xl ${
                            activeCollege === 'SVYASA' 
                              ? 'bg-orange-50 text-orange-600 border border-orange-100' 
                              : 'bg-blue-50 text-blue-600 border border-blue-100'
                          } transition-all duration-300 flex items-center justify-center shadow-inner`}>
                            {activeCollege === 'SVYASA' ? (
                              <div className="relative">
                                <span className="absolute inset-0 animate-ping opacity-25 bg-orange-400 rounded-full"></span>
                                <Fingerprint className="w-8 h-8 relative z-10" />
                              </div>
                            ) : (
                              <div className="relative">
                                <span className="absolute inset-0 animate-ping opacity-25 bg-blue-400 rounded-full"></span>
                                <Lock className="w-8 h-8 relative z-10" />
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-1.5 flex-1">
                            <span className={`text-[9px] font-mono font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full inline-block ${
                              activeCollege === 'SVYASA' 
                                ? 'bg-orange-50 text-orange-700 border border-orange-200/50' 
                                : 'bg-blue-50 text-blue-700 border border-blue-200/50'
                            }`}>
                              {activeCollege === 'SVYASA' ? 'S-VYASA Secure Intranet' : 'ZIT Central Academic Gateway'}
                            </span>
                            <h3 className="text-xl font-extrabold text-slate-800 font-sans tracking-tight">
                              Student Account Authorization
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
                              {activeCollege === 'SVYASA' 
                                ? 'Enter your S-VYASA roll number to check your yoga wellness schedules, clinical grades at Arogyadhama, and guru feedback.'
                                : 'Log in using your registered ZIT developer ID to inspect experimental grades, cloud lab credits, and outstanding tuition balances.'}
                            </p>
                          </div>
                        </div>

                        {/* Interactive Form Block */}
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                            <span>Student Registration Code</span>
                            <span className={`flex items-center gap-1 text-[9px] ${activeCollege === 'SVYASA' ? 'text-orange-600' : 'text-blue-600'}`}>
                              <ShieldCheck className="w-3.5 h-3.5" /> 256-BIT SECURED SESSION
                            </span>
                          </div>

                          <div className="relative flex items-center">
                            <div className="absolute left-4 text-slate-400 pointer-events-none">
                              {activeCollege === 'SVYASA' ? (
                                <User className="w-4 h-4 text-orange-500" />
                              ) : (
                                <Fingerprint className="w-4 h-4 text-blue-500" />
                              )}
                            </div>
                            <input 
                              id="input-student-auth-id"
                              type="text"
                              placeholder={activeCollege === 'SVYASA' ? "e.g. SVYASA-2026-004" : "e.g. ZIT-2026-004"}
                              className={`w-full bg-slate-50/50 hover:bg-slate-50 border-2 pl-11 pr-4 py-3.5 rounded-2xl text-xs font-mono font-semibold text-slate-800 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:bg-white focus:border-slate-300 ${
                                activeCollege === 'SVYASA' 
                                  ? 'border-slate-200 focus:ring-4 focus:ring-orange-500/10' 
                                  : 'border-slate-200 focus:ring-4 focus:ring-blue-500/10'
                              }`}
                              value={studentIdInput}
                              onChange={(e) => {
                                setStudentIdInput(e.target.value);
                                if (authError) setAuthError('');
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleStudentLogin(studentIdInput);
                              }}
                            />
                          </div>

                          {authError && (
                            <motion.div 
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-[11px] text-rose-700 bg-rose-50 p-3 rounded-2xl border border-rose-200/50 font-sans flex items-start gap-2.5 shadow-sm"
                            >
                              <ShieldAlert className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                              <div className="space-y-0.5">
                                <span className="font-bold">Authorization Rejected</span>
                                <p className="text-[10.5px] text-rose-600/90 font-mono tracking-tight leading-normal font-medium">{authError}</p>
                              </div>
                            </motion.div>
                          )}

                          <button
                            id="submit-auth-btn"
                            onClick={() => handleStudentLogin(studentIdInput)}
                            disabled={authenticating}
                            className={`w-full py-3.5 px-6 font-semibold font-sans text-xs tracking-wider rounded-2xl shadow-lg transition-all duration-200 cursor-pointer text-white flex items-center justify-center gap-2 transform active:scale-[0.98] ${
                              authenticating 
                                ? 'bg-slate-400 cursor-not-allowed shadow-none' 
                                : activeCollege === 'SVYASA' 
                                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-orange-500/15' 
                                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/15'
                            }`}
                          >
                            <span>{authenticating ? "Validating security session..." : "Verify credentials and login"}</span>
                            {!authenticating && <ArrowRight className="w-4 h-4 animate-pulse" />}
                          </button>
                        </div>

                      </div>
                    </div>

                    {/* Interactive Click-to-Autofill Credentials Section */}
                    <div className="bg-slate-200/50 p-6 rounded-3xl border border-slate-200/80 text-left space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-300/40 pb-2">
                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-pulse" /> Live Student Interactive Credentials
                        </span>
                        <span className="text-[9px] bg-slate-300/80 border border-slate-400/20 text-slate-600 px-2 py-0.5 rounded-md font-mono font-bold select-none">
                          TEST ACCOUNTS
                        </span>
                      </div>
                      
                      {activeCollege === 'SVYASA' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => {
                              setStudentIdInput('SVYASA-2026-004');
                              handleStudentLogin('SVYASA-2026-004');
                            }}
                            className="bg-white border border-slate-200/95 p-4 rounded-2xl hover:border-orange-500 hover:shadow-md hover:shadow-orange-500/5 text-left transition-all duration-300 group cursor-pointer flex gap-3 h-full items-start"
                          >
                            <img 
                              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80" 
                              alt="Vyasa Dev" 
                              className="w-10 h-10 rounded-full object-cover border-2 border-orange-500/20 group-hover:border-orange-500 shadow-sm"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-mono text-[8px] text-orange-700 bg-orange-100/80 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wide">YOGA M.SC</span>
                                <span className="text-[9px] font-mono font-bold text-slate-500">GPA 3.95</span>
                              </div>
                              <h4 className="text-xs text-slate-800 font-bold font-sans tracking-tight group-hover:text-orange-600 truncate">
                                Vyasa Dev
                              </h4>
                              <span className="text-[9px] text-slate-400 font-mono block">ID: SVYASA-2026-004</span>
                            </div>
                            <div className="p-1 rounded-full bg-slate-50 text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors self-center">
                              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setStudentIdInput('SVYASA-2026-088');
                              handleStudentLogin('SVYASA-2026-088');
                            }}
                            className="bg-white border border-slate-200/95 p-4 rounded-2xl hover:border-orange-500 hover:shadow-md hover:shadow-orange-500/5 text-left transition-all duration-300 group cursor-pointer flex gap-3 h-full items-start"
                          >
                            <img 
                              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80" 
                              alt="Aaditya Sharma" 
                              className="w-10 h-10 rounded-full object-cover border-2 border-orange-500/20 group-hover:border-orange-500 shadow-sm"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-mono text-[8px] text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wide">VEDIC B.SC</span>
                                <span className="text-[9px] font-mono font-bold text-slate-500">GPA 3.65</span>
                              </div>
                              <h4 className="text-xs text-slate-800 font-bold font-sans tracking-tight group-hover:text-orange-600 truncate">
                                Aaditya Sharma
                              </h4>
                              <span className="text-[9px] text-slate-400 font-mono block">ID: SVYASA-2026-088</span>
                            </div>
                            <div className="p-1 rounded-full bg-slate-50 text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors self-center">
                              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => {
                              setStudentIdInput('ZIT-2026-004');
                              handleStudentLogin('ZIT-2026-004');
                            }}
                            className="bg-white border border-slate-200/95 p-4 rounded-2xl hover:border-blue-600 hover:shadow-md hover:shadow-blue-500/5 text-left transition-all duration-300 group cursor-pointer flex gap-3 h-full items-start"
                          >
                            <img 
                              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
                              alt="Alex Rivera" 
                              className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/20 group-hover:border-blue-500 shadow-sm"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-mono text-[8px] text-blue-700 bg-blue-100/80 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wide">CS SENIOR</span>
                                <span className="text-[9px] font-mono font-bold text-slate-500">GPA 3.92</span>
                              </div>
                              <h4 className="text-xs text-slate-800 font-bold font-sans tracking-tight group-hover:text-blue-600 truncate">
                                Alex Rivera
                              </h4>
                              <span className="text-[9px] text-slate-400 font-mono block">ID: ZIT-2026-004</span>
                            </div>
                            <div className="p-1 rounded-full bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors self-center">
                              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setStudentIdInput('ZIT-2026-088');
                              handleStudentLogin('ZIT-2026-088');
                            }}
                            className="bg-white border border-slate-200/95 p-4 rounded-2xl hover:border-blue-600 hover:shadow-md hover:shadow-blue-500/5 text-left transition-all duration-300 group cursor-pointer flex gap-3 h-full items-start"
                          >
                            <img 
                              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80" 
                              alt="Sarah Chen" 
                              className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/20 group-hover:border-blue-500 shadow-sm"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-mono text-[8px] text-indigo-700 bg-indigo-100/80 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wide">CRYPTO SOPH</span>
                                <span className="text-[9px] font-mono font-bold text-slate-500">GPA 3.75</span>
                              </div>
                              <h4 className="text-xs text-slate-800 font-bold font-sans tracking-tight group-hover:text-blue-600 truncate">
                                Sarah Chen
                              </h4>
                              <span className="text-[9px] text-slate-400 font-mono block">ID: ZIT-2026-088</span>
                            </div>
                            <div className="p-1 rounded-full bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors self-center">
                              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* COLUMN B: Interactive AI Assistant & Map layout (5 Cols) */}
        <div id="right-dashboard-cockpit" className="xl:col-span-12 xl:order-2 2xl:col-span-5 flex flex-col gap-6">
          
          {/* Top segment: Campus map */}
          <div className="h-[46%] w-full min-h-[300px]">
            <InteractiveCampusMap 
              highlightedPin={highlightedMapPin} 
              onSelectLandmark={handleLandmarkSelect}
              college={activeCollege}
            />
          </div>

          {/* Bottom segment: Chatbot console */}
          <div className="h-[54%] w-full min-h-[400px]">
            <ChatbotPanel 
              studentId={loggedInStudent?.id || null}
              onReceiveCoordinates={(coords) => setHighlightedMapPin(coords)}
              onLoginRequest={() => {
                setActiveTab('dashboard');
                setAuthError("Please login to view personalized academic progress reports.");
              }}
              onApplicationShorthand={(data) => {
                setRegisteredApp(data);
              }}
              externalPromptText={chatbotFillText}
              college={activeCollege}
            />
          </div>

        </div>

      </main>

      {/* 3. Humble human-label footer */}
      <footer className="bg-white border-t border-slate-200 p-4 text-center text-[10px] text-slate-400 font-mono tracking-tight select-none mt-auto font-bold uppercase">
        {activeCollege === 'SVYASA' 
          ? 'Swami Vivekananda Yoga Anusandhana Samsthana • Prashanti Kutiram ERP • Powered by Saraswati Advisor'
          : 'Zenith Institute of Technology • Digital Intercom ERP v1.42 • Powered by Zenia Advisor'}
      </footer>

    </div>
  );
}
