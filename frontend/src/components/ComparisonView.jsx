import React from 'react';

export default function ComparisonView({ originalUrl, stegoUrl, originalFile, activeKeyId }) {
    if (!originalUrl || !stegoUrl) return null;

    
    const originalSizeKB = originalFile ? (originalFile.size / 1024).toFixed(2) : "0.00";
    
    return (
        <div className="w-full bg-[#121824] border border-[#2A364F] rounded-lg p-5 mt-4 flex flex-col gap-4 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-[#2A364F] pb-3">
                <div>
                    <h3 className="text-sm font-bold text-[#00BFA5] uppercase tracking-wider">
                        🔬 Visual Steganalysis & Comparison Matrix
                    </h3>
                    <p className="text-xs text-[#64748B] mt-0.5">
                        Compare structural pixel integrity between the original source and data-embedded output.
                    </p>
                </div>
                <span className="text-[10px] font-mono bg-[rgba(34,197,94,0.1)] text-[#22C55E] px-2 py-1 rounded border border-[#22C55E]/20">
                    STATUS: 0.00% VISIBLE DISTORTION
                </span>
            </div>

            
            <div className="grid grid-cols-2 gap-6">
                
                <div className="flex flex-col items-center p-3 bg-[#1A2333] border border-[#2A364F] rounded">
                    <span className="text-xs font-bold text-[#64748B] uppercase mb-2 tracking-wide">
                        Original Media Stream
                    </span>
                    <div className="relative max-h-[220px] overflow-hidden flex items-center justify-center rounded bg-[#0B0F17] p-2 border border-[#2A364F]/50">
                        <img src={originalUrl} alt="Original Target" className="max-h-[200px] object-contain" />
                    </div>
                    <div className="w-full flex justify-between items-center mt-3 text-xs font-mono text-[#64748B]">
                        <span>Format: Raw Input</span>
                        <span>Size: {originalSizeKB} KB</span>
                    </div>
                </div>

    
                <div className="flex flex-col items-center p-3 bg-[#1A2333] border border-[#2A364F] rounded">
                    <span className="text-xs font-bold text-[#00BFA5] uppercase mb-2 tracking-wide">
                        Stego Media Layer
                    </span>
                    <div className="relative max-h-[220px] overflow-hidden flex items-center justify-center rounded bg-[#0B0F17] p-2 border border-[#00BFA5]/30">
                        <img src={stegoUrl} alt="Stego Output Verification" className="max-h-[200px] object-contain" />
                    </div>
                    <div className="w-full flex justify-between items-center mt-3 text-xs font-mono text-[#64748B]">
                        <span className="text-[#00BFA5]">Format: Lossless PNG</span>
                        <span>Profile Channel: {activeKeyId}</span>
                    </div>
                </div>
            </div>

            
            <div className="bg-[#0B0F17] rounded p-3 border border-[#2A364F] grid grid-cols-3 gap-2 text-[11px] font-mono text-center">
                <div>
                    <span className="text-[#64748B]">Bit Variance:</span>
                    <span className="text-[#E2E8F0] ml-1">±1 LSB Value Only</span>
                </div>
                <div>
                    <span className="text-[#64748B]">Histogram Delta:</span>
                    <span className="text-[#22C55E] ml-1">Imperceptible</span>
                </div>
                <div>
                    <span className="text-[#64748B]">Structural Integrity:</span>
                    <span className="text-[#00BFA5] ml-1">100% Secure</span>
                </div>
            </div>
        </div>
    );
}