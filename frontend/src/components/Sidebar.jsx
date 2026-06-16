import React from 'react';

const keysData = [
    { id: 'K1', name: 'LSB-1 Classic', bits: '3 bits/px', sec: 'Medium', ch: 'R, G, B', desc: 'Standard Least Significant Bit insertion. Alters the single lowest bit of Red, Green, and Blue channels for basic hiding.' },
    { id: 'K2', name: 'LSB-2 Dual Bit', bits: '6 bits/px', sec: 'Medium', ch: 'R, G, B', desc: 'Modifies the 2 lowest bits per pixel channel. Doubles the data storage capacity while keeping pixel changes visually imperceptible.' },
    { id: 'K3', name: 'LSB-4 Quad Bit', bits: '12 bits/px', sec: 'Low', ch: 'R, G, B', desc: 'Alters the 4 lowest bits per channel. Offers maximum data payload capacity but introduces higher risk of minor visual noise.' },
    { id: 'K4', name: 'Red Channel', bits: '1 bits/px', sec: 'High', ch: 'Red', desc: 'Isolates and modifies bits strictly inside the Red pixel byte matrix. Leaves all Green and Blue channels completely untouched.' },
    { id: 'K5', name: 'Green Channel', bits: '1 bits/px', sec: 'High', ch: 'Green', desc: 'Hides data exclusively within the Green color spectrum. Ideal for images with heavy foliage or green tones where variations blend naturally.' },
    { id: 'K6', name: 'Blue Channel', bits: '1 bits/px', sec: 'High', ch: 'Blue', desc: 'Targets the Blue channel exclusively. Human eyes are less sensitive to blue color shifts, providing high visual stealth.' },
    { id: 'K7', name: 'Alpha Channel', bits: '1 bits/px', sec: 'High', ch: 'Alpha', desc: 'Injects data bits into the transparency (Alpha) parameter channel. Useful for hidden watermarks in transparent graphic assets.' },
    { id: 'K8', name: 'XOR Cipher + LSB', bits: '3 bits/px', sec: 'High', ch: 'R, G, B', needPass: true, desc: 'Dual-layer defense. Encrypts the text payload using a private password key passphrase before applying classic LSB pixel embedding.' }
];

export default function Sidebar({ activeKeyId, onSelectKey }) {
    return (
        <div className="w-[320px] bg-[#121824] border-r border-[#2A364F] p-5 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-[#64748B] tracking-wider uppercase">
                Steganographic Keys
            </h3>
            <div className="flex flex-col gap-3 overflow-y-auto pr-1">
                {keysData.map((keyItem) => {
                    const isActive = keyItem.id === activeKeyId;
                    const isHighSec = keyItem.sec === 'High';
                    const isLowSec = keyItem.sec === 'Low';
                    
                    let badgeClass = "bg-[rgba(234,179,8,0.1)] text-[#EAB308]";
                    if (isHighSec) badgeClass = "bg-[rgba(34,197,94,0.1)] text-[#22C55E]";
                    if (isLowSec) badgeClass = "bg-[rgba(239,68,68,0.1)] text-[#EF4444]";

                    return (
                        <div
                            key={keyItem.id}
                            onClick={() => onSelectKey(keyItem)}
                            className={`p-3 bg-[#1A2333] border rounded-md cursor-pointer flex justify-between items-center transition-all ${
                                isActive 
                                    ? 'border-[#00BFA5] shadow-[0_0_10px_rgba(0,191,165,0.2)]' 
                                    : 'border-[#2A364F] hover:border-[#64748B]'
                            }`}
                        >
                            <div>
                                <div className="text-sm font-bold text-[#E2E8F0]">
                                    {keyItem.id}: {keyItem.name}
                                </div>
                                <div className="text-xs text-[#64748B] mt-1">
                                    {keyItem.bits}
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${badgeClass}`}>
                                {keyItem.sec}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}