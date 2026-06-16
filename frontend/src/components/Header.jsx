import React from 'react';
import { Shield, Lock, Unlock } from 'lucide-react';

export default function Header({ mode, setMode, clearWorkspace }) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-emerald-400 animate-pulse" />
          <span className="font-mono text-lg font-bold tracking-wider uppercase text-slate-200">
            StegoVault <span className="text-emerald-400"><h3 className="text-xs font-bold text-[#64748B] tracking-wider uppercase">
                DIGITAL IMAGE STEGANOGRAPHY SYSTEM
            </h3></span>
          </span>
        </div>
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button 
            onClick={() => { setMode('encode'); clearWorkspace(); }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${mode === 'encode' ? 'bg-emerald-500 text-slate-950 shadow-md font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Lock className="h-4 w-4" /> Encode
          </button>
          <button 
            onClick={() => { setMode('decode'); clearWorkspace(); }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${mode === 'decode' ? 'bg-emerald-500 text-slate-950 shadow-md font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Unlock className="h-4 w-4" /> Decode
          </button>
        </div>
      </div>
    </header>
  );
}