import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Editor from '@monaco-editor/react';
import {
    LiveKitRoom,
    RoomAudioRenderer,
    useTracks,
    useLocalParticipant,
    useConnectionState,
    useRemoteParticipants,
} from '@livekit/components-react';
import { Track, ConnectionState } from 'livekit-client';
import '@livekit/components-styles';

const LANGUAGES = [
    { id: 'javascript', name: 'JavaScript', defaultCode: '// Start coding here...\n\nfunction solution() {\n  console.log("Hello World!");\n}' },
    { id: 'python', name: 'Python', defaultCode: '# Start coding here...\n\ndef solution():\n    print("Hello World!")' },
    { id: 'java', name: 'Java', defaultCode: '// Start coding here...\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}' },
    { id: 'cpp', name: 'C++', defaultCode: '// Start coding here...\n#include <iostream>\n\nint main() {\n    std::cout << "Hello World!";\n    return 0;\n}' },
    { id: 'typescript', name: 'TypeScript', defaultCode: '// Start coding here...\n\nfunction solution(): void {\n  console.log("Hello World!");\n}' },
];

const VideoRoom: React.FC = () => {
    const { type } = useParams<{ type: string }>();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    // LiveKit State
    const [token, setToken] = useState("");
    const [serverUrl, setServerUrl] = useState("");
    const [connect, setConnect] = useState(false);

    // Editor code state
    const [language, setLanguage] = useState(LANGUAGES[0].id);
    const [code, setCode] = useState<string>(LANGUAGES[0].defaultCode);

    const isTechnical = type?.toLowerCase() === 'technical';
    const roomName = `interview-${user?.username || 'guest'}-${Date.now()}`;

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
    }, [isAuthenticated, navigate]);

    // Fetch Token
    useEffect(() => {
        if (!user?.username) return;

        const getToken = async () => {
            try {
                const participantName = user.username;
                const response = await fetch(`http://localhost:5001/api/livekit/token?roomName=${roomName}&participantName=${participantName}`);
                const data = await response.json();

                if (data.token) {
                    setToken(data.token);
                    setServerUrl(data.url);
                    setConnect(true);
                } else {
                    console.error("Failed to fetch token:", data);
                }
            } catch (error) {
                console.error("Error fetching token:", error);
            }
        };

        getToken();
    }, [user, roomName]);


    const handleLeave = () => {
        setConnect(false);
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

    if (!token || !serverUrl) {
        return <div className="min-h-screen bg-void-950 flex items-center justify-center text-white">Connecting to Interview Room...</div>;
    }

    return (
        <LiveKitRoom
            video={true}
            audio={true}
            token={token}
            serverUrl={serverUrl}
            connect={connect}
            data-lk-theme="default"
            onDisconnected={handleLeave}
            className="h-screen w-full bg-void-950 flex flex-col overflow-hidden"
        >
            <RoomLogicHandler type={type || 'technical'} code={code} />

            {/* Header / Top Bar */}
            <div className="h-14 px-6 border-b border-white/10 flex items-center justify-between bg-void-900 flex-none z-50 relative">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-mono font-bold text-white capitalize">
                        {type} Interview
                    </h1>
                    <ConnectionStatus />
                </div>
                <div className="font-mono text-electric-400 text-sm">
                    LIVE
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative min-h-0 w-full">
                {isTechnical ? (
                    // === Technical Interview Layout ===
                    <div className="w-full h-full flex flex-col">
                        {/* Editor Toolbar */}
                        <div className="h-12 bg-void-900 border-b border-white/10 flex items-center justify-between px-4 flex-none">
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
                        </div>

                        {/* Editor Area */}
                        <div className="flex-1 relative min-h-0 w-full bg-void-900">
                            <Editor
                                height="100%"
                                width="100%"
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

                            {/* Floating Video (Local + Remote) */}
                            <div className="fixed bottom-24 right-6 z-20 flex gap-4 pointer-events-none">
                                <div className="pointer-events-auto">
                                    <LocalVideoWidget />
                                </div>
                                <div className="pointer-events-auto">
                                    <RemoteVideoWidget />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // === HR / Behavioral Interview Layout (Updated: Side-by-Side) ===
                    <div className="w-full h-full p-8 flex items-center justify-center gap-8">
                        {/* Local Video (Large) */}
                        <div className="flex-1 max-w-2xl aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative bg-black">
                            <LocalVideoWidget className="w-full h-full" showLabel={true} />
                        </div>

                        {/* Remote Video (Large) */}
                        <div className="flex-1 max-w-2xl aspect-video rounded-2xl overflow-hidden border border-electric-500/30 shadow-2xl relative bg-black">
                            <RemoteVideoWidget className="w-full h-full" showLabel={true} />
                        </div>
                    </div>
                )}
            </div>

            <RoomAudioRenderer />
            <ControlsWidget onLeave={handleLeave} />
        </LiveKitRoom>
    );
};

