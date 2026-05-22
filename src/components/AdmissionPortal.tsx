/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ClipboardCheck, Sparkles, GraduationCap, 
  Send, CheckCircle2 
} from 'lucide-react';
import { AdmissionApplication } from '../types';

interface AdmissionPortalProps {
  onRegisterApplication: (app: AdmissionApplication) => void;
  onConsultAI: (config: { gpa: number; program: string; resumeSummary: string }) => void;
  activeApplication: AdmissionApplication | null;
}

export default function AdmissionPortal({
  onRegisterApplication,
  onConsultAI,
  activeApplication
}: AdmissionPortalProps) {
  
  // Registration form values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [degree, setDegree] = useState('Undergraduate');
  const [program, setProgram] = useState('B.Tech Computer Science & Engineering (CSE)');
  const [gpa, setGpa] = useState('3.85');
  const [resume, setResume] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle mock apply
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !gpa) {
      setErrorMsg("Please complete Name, Email, and GPA to evaluate eligibility.");
      return;
    }

    const gpaFloat = parseFloat(gpa);
    if (isNaN(gpaFloat) || gpaFloat < 0 || gpaFloat > 4.0) {
      setErrorMsg("GPA must be a valid number between 0.00 and 4.00.");
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const resp = await fetch("/api/admissions/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          degreeLevel: degree,
          program,
          gpa: gpaFloat,
          resumeSummary: resume
        })
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || "Failed to submit application portfolio.");
      }

      onRegisterApplication(data.application);

    } catch (err: any) {
      setErrorMsg(err.message || "Unable to submit application to computing core.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="admissions-integration-portal" className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left border-0">
      
      {/* Dynamic Application Evaluation Block (7 Cols) */}
      <div className="lg:col-span-12 xl:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
        
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5">
          <ClipboardCheck className="text-blue-600 w-5 h-5 shrink-0" />
          <div>
            <h3 className="text-md font-semibold text-slate-800 font-sans">
              ZIT Admission & Merit Assessment
            </h3>
            <p className="text-[11px] text-slate-400 font-mono text-left">
              EVALUATE YOUR PORTFOLIO IN 10 SECONDS
            </p>
          </div>
        </div>

        {activeApplication ? (
          /* Application status tracking dashboard list */
          <div className="p-1 space-y-5">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-emerald-650 font-mono uppercase tracking-wide font-bold">ASSESSMENT SUCCESS</span>
                <h4 className="text-sm font-semibold text-slate-800 mt-0.5 font-sans">
                  Portfolio Successfully Registered
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  Hi {activeApplication.name}, your portfolio for **{activeApplication.program}** has been processed through our automatic admissions evaluation engine.
                </p>

                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-left">
                    <span className="text-[9px] text-slate-500 font-mono uppercase block">System ID</span>
                    <span className="text-xs font-semibold font-mono text-slate-800">{activeApplication.applicationId}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-left">
                    <span className="text-[9px] text-slate-500 font-mono uppercase block">Academic Stand</span>
                    <span className="text-xs font-semibold font-mono text-emerald-600">{activeApplication.gpa.toFixed(2)} GPA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Application checklist progression */}
            <div>
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-tight block mb-3.5 font-semibold">Live Onboarding Checklist</span>
              <div className="space-y-3.5">
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center text-xs shrink-0 font-bold">✓</div>
                  <div>
                    <strong className="text-xs text-slate-800 font-sans block">Step 1: Application Form Submitted</strong>
                    <span className="text-[10px] text-slate-400 font-mono">Completed on {activeApplication.submissionDate}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center text-xs shrink-0 font-bold">✓</div>
                  <div>
                    <strong className="text-xs text-slate-800 font-sans block">Step 2: AI Evaluator Qualification Assessment</strong>
                    <span className="text-[10px] text-slate-400 font-mono">GPA requirement parsed: SUCCESS</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 animate-pulse flex items-center justify-center text-xs shrink-0 font-black">●</div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <strong className="text-xs text-slate-800 font-sans">Step 3: Admission Verdict Announcement</strong>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                        activeApplication.status === 'Scholarship Awarded' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {activeApplication.status}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-600 mt-1 leading-relaxed">
                      {activeApplication.status === 'Scholarship Awarded' 
                        ? "🎉 Amazing! Due to your high GPA score (>=3.80), you have been awarded the Zenith Excellence Merit Grant which covers up to 100% of your academic tuition bills!"
                        : "Congratulations! You have been accepted for counseling review. Zenith admissions advisors will call you within 24 working hours."}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <button 
              id="btn-re-apply"
              onClick={() => onRegisterApplication(null as any)}
              className="px-4 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-[11px] text-slate-600 font-mono hover:text-blue-600 hover:border-blue-500/20 cursor-pointer shadow-sm transition-colors"
            >
              &larr; Submit Another Assessment
            </button>

          </div>
        ) : (
          /* Application fillout fields */
          <form onSubmit={handleApply} className="space-y-4 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Full Name</label>
                <input 
                  id="apply-name"
                  type="text"
                  placeholder="e.g. Liam Sterling"
                  className="w-full bg-white border border-slate-200 py-3 px-4 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Email Address</label>
                <input 
                  id="apply-email"
                  type="email"
                  placeholder="e.g. liam@example.com"
                  className="w-full bg-white border border-slate-200 py-3 px-4 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-[10px] text-slate-450 font-mono uppercase mb-1">GPA (Out of 4.0)</label>
                <input 
                  id="apply-gpa"
                  type="number"
                  step="0.01"
                  min="0.0"
                  max="4.0"
                  placeholder="e.g. 3.85"
                  className="w-full bg-white border border-slate-200 py-3 px-4 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={gpa}
                  onChange={(e) => setGpa(e.target.value)}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] text-slate-450 font-mono uppercase mb-1">Target Program Interest</label>
                <select 
                  id="apply-program"
                  className="w-full bg-white border border-slate-200 py-3 px-4 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                >
                  <option>B.Tech Computer Science & Engineering (CSE)</option>
                  <option>B.Tech Artificial Intelligence & Machine Learning (AI-ML)</option>
                  <option>M.Tech Data Science & Analytics</option>
                  <option>B.Tech Robotics & Automation</option>
                  <option>B.Tech Aerospace Engineering</option>
                  <option>B.Des User Experience & Interaction Design</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] text-slate-405 font-mono uppercase">Skills / Past Projects Summary</label>
                <span className="text-[9px] text-slate-400 font-mono">Helps AI suggest career pathways</span>
              </div>
              <textarea 
                id="apply-resume"
                rows={3}
                placeholder="e.g. Proficient in Python, HTML. Developed a school attendance monitoring system. Interested in neural networks/robotics."
                className="w-full bg-white border border-slate-200 p-3.5 rounded-xl text-xs text-slate-805 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-sans"
                value={resume}
                onChange={(e) => setResume(e.target.value)}
              />
            </div>

            {errorMsg && (
              <p className="text-[11px] text-rose-600 bg-rose-50 px-3 py-2.5 rounded-xl border border-rose-200 font-mono">
                {errorMsg}
              </p>
            )}

            <button
              id="submit-assessment-btn"
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.99] text-white font-semibold font-sans text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Evaluating eligibility indexes..." : "Submit for Admission Assessment"}
            </button>
          </form>
        )}

      </div>

      {/* Career Counsel block (5 Cols) */}
      <div className="lg:col-span-12 xl:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between text-left">
        
        <div className="space-y-3.5">
          <div className="flex items-center gap-2">
            <Sparkles className="text-blue-600 w-5 h-5" />
            <h3 className="text-sm font-semibold text-slate-805 font-sans">
              AI Career Counsel Evaluation
            </h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            Ready to explore how your talents correlate with ZIT’s academic disciplines? Submit your skills above or check eligibility, then launch the AI analyzer.
          </p>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
            <h4 className="text-xs font-semibold text-slate-705 flex items-center gap-1">
              <GraduationCap className="w-4 h-4 text-blue-600" /> Customized Guidelines Provided (Demo Mode)
            </h4>
            <ul className="text-[11px] text-slate-500 space-y-1.5 list-disc pl-4 font-mono">
              <li>Automatic 100% scholarship eligibility checklist.</li>
              <li>Optimal engineering courses alignment score.</li>
              <li>Suggested project roadmaps at ZIT Innovation Lab.</li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            id="trigger-ai-evaluation-btn"
            onClick={() => {
              // Fire the AI consulting trigger back to app driver
              onConsultAI({
                gpa: parseFloat(gpa) || 3.85,
                program,
                resumeSummary: resume || "Enthusiastic candidate seeking technological fields."
              });
            }}
            className="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-blue-600/20 text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2 font-mono text-[11px] rounded-xl transition-all active:scale-98 cursor-pointer font-bold"
          >
            <Send className="w-3.5 h-3.5 text-blue-600" />
            Launch Interactive Career Advice Stream
          </button>
          <span className="text-[9.5px] text-slate-400 block text-center mt-1.5 font-mono">
            *This will automatically feed details to Zenia and slide open chat dashboard response
          </span>
        </div>

      </div>

    </div>
  );
}
