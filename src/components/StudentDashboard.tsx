/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, DollarSign, Calendar, Landmark, 
  Award, TrendingUp, CheckCircle, Clock, Bell, RefreshCw 
} from 'lucide-react';
import { Student } from '../types';

interface StudentDashboardProps {
  student: Student;
  onPaymentProcessed: (updatedStudent: Student) => void;
}

export default function StudentDashboard({ 
  student, 
  onPaymentProcessed 
}: StudentDashboardProps) {
  
  const isSvyasa = student.id.startsWith("SVYASA");
  const currencySymbol = isSvyasa ? "₹" : "$";

  const [payAmount, setPayAmount] = useState<number>(student.outstandingBalance);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Handle billing payment via API
  const handleSettleBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) {
      setErrorMsg("Please specify a payment volume greater than zero.");
      return;
    }

    setProcessingPayment(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const resp = await fetch("/api/student/pay-fee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student.id,
          paymentAmount: payAmount
        })
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || "Payment transaction declined.");
      }

      setSuccessMsg(data.message);
      onPaymentProcessed(data.student);
      setPayAmount(data.student.outstandingBalance);

    } catch (err: any) {
      setErrorMsg(err.message || "Unable to reach billing clearance.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const outstandingVal = student.outstandingBalance;

  // Gauge calculations for SVGs
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  
  // 1. GPA Gauge percentage (e.g. 3.92/4.00 = 98%)
  const gpaPercent = (student.gpa / 4.0) * 100;
  const gpaStrokeDashoffset = circumference - (gpaPercent / 100) * circumference;

  // 2. Attendance Gauge mapping (e.g. 94.5%)
  const attStrokeDashoffset = circumference - (student.attendanceRate / 100) * circumference;

  // 3. Overall credit meter progress (completed / total)
  const creditPercent = (student.completedCredits / student.totalCredits) * 100;

  return (
    <div id="personalized-student-dashboard" className="space-y-6 text-left">
      
      {/* 1. Header Student Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 border border-indigo-900 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden text-white">
        {/* Abstract background graphics */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-5">
          <div className="relative">
            <img 
              id="student-profile-avatar"
              src={student.avatar} 
              alt={student.name} 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-400 shadow-lg"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1 rounded-full text-[8.5px] font-mono font-black border-2 border-slate-900">
              LVL {student.semester}
            </span>
          </div>

          <div className="text-left">
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="student-profile-name" className="text-xl font-bold font-sans tracking-tight">
                {student.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-[10px] text-indigo-300 font-mono">
                {student.id}
              </span>
            </div>
            
            <p className="text-xs text-indigo-200 mt-1 max-w-sm tracking-wide">
              {student.degree} &mdash; <strong className="text-indigo-300 font-medium">{student.major}</strong>
            </p>

            <div className="flex flex-wrap items-center gap-4 text-[10.5px] text-slate-300 font-mono mt-2 divide-x divide-slate-800">
              <span className="flex items-center gap-1">Advising Office: {student.advisorName}</span>
              <span className="pl-3 text-indigo-300">{student.advisorEmail}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Metric badging */}
        <div className="flex items-center gap-3 shrink-0 bg-white/5 p-3.5 border border-white/10 rounded-2xl backdrop-blur-sm">
          <Award className="w-8 h-8 text-indigo-400 shrink-0" />
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-mono block uppercase tracking-wider">Academic Standing</span>
            <span className="text-sm font-semibold tracking-wide text-white font-sans">
              {student.gpa >= 3.8 ? "Summa Cum Laude" : "Excellence Honors"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Visual Progress Gauges Panel (Bento Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* GPA Circular Gauge */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between gap-2.5">
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Active CGPA Index</span>
            <h3 id="metric-gpa-val" className="text-2xl font-bold text-slate-800 font-sans mt-0.5">
              {student.gpa.toFixed(2)}<span className="text-xs text-slate-400 font-normal"> / 4.00</span>
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed mt-1.5">
              Refined ratio of subject scores spanning {student.semester} levels.
            </p>
          </div>

          {/* Styled Circular Gauge Visual */}
          <div className="relative w-23 h-23 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="45" cy="45" r={radius} className="stroke-slate-100 fill-transparent" strokeWidth="6" />
              <circle 
                cx="45" 
                cy="45" 
                r={radius} 
                className="stroke-blue-600 fill-transparent transition-all duration-1000 ease-out" 
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={gpaStrokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute font-mono text-xs text-blue-600 font-bold tracking-tighter">
              {gpaPercent.toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Attendance Circle Gauge */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between gap-2.5">
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Attendance Ratio</span>
            <h3 id="metric-attendance-val" className="text-2xl font-bold text-slate-800 font-sans mt-0.5">
              {student.attendanceRate}%
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed mt-1.5">
              Standard check-ins across labs workshops and lectures.
            </p>
          </div>

          <div className="relative w-23 h-23 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="45" cy="45" r={radius} className="stroke-slate-100 fill-transparent" strokeWidth="6" />
              <circle 
                cx="45" 
                cy="45" 
                r={radius} 
                className="stroke-emerald-500 fill-transparent transition-all duration-1000 ease-out" 
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={attStrokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute font-mono text-xs text-emerald-600 font-bold tracking-tighter">
              A-OK
            </div>
          </div>
        </div>

        {/* Credit Tracker Progression Meter */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between text-left">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono uppercase">Degree Accomplishment</span>
            <span className="text-[10px] text-slate-500 font-mono font-medium">{student.completedCredits} / {student.totalCredits} Credits</span>
          </div>

          <div className="mt-3">
            <h3 className="text-lg font-bold text-slate-800 font-sans">
              {creditPercent.toFixed(0)}% Complete
            </h3>
            
            {/* Horizontal progress bar track */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-2 border border-slate-200/50">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                style={{ width: `${creditPercent}%` }}
              ></div>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 font-mono mt-3">
            🎯 Requirement remaining: {student.totalCredits - student.completedCredits} credits left to qualify graduation.
          </p>
        </div>

      </div>

      {/* 3. Outstanding billing & Enrolled courses bento grid section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Dynamic outstanding statement (5 cols) */}
        <div className="lg:col-span-12 xl:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col text-left">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <Landmark className={`w-5 h-5 ${isSvyasa ? 'text-orange-600' : 'text-blue-600'}`} />
            <h3 className="text-sm font-semibold text-slate-800 font-sans">
              Tuition Statements & Settle
            </h3>
          </div>

          {/* Bill information */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-semibold">Total Dues Outstanding</p>
            <h4 id="student-outstanding-amount" className={`text-3xl font-bold font-mono mt-1 ${
              outstandingVal > 0 ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {currencySymbol}{outstandingVal.toLocaleString()}
            </h4>
            <p className="text-[10px] text-slate-400 leading-normal mt-2">
              {outstandingVal > 0 
                ? (isSvyasa ? "Saddhana residence fee and clinical internship charge pending Sem 3 cycle." : "Academic lab accessories clearance pending course cycle.")
                : "Accounts settled. No pending program clearances."}
            </p>
          </div>

          {/* Settle outstanding balance form */}
          {outstandingVal > 0 && (
            <form onSubmit={handleSettleBalance} className="mt-4 space-y-3">
              <div>
                <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Payment Amount ({currencySymbol})</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-600 text-xs">{currencySymbol}</span>
                  <input 
                    id="input-payment-val"
                    type="number"
                    max={outstandingVal}
                    min={1}
                    className={`w-full bg-white pl-7 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs font-mono text-slate-850 focus:outline-none focus:ring-2 ${isSvyasa ? 'focus:ring-orange-500' : 'focus:ring-blue-500'}`}
                    value={payAmount}
                    onChange={(e) => setPayAmount(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-[10.5px] text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 font-mono">
                  {errorMsg}
                </p>
              )}

              {successMsg && (
                <p className="text-[10.5px] text-emerald-600 bg-emerald-50 p-2.5 rounded-xl border border-emerald-250 font-mono">
                  {successMsg}
                </p>
              )}

              <button
                id="btn-trigger-pay"
                type="submit"
                disabled={processingPayment}
                className={`w-full py-3 ${isSvyasa ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-sans text-xs font-bold rounded-xl shadow-md cursor-pointer disabled:opacity-50 transition-colors`}
              >
                {processingPayment ? "Clearing Transaction..." : "Fast Settle Dues"}
              </button>
            </form>
          )}

          {/* Transaction logs */}
          <div className="mt-4 flex-1">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-tight block mb-2 font-semibold">Recent Logs</span>
            <div className="space-y-2 max-h-[140px] overflow-y-auto no-scrollbar">
              {student.paymentHistory.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between text-[11px] bg-slate-50 p-3 border border-slate-100 rounded-xl">
                  <div>
                    <span className="font-mono text-slate-700 block font-medium">{txn.purpose}</span>
                    <span className="text-[9px] text-slate-400 font-mono">{txn.date} &bull; {txn.id}</span>
                  </div>
                  <span className={`font-mono font-bold ${isSvyasa ? 'text-orange-650' : 'text-blue-600'}`}>+{currencySymbol}{txn.amount}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Current Semester Enrolled Courses (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col text-left">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-105 pb-3 justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-semibold text-slate-800 font-sans">
                Active Enrolled Courses ({student.courses.length})
              </h3>
            </div>
            <span className="text-[10px] text-slate-455 font-mono">Semester {student.semester}</span>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[420px] pr-1">
            {student.courses.map((course) => (
              <div 
                key={course.code} 
                className="bg-slate-50 border border-slate-205 rounded-2xl p-4 shadow-sm space-y-2.5 transition-all hover:border-blue-500/20"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] tracking-wide text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded font-bold">
                        {course.code}
                      </span>
                      <strong className="text-xs font-semibold text-slate-800 font-sans line-clamp-1">
                        {course.name}
                      </strong>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">Instructor: {course.instructor} &bull; {course.credits} Credits</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 font-mono block">Expected Grade</span>
                    <strong className="text-xs font-mono font-bold text-blue-600">{course.grade}</strong>
                  </div>
                </div>

                {/* Performance meters: Attendance & Syllabus Progress */}
                <div className="grid grid-cols-2 gap-4 pt-1.5 border-t border-slate-200">
                  <div>
                    <div className="flex justify-between text-[9px] text-slate-500 font-mono mb-1">
                      <span>Attendance Tracker</span>
                      <span className={course.attendance >= 85 ? 'text-emerald-600 font-bold' : 'text-amber-500 font-bold'}>
                        {course.attendance}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden border border-slate-300/10">
                      <div 
                        className={`h-full rounded-full ${course.attendance >= 85 ? 'bg-emerald-505' : 'bg-amber-400'}`} 
                        style={{ width: `${course.attendance}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[9px] text-slate-500 font-mono mb-1">
                      <span>Syllabus Progress</span>
                      <span className="text-blue-600 font-bold">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden border border-slate-300/10">
                      <div 
                        className="bg-blue-600 h-full rounded-full" 
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

      {/* 4. Notification Alerts Center */}
      {student.notifications.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-left">
          <div className="flex items-center gap-2 mb-3.5">
            <Bell className="w-4 h-4 text-blue-600 animate-bounce" />
            <h3 className="text-xs font-semibold text-slate-850 font-sans uppercase tracking-wider">
              Recent System Alerts & Action Required
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {student.notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-4 border rounded-2xl flex items-start gap-3 transition-all ${
                  notif.type === 'finance' 
                    ? 'bg-amber-50/50 border-amber-200 text-slate-800' 
                    : notif.type === 'academic' 
                    ? 'bg-blue-50/50 border-blue-200 text-slate-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                  notif.type === 'finance' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 justify-between">
                    <strong className="text-xs font-bold font-sans text-slate-800 truncate">{notif.title}</strong>
                    <span className="text-[9px] font-mono text-slate-400 shrink-0">{notif.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-normal">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