// --- Logic Handler Component (For Data Publishing) ---
function RoomLogicHandler({ type, code }: { type: string; code: string }) {
    const { localParticipant } = useLocalParticipant();
    const connectionState = useConnectionState();
    const remoteParticipants = useRemoteParticipants();
    const [hasSentInit, setHasSentInit] = useState(false);

    // Send INIT Packet when Agent connects
    useEffect(() => {
        if (
            connectionState === ConnectionState.Connected &&
            localParticipant &&
            remoteParticipants.length > 0 && // Wait for Agent
            !hasSentInit
        ) {
            const payload = JSON.stringify({ topic: "INIT", mode: type.toLowerCase() });
            const encoder = new TextEncoder();
            localParticipant.publishData(encoder.encode(payload), { reliable: true });
            console.log("Sent INIT packet to Agent:", payload);
            setHasSentInit(true);
        }
    }, [connectionState, localParticipant, remoteParticipants, type, hasSentInit]);

    // Send CODE_UPDATE Packet (Debounced)
    useEffect(() => {
        if (connectionState !== ConnectionState.Connected || !localParticipant) return;

        const timeoutId = setTimeout(() => {
            const payload = JSON.stringify({ topic: "CODE_UPDATE", code });
            const encoder = new TextEncoder();
            localParticipant.publishData(encoder.encode(payload), { reliable: true });
        }, 2000); // 2 second debounce

        return () => clearTimeout(timeoutId);
    }, [code, connectionState, localParticipant]);

    return null;
}


// --- Sub-Components ---

function ConnectionStatus() {
    const connectionState = useConnectionState();
    return (
        <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-xs font-mono border border-red-500/20 flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${connectionState === ConnectionState.Connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            {connectionState === ConnectionState.Connected ? 'CONNECTED' : connectionState.toUpperCase()}
        </span>
    );
}

function LocalVideoWidget({ className, showLabel = true }: { className?: string, showLabel?: boolean }) {
    const { localParticipant } = useLocalParticipant();
    const tracks = useTracks([Track.Source.Camera]);
    const localTrack = tracks.find(t => t.participant.identity === localParticipant.identity);

    return (
        <div className={`w-64 aspect-video bg-black rounded-lg overflow-hidden border border-white/10 shadow-lg relative ${className}`}>
            {localTrack && localTrack.publication.isMuted ? (
                <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">
                    📷 Off
                </div>
            ) : (
                <video
                    ref={(el) => { if (el && localTrack?.publication.track) localTrack.publication.track.attach(el) }}
                    className="w-full h-full object-cover transform scale-x-[-1]"
                />
            )}
            {showLabel && (
                <div className="absolute bottom-4 left-4 text-sm text-white bg-black/50 px-3 py-1 rounded backdrop-blur-md">
                    You
                </div>
            )}
        </div>
    );
}

function RemoteVideoWidget({ className, showLabel = true }: { className?: string, showLabel?: boolean }) {
    const tracks = useTracks([Track.Source.Camera]).filter(t => !t.participant.isLocal);
    const remoteTrack = tracks[0];

    return (
        <div className={`w-64 aspect-video bg-black rounded-lg overflow-hidden border border-electric-500/30 shadow-lg relative ${className}`}>
            {remoteTrack ? (
                <video
                    ref={(el) => { if (el && remoteTrack.publication.track) remoteTrack.publication.track.attach(el) }}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400">
                    <div className="text-4xl mb-4">🤖</div>
                    <span className="text-sm font-mono">DevPath AI Coach</span>
                </div>
            )}
            {showLabel && remoteTrack && (
                <div className="absolute bottom-4 left-4 text-sm text-electric-400 bg-black/50 px-3 py-1 rounded backdrop-blur-md border border-electric-500/30">
                    DevPath AI
                </div>
            )}
        </div>
    );
}

function ControlsWidget({ onLeave }: { onLeave: () => void }) {
    const { localParticipant } = useLocalParticipant();
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    const toggleMic = async () => {
        if (localParticipant) {
            const newState = !isMuted;
            await localParticipant.setMicrophoneEnabled(!newState);
            setIsMuted(newState);
        }
    };

    const toggleCam = async () => {
        if (localParticipant) {
            const newState = !isVideoOff;
            await localParticipant.setCameraEnabled(!newState);
            setIsVideoOff(newState);
        }
    };

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 flex items-center gap-4 z-50">
            <button
                onClick={toggleMic}
                className={`p-3 rounded-full transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
            >
                {isMuted ? '🔇' : '🎤'}
            </button>
            <button
                onClick={toggleCam}
                className={`p-3 rounded-full transition-all ${isVideoOff ? 'bg-red-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
            >
                {isVideoOff ? '🚫' : '📹'}
            </button>
            <button
                onClick={onLeave}
                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-full font-bold font-mono transition-colors"
            >
                End Interview
            </button>

        </div>
    );
}

export default VideoRoom;
