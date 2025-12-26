import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Editor from '@monaco-editor/react';

const LANGUAGES = [
    { id: 'javascript', name: 'JavaScript', defaultCode: '// Start coding here...\n\nfunction solution() {\n  console.log("Hello World!");\n}' },
    { id: 'python', name: 'Python', defaultCode: '# Start coding here...\n\ndef solution():\n    print("Hello World!")' },
    { id: 'java', name: 'Java', defaultCode: '// Start coding here...\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}' },
    { id: 'cpp', name: 'C++', defaultCode: '// Start coding here...\n#include <iostream>\n\nint main() {\n    std::cout << "Hello World!";\n    return 0;\n}' },
    { id: 'typescript', name: 'TypeScript', defaultCode: '// Start coding here...\n\nfunction solution(): void {\n  console.log("Hello World!");\n}' },
];

// Video Player Component
const VideoPlayer = React.memo(({
    isCameraOn,
    isMicOn,
    toggleCamera,
    toggleMic,
    handleLeave,
    error,
    videoRef,
    className,
    showControls = true
}: {
    isCameraOn: boolean;
    isMicOn: boolean;
    toggleCamera: () => void;
    toggleMic: () => void;
    handleLeave: () => void;
    error: string;
    videoRef: React.RefObject<HTMLVideoElement>;
    className?: string;
    showControls?: boolean;
}) => {
    return (
        <div className={`relative bg-black overflow-hidden shadow-2xl border border-white/10 group ${className}`}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-300 ${isCameraOn ? 'opacity-100' : 'opacity-0'}`}
            />

            {!isCameraOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-void-900">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-2xl">
                        📷
                    </div>
                </div>
            )}

            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50 p-4 text-center">
                    <div>
                        <div className="text-red-500 text-3xl mb-2">⚠️</div>
                        <p className="text-slate-300 text-xs">{error}</p>
                    </div>
                </div>
            )}

            {/* Controls Overlay */}
            {showControls && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent flex justify-center items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={toggleMic}
                        className={`p-3 rounded-full transition-all duration-300 ${isMicOn ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                        title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
                    >
                        {isMicOn ? '🎤' : '🔇'}
                    </button>
                    <button
                        onClick={toggleCamera}
                        className={`p-3 rounded-full transition-all duration-300 ${isCameraOn ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                        title={isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
                    >
                        {isCameraOn ? '📹' : '🚫'}
                    </button>
                    <button
                        onClick={handleLeave}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-sm"
                    >
                        End
                    </button>
                </div>
            )}
        </div>
    );
});


const VideoRoom: React.FC = () => {
    const { type } = useParams<{ type: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string>('');
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);

    // Editor code state
    const [language, setLanguage] = useState(LANGUAGES[0].id);
    const [code, setCode] = useState<string>(LANGUAGES[0].defaultCode);

    const isTechnical = type?.toLowerCase() === 'technical';

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        let isMounted = true;

        const initVideo = async () => {
            try {
                // Ensure we release any previous stream
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => {
                        track.stop();
                        track.enabled = false;
                    });
                    streamRef.current = null;
                }

                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                // If component unmounted while waiting for permissions/stream
                if (!isMounted) {
                    mediaStream.getTracks().forEach(track => {
                        track.stop();
                        track.enabled = false;
                    });
                    return;
                }

                // Normal success flows
                setStream(mediaStream);
                streamRef.current = mediaStream;
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }

            } catch (err) {
                if (isMounted) {
                    console.error("Error accessing media devices:", err);
                    setError("Could not access camera or microphone. Please allow permissions.");
                }
            }
        };

        initVideo();

        // Cleanup function
        return () => {
            isMounted = false;
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => {
                    track.stop();
                    track.enabled = false;
                });
                streamRef.current = null;
                setStream(null);
            }
        };
    }, [isAuthenticated, navigate]);

    // Handle stream attachment updates safely
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    const toggleCamera = () => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsCameraOn(videoTrack.enabled);
            }
        }
    };

    const toggleMic = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMicOn(audioTrack.enabled);
            }
        }
    };

    const handleLeave = () => {
        // Trigger manual cleanup before navigating
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                track.stop();
                track.enabled = false;
            });
            streamRef.current = null;
            setStream(null);
        }
        navigate('/interview');
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const langId = e.target.value;
        const lang = LANGUAGES.find(l => l.id === langId);
        if (lang) {
            setLanguage(langId);
            setCode(lang.defaultCode);
        }
    };

    return (
        <div className="min-h-screen bg-void-950 flex flex-col pt-16">
            {/* Navbar spacing handled by pt-16 (adjust if needed based on Navbar height) */}

            {/* Header / Top Bar */}
            <div className="h-14 px-6 border-b border-white/10 flex items-center justify-between bg-void-900">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-mono font-bold text-white capitalize">
                        {type} Interview
                    </h1>
                    <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-xs font-mono border border-red-500/20 animate-pulse flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        REC
                    </span>
                </div>
                <div className="font-mono text-electric-400 text-sm">
                    00:00:00
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative overflow-hidden">

                {isTechnical ? (
                    // === Technical Interview Layout ===
                    <div className="w-full h-[calc(100vh-7rem)] flex flex-col">

                        {/* Editor Toolbar */}
                        <div className="h-12 bg-void-900 border-b border-white/10 flex items-center justify-between px-4">
                            <div className="flex items-center gap-2">
                                <span className="text-slate-400 text-sm font-mono">Language:</span>
                                <select
                                    value={language}
                                    onChange={handleLanguageChange}
                                    className="bg-slate-800 text-white border border-slate-700 rounded px-3 py-1 text-sm font-mono focus:outline-none focus:border-electric-500 transition-colors"
                                >
                                    {LANGUAGES.map(lang => (
                                        <option key={lang.id} value={lang.id}>
                                            {lang.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="text-xs text-slate-500 font-mono">
                                Auto-saved
                            </div>
                        </div>

                        {/* Editor Area */}
                        <div className="flex-1 relative">
                            {/* Wrapper for Editor to ensuring it takes full space */}
                            <div className="absolute inset-0">
                                <Editor
                                    height="100%"
                                    language={language}
                                    theme="vs-dark"
                                    value={code}
                                    onChange={(value) => setCode(value || '')}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                        padding: { top: 20, bottom: 20 },
                                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
                                    }}
                                />
                            </div>

                            {/* Floating Video (PIP style) */}
                            <div className="fixed bottom-24 right-6 z-20 w-80 aspect-video shadow-2xl rounded-xl overflow-hidden border-2 border-electric-500/50 bg-black">
                                <VideoPlayer
                                    className="w-full h-full rounded-none border-0"
                                    isCameraOn={isCameraOn}
                                    isMicOn={isMicOn}
                                    toggleCamera={toggleCamera}
                                    toggleMic={toggleMic}
                                    handleLeave={handleLeave}
                                    error={error}
                                    videoRef={videoRef}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    // === HR / Behavioral Interview Layout ===
                    <div className="w-full h-full flex flex-col items-center justify-center p-6">
                        {/* Large Video Container */}
                        <div className="w-full max-w-6xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative">
                            <VideoPlayer
                                className="w-full h-full rounded-2xl border-0"
                                isCameraOn={isCameraOn}
                                isMicOn={isMicOn}
                                toggleCamera={toggleCamera}
                                toggleMic={toggleMic}
                                handleLeave={handleLeave}
                                error={error}
                                videoRef={videoRef}
                            />
                        </div>

                        <div className="mt-8 text-center max-w-2xl">
                            <h3 className="text-xl font-mono text-white mb-2">Behavioral Analysis Active</h3>
                            <p className="text-slate-400 text-sm">
                                The AI is analyzing your tone, pace, and facial expressions to provide feedback on your communication style.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoRoom;
