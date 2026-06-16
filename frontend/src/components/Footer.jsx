import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 mt-auto py-4 text-center text-[10px] font-mono text-slate-500">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div>
          COURSEWORK PROJECT SUBMISSION: <span className="text-slate-400">Information Organization & System Security</span>
        </div>
        <div className="text-slate-600">
          Secure Multi-Key Spatial Vector Encryption Engine Framework • v1.0.0
        </div>
      </div>
    </footer>
  );
}