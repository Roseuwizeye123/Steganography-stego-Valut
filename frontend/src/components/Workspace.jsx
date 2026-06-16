import React from 'react';
import ComparisonView from './ComparisonView';

export default function Workspace({
    mode,
    activeKey,
    secretMessage,
    setSecretMessage,
    password,
    setPassword,
    selectedFile,
    setSelectedFile,
    previewUrl,
    setPreviewUrl,
    outputImageUrl,
    extractedMessage,
    onExecute,
    loading
}) {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <div className="flex-1 flex flex-col gap-5 p-6 overflow-y-auto max-w-[1100px] mx-auto w-full">
            <div>
                <h2 className="text-2xl font-bold text-[#E2E8F0]">
                    {mode === 'encode' ? 'Encode Secret Message' : 'Decode Hidden Message'}
                </h2>
                <p className="text-sm text-[#64748B] mt-1">
                    {mode === 'encode' 
                        ? 'Hide your message inside a cover image cleanly using pixel transformation.' 
                        : 'Extract the verification payload matrix using target profiles.'}
                </p>
            </div>

            
            <div className="grid grid-cols-2 gap-5">
                
                <div className="border-2 border-dashed border-[#2A364F] rounded-lg p-10 text-center relative bg-[#121824] flex flex-col justify-center items-center min-h-[260px]">
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    {!previewUrl ? (
                        <div>
                            <p className="text-[#E2E8F0] font-medium">
                                {mode === 'encode' ? 'Upload cover image' : 'Upload stego image to decode'}
                            </p>
                            <p className="text-xs text-[#64748B] mt-1">
                                PNG, JPG, BMP - click or drag anywhere here
                            </p>
                        </div>
                    ) : (
                        <div className="w-full flex flex-col items-center">
                            <img src={previewUrl} alt="Source upload" className="max-h-[180px] object-contain rounded border border-[#2A364F]" />
                            <p className="text-[11px] text-[#00BFA5] mt-2 font-mono">{selectedFile?.name}</p>
                        </div>
                    )}
                </div>

                
                <div className="border border-[#2A364F] rounded-lg p-5 bg-[#121824] flex flex-col justify-center items-center min-h-[260px] text-center">
                    {!outputImageUrl && !extractedMessage ? (
                        <p className="text-[#64748B] text-sm">
                            Encoded image or extracted text results appear here
                        </p>
                    ) : (
                        <div className="w-full h-full flex flex-col justify-center items-center">
                            {mode === 'encode' && outputImageUrl && (
                                <div className="w-full flex flex-col items-center">
                                    <img src={outputImageUrl} alt="Stego Output" className="max-h-[180px] object-contain rounded border border-[#00BFA5]" />
                                </div>
                            )}
                            
                            {mode === 'decode' && extractedMessage && (
                                <div className="w-full text-left flex flex-col h-full justify-between">
                                    <label className="text-xs uppercase text-[#64748B] font-bold tracking-wider mb-2">
                                        Extracted Secret Text String:
                                    </label>
                                    <textarea 
                                        className="w-full flex-1 min-h-[140px] bg-[#1A2333] border border-[#2A364F] rounded p-3 text-sm text-[#E2E8F0] font-mono resize-none focus:outline-none focus:border-[#00BFA5]"
                                        readOnly
                                        value={extractedMessage}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            
            {mode === 'encode' && (
                <div className="flex flex-col">
                    <label className="text-xs uppercase text-[#64748B] font-bold tracking-wider mb-2">
                        Secret Message Text
                    </label>
                    <textarea
                        rows="3"
                        placeholder="Type out the hidden contents you plan to camouflage..."
                        value={secretMessage}
                        onChange={(e) => setSecretMessage(e.target.value)}
                        className="w-full bg-[#1A2333] border border-[#2A364F] rounded p-3 text-sm text-[#E2E8F0] focus:outline-none focus:border-[#00BFA5] resize-none"
                    />
                </div>
            )}

            {activeKey?.needPass && (
                <div className="flex flex-col animate-fadeIn">
                    <label className="text-xs uppercase text-[#64748B] font-bold tracking-wider mb-2">
                        XOR Encryption Password Key
                    </label>
                    <input
                        type="password"
                        placeholder="Enter dynamic cryptographic key passphrase..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#1A2333] border border-[#2A364F] rounded p-3 text-sm text-[#E2E8F0] focus:outline-none focus:border-[#00BFA5]"
                    />
                </div>
            )}

            
            <div className="bg-[#121824] border border-[#2A364F] rounded-lg p-4 flex flex-col gap-3 text-sm font-mono">
                <div className="grid grid-cols-4 gap-4">
                    <div>
                        <div className="text-[10px] text-[#64748B] uppercase font-bold">Active Configuration</div>
                        <div className="text-[#00BFA5] font-bold mt-0.5">{activeKey ? `${activeKey.id} - ${activeKey.name}` : 'K1 - LSB-1 Classic'}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-[#64748B] uppercase font-bold">Security Status</div>
                        <div className="text-[#E2E8F0] mt-0.5">{activeKey?.sec || 'Medium'}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-[#64748B] uppercase font-bold">Density Capacity</div>
                        <div className="text-[#E2E8F0] mt-0.5">{activeKey?.bits || '3 bits/px'}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-[#64748B] uppercase font-bold">Target Channels</div>
                        <div className="text-[#E2E8F0] mt-0.5">{activeKey?.ch || 'R, G, B'}</div>
                    </div>
                </div>
                
                <div className="border-t border-[#2A364F]/50 pt-2 text-xs text-[#899BB4] leading-relaxed">
                    <span className="text-[#00BFA5] font-bold uppercase mr-1.5">[INFO]:</span>
                    {activeKey?.desc || 'Standard Least Significant Bit insertion. Alters the single lowest bit of Red, Green, and Blue channels for basic hiding.'}
                </div>
            </div>

            
            <div>
                <button
                    disabled={loading}
                    onClick={onExecute}
                    className="w-full py-3.5 bg-[#00BFA5] hover:bg-[#00a68f] disabled:opacity-40 font-bold text-[#0B0F17] rounded transition-all tracking-wide text-base shadow-[0_4px_12px_rgba(0,191,165,0.15)]"
                >
                    {loading 
                        ? 'Executing Algorithms...' 
                        : mode === 'encode' ? ' Encode Message into Image' : ' Extract Hidden Message'}
                </button>
            </div>

            
            {mode === 'encode' && outputImageUrl && (
                <div className="w-full bg-[#0E1622] border border-[#1E2E42] rounded-lg p-5 flex flex-col gap-4 text-left animate-fadeIn mt-2">
                    <div className="flex gap-3 items-start">
                        
                        <div className="flex-shrink-0 w-5 h-5 rounded-full border border-[#00BFA5] flex items-center justify-center text-[#00BFA5] font-bold text-xs mt-0.5 bg-[#00BFA5]/10">
                            ✓
                        </div>
                        <div className="flex flex-col gap-1">
                            <h4 className="text-sm font-bold text-[#E2E8F0] tracking-wide">
                                Message successfully hidden!
                            </h4>
                            <p className="text-xs text-[#64748B] leading-relaxed">
                                The output image looks identical to the original but contains your hidden message. Download it as PNG to preserve the data.
                            </p>
                        </div>
                    </div>

                    
                    <a 
                        href={outputImageUrl} 
                        download="stegovault_output.png"
                        className="w-full py-3 bg-transparent border border-[#1E2E42] hover:border-[#00BFA5] hover:bg-[#00BFA5]/5 text-[#00BFA5] font-medium text-sm rounded flex items-center justify-center gap-2 transition-all group"
                    >
                        <span className="text-base group-hover:scale-110 transition-transform"></span> 
                        Download Stego Image (.png)
                    </a>
                </div>
            )}

        
            {mode === 'encode' && outputImageUrl && (
                <ComparisonView 
                    originalUrl={previewUrl}
                    stegoUrl={outputImageUrl}
                    originalFile={selectedFile}
                    activeKeyId={activeKey ? activeKey.id : 'K1'}
                />
            )}
        </div>
    );
}