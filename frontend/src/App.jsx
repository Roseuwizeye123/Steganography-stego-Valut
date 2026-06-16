import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Workspace from './components/Workspace';
import Footer from './components/Footer';

export default function App() {
    const [mode, setMode] = useState('encode'); 
    const [activeKey, setActiveKey] = useState({ id: 'K1', name: 'LSB-1 Classic', bits: '3 bits/px', sec: 'Medium', ch: 'R, G, B' });
    const [secretMessage, setSecretMessage] = useState('');
    const [password, setPassword] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [outputImageUrl, setOutputImageUrl] = useState('');
    const [extractedMessage, setExtractedMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleExecuteAction = async () => {
        if (!selectedFile) return alert("Please map an image input target file source layout parameter.");
        setLoading(true);
        setOutputImageUrl('');
        setExtractedMessage('');

        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('keyId', activeKey.id);
        formData.append('password', password);

        try {
            if (mode === 'encode') {
                formData.append('message', secretMessage);
                const res = await fetch('http://localhost:5174/api/stego/encode', { method: 'POST', body: formData });
                if (!res.ok) throw new Error("Processing logic runtime execution failure.");
                const blob = await res.blob();
                setOutputImageUrl(URL.createObjectURL(blob));
            } else {
                const res = await fetch('http://localhost:5174/api/stego/decode', { method: 'POST', body: formData });
                const json = await res.json();
                if (json.success) setExtractedMessage(json.message);
                else alert(json.error);
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#0B0F17] text-[#E2E8F0]">
            <Header mode={mode} setMode={(m) => { setMode(m); setOutputImageUrl(''); setExtractedMessage(''); }} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar activeKeyId={activeKey.id} onSelectKey={setActiveKey} />
                <Workspace 
                    mode={mode} activeKey={activeKey}
                    secretMessage={secretMessage} setSecretMessage={setSecretMessage}
                    password={password} setPassword={setPassword}
                    selectedFile={selectedFile} setSelectedFile={setSelectedFile}
                    previewUrl={previewUrl} setPreviewUrl={setPreviewUrl}
                    outputImageUrl={outputImageUrl} extractedMessage={extractedMessage}
                    onExecute={handleExecuteAction} loading={loading}
                />
            </div>
            <Footer />
        </div>
    );
}