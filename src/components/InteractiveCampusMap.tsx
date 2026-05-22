/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MapPin, Compass, Navigation2, Info } from 'lucide-react';
import { MapCoordinates } from '../types';
import { ZENITH_COLLEGE_INFO, SVYASA_COLLEGE_INFO } from '../data/mockData';

interface InteractiveCampusMapProps {
  highlightedPin?: MapCoordinates;
  onSelectLandmark: (landmarkName: string) => void;
  college?: 'ZIT' | 'SVYASA';
}

export default function InteractiveCampusMap({ 
  highlightedPin, 
  onSelectLandmark,
  college = 'ZIT'
}: InteractiveCampusMapProps) {
  
  const isSvyasa = college === 'SVYASA';
  const landmarks = isSvyasa ? SVYASA_COLLEGE_INFO.mapLocations : ZENITH_COLLEGE_INFO.mapLocations;

  const primaryText = isSvyasa ? 'text-orange-600' : 'text-blue-600';
  const primaryBg = isSvyasa ? 'bg-orange-600' : 'bg-blue-600';
  const lightBg = isSvyasa ? 'bg-orange-50' : 'bg-blue-50';
  const lightBorder = isSvyasa ? 'border-orange-100' : 'border-blue-100';
  const ringColor = isSvyasa ? 'ring-orange-500/20' : 'ring-blue-500/20';
  const askBotName = isSvyasa ? 'Saraswati' : 'Zenia';

  return (
    <div id="campus-blueprint" className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm relative flex flex-col h-full min-h-[460px]">
      
      {/* Blueprint Grid Header */}
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className={`w-5 h-5 ${primaryText} animate-spin-slow`} />
          <div>
            <h3 className="text-sm font-semibold text-slate-800 font-sans tracking-tight">
              {isSvyasa ? "Gurukula Campus Layout" : "Interactive Campus Blueprint"}
            </h3>
            <p className="text-[10px] text-slate-500 font-mono">
              {isSvyasa ? "PRASHANTI KUTIRAM ECO-CAMPUS • BENGALURU" : "VERDANT METRO HEIGHTS CAMPUS • SPECIALIZED POSITION GAUGE"}
            </p>
          </div>
        </div>
        
        <div className={`flex items-center gap-2 px-2 py-0.5 rounded-lg ${lightBg} border ${lightBorder}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${primaryBg} animate-ping`}></span>
          <span className={`text-[10px] ${isSvyasa ? 'text-orange-700' : 'text-blue-700'} font-mono tracking-wider uppercase font-semibold`}>Telemetry Live</span>
        </div>
      </div>

      {/* Blueprint Map Vector Area Area with beautiful grid lines */}
      <div className="flex-1 relative bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:16px_16px] overflow-hidden min-h-[320px] select-none bg-slate-50/50">
        
        {/* Subtle grid elements */}
        <div className="absolute inset-0 opacity-20 flex flex-col justify-between pointer-events-none p-2 font-mono text-[9px] text-slate-400">
          <div className="flex justify-between">
            <span>COORDINATE [0,0]</span>
            <span>SPACE REF [0.5]</span>
            <span>MEDITATION_NORTH</span>
          </div>
          <div className="flex justify-between">
            <span>INDEX_X_{isSvyasa ? "SVYASA" : "ZIT"}</span>
            <span>INDEX_Y_BLUEPRINT</span>
            <span>SAHA_LEVEL_410m</span>
          </div>
        </div>

        {/* Highlighted coordinate sonar beacon */}
        {highlightedPin && (
          <div 
            className="absolute transition-all duration-1000 ease-out z-10 pointer-events-none"
            style={{ left: `${highlightedPin.x}%`, top: `${highlightedPin.y}%` }}
          >
            <div className="relative -ml-6 -mt-6 w-12 h-12 flex items-center justify-center">
              <span className={`absolute inline-flex h-full w-full rounded-full ${primaryBg} opacity-20 animate-ping`}></span>
              <span className={`absolute inline-flex h-8 w-8 rounded-full ${isSvyasa ? 'bg-orange-500' : 'bg-blue-500'} opacity-35 animate-ping [animation-delay:0.3s]`}></span>
              <span className={`absolute inline-flex h-4 w-4 rounded-full ${isSvyasa ? 'bg-orange-400' : 'bg-blue-450'} opacity-50 animate-ping [animation-delay:0.6s]`}></span>
            </div>
          </div>
        )}

        {/* Render Landmark Pins */}
        {Object.entries(landmarks).map(([name, config]) => {
          const isHighlighted = highlightedPin && highlightedPin.buildingName === config.buildingName;

          return (
            <button
              key={name}
              id={`landmark-pin-${name.replace(/\s+/g, '-').toLowerCase()}`}
              className="absolute group transition-all duration-300 focus:outline-none"
              style={{ left: `${config.x}%`, top: `${config.y}%` }}
              onClick={() => onSelectLandmark(name)}
            >
              {/* Pin representation */}
              <div className="relative -ml-3.5 -mt-7 flex flex-col items-center">
                <div className={`p-1.5 rounded-full shadow-md border transition-all duration-300 ${
                  isHighlighted 
                    ? `${primaryBg} text-white scale-125 border-slate-100 rotate-12 ring-4 ${ringColor}` 
                    : `bg-white text-slate-700 border-slate-200 group-hover:${primaryBg} group-hover:text-white group-hover:scale-110 group-hover:border-transparent`
                }`}>
                  <MapPin className="w-4 h-4" />
                </div>
                
                {/* Visual anchor triangle */}
                <div className={`w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] -mt-[1px] ${
                  isHighlighted 
                    ? (isSvyasa ? 'border-t-orange-600' : 'border-t-blue-600') 
                    : `border-t-white group-hover:${isSvyasa ? 'border-t-orange-600' : 'border-t-blue-600'}`
                }`} />

                {/* Minimal label (fades in on hover, or always visible if highlighted) */}
                <div className={`absolute top-8 whitespace-nowrap bg-white border font-semibold font-mono text-[9px] py-0.5 px-2 rounded-lg tracking-wide shadow-sm pointer-events-none transition-all duration-200 ${
                  isHighlighted 
                    ? `opacity-100 translate-y-0 ${primaryText} ${lightBorder}` 
                    : 'opacity-0 group-hover:opacity-100 translate-y-1 text-slate-600 border-slate-200'
                }`}>
                  {name}
                </div>
              </div>
            </button>
          );
        })}

        {/* Decorative Compass Rose and Scale */}
        <div className="absolute right-4 bottom-4 flex flex-col items-end pointer-events-none">
          <div className="flex items-center gap-1.5 mb-1">
            <Navigation2 className="w-3.5 h-3.5 text-slate-500 rotate-45" />
            <span className="text-[9px] text-slate-500 font-mono font-medium">TRUE EAST-DIRECTION</span>
          </div>
          <div className="w-16 h-1 bg-slate-200 rounded relative">
            <div className={`absolute top-0 left-0 w-1/2 h-full ${primaryBg} rounded-l`}></div>
            <div className="absolute top-1.5 right-0 text-[8px] text-slate-400 font-mono font-medium">100m SCALE</div>
          </div>
        </div>

        {/* Bottom instructions bar */}
        <div className="absolute bottom-4 left-4 p-2.5 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl max-w-[200px] pointer-events-none shadow-sm">
          <p className="text-[10px] text-slate-500 leading-tight">
            💡 <strong className="text-slate-800">Campus Guide</strong>: Click any landmark to pinpoint coordinates & ask {askBotName} about it!
          </p>
        </div>
      </div>

      {/* Selected/Highlighted Building Info Card */}
      {highlightedPin ? (
        <div className={`${lightBg}/50 backdrop-blur-sm border-t border-slate-200 p-4 transition-all duration-300`}>
          <div className="flex items-start gap-2.5">
            <div className={`p-1.5 rounded-lg ${lightBg} border ${lightBorder} ${primaryText} mt-0.5`}>
              <Info className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className={`text-[9px] ${primaryText} font-mono uppercase tracking-wider block font-bold`}>Landmark Identified</span>
              <h4 className="text-sm font-semibold text-slate-800 font-sans">
                {highlightedPin.buildingName}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                {highlightedPin.description}
              </p>
              <button 
                id="btn-ask-directions"
                onClick={() => onSelectLandmark(highlightedPin.buildingName.split(' ')[0])}
                className={`mt-2 text-[10px] font-mono ${primaryText} hover:underline flex items-center gap-1 font-bold cursor-pointer`}
              >
                Ask {askBotName} for syllabus and timings &rarr;
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 p-4 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-500">
            No active search tracking. Ask {askBotName} <span className="text-slate-650 italic">"Where is the {isSvyasa ? "Arogyadhama" : "Innovation Lab"}"</span> or select a pin above.
          </p>
        </div>
      )}
    </div>
  );
}
