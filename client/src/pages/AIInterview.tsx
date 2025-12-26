import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AIInterview: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Set dynamic page title
        if (isAuthenticated) {
            document.title = 'AI Interview | DevPath';
        } else {
            document.title = 'DevPath | Empower Your Developer Journey';
        }
    }, [isAuthenticated]);

    const handleStartInterview = (type: string) => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: '/interview' } } });
        } else {
            navigate(`/interview/room/${type}`);
        }
    };

    return (
        <div className="min-h-screen py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-mono font-bold mb-4">
                        <span className="gradient-text">AI Interview</span>
                        <span className="text-white"> Coach</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Practice with our AI-powered mock interviews and get real-time feedback
                    </p>
                </div>

                {/* Login Prompt for Unauthenticated Users */}
                {!isAuthenticated && (
                    <div className="mb-8 p-6 glass rounded-xl border border-electric-500/30">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-electric-600/20 flex items-center justify-center">
                                <span className="text-2xl">🔒</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-mono font-semibold text-white mb-1">
                                    Preview Mode
                                </h3>
                                <p className="text-sm text-slate-400">
                                    Sign in to start practicing with AI-powered mock interviews
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Interview Types Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Technical Interview */}
                    <div
                        onClick={() => handleStartInterview('technical')}
                        className="glass glass-hover rounded-xl p-8 cursor-pointer glow-electric"
                    >
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-electric-600 to-electric-700 flex items-center justify-center text-3xl mb-6 shadow-glow-md">
                            💻
                        </div>
                        <h3 className="text-2xl font-mono font-bold text-white mb-4">
                            Technical Interview
                        </h3>
                        <p className="text-slate-400 mb-6">
                            Practice coding problems, algorithms, and data structures with real-time code evaluation
                        </p>
                        <ul className="space-y-2 text-sm text-slate-500 mb-6">
                            <li className="flex items-center gap-2">
                                <span className="text-syntax-green">✓</span>
                                Real-time code execution
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-syntax-green">✓</span>
                                Complexity analysis
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-syntax-green">✓</span>
                                Optimization suggestions
                            </li>
                        </ul>
                        <div className="font-mono text-electric-500">
                            {isAuthenticated ? 'Start Practice →' : 'Sign In to Start →'}
                        </div>
                    </div>

                    {/* Behavioral Interview */}
                    <div
                        onClick={() => handleStartInterview('behavioral')}
                        className="glass glass-hover rounded-xl p-8 cursor-pointer glow-cyber"
                    >
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyber-500 to-cyber-600 flex items-center justify-center text-3xl mb-6 shadow-glow-cyber-md">
                            🗣️
                        </div>
                        <h3 className="text-2xl font-mono font-bold text-white mb-4">
                            Behavioral Interview
                        </h3>
                        <p className="text-slate-400 mb-6">
                            Master the STAR method and ace behavioral questions with personalized feedback
                        </p>
                        <ul className="space-y-2 text-sm text-slate-500 mb-6">
                            <li className="flex items-center gap-2">
                                <span className="text-syntax-blue">✓</span>
                                STAR method guidance
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-syntax-blue">✓</span>
                                Speech analysis
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-syntax-blue">✓</span>
                                Confidence scoring
                            </li>
                        </ul>
                        <div className="font-mono text-cyber-400">
                            {isAuthenticated ? 'Start Practice →' : 'Sign In to Start →'}
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="glass rounded-xl p-8 mb-12">
                    <h3 className="text-2xl font-mono font-bold text-white mb-6 text-center">
                        Your Progress
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-4xl font-mono font-bold gradient-text mb-2">
                                {isAuthenticated ? '12' : '--'}
                            </div>
                            <div className="text-sm text-slate-500">Interviews Completed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-mono font-bold gradient-text mb-2">
                                {isAuthenticated ? '85%' : '--'}
                            </div>
                            <div className="text-sm text-slate-500">Average Score</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-mono font-bold gradient-text mb-2">
                                {isAuthenticated ? '24h' : '--'}
                            </div>
                            <div className="text-sm text-slate-500">Practice Time</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-mono font-bold gradient-text mb-2">
                                {isAuthenticated ? '45' : '--'}
                            </div>
                            <div className="text-sm text-slate-500">Problems Solved</div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <button
                        onClick={() => handleStartInterview('technical')}
                        className="px-10 py-5 bg-gradient-to-r from-electric-600 to-cyber-500 hover:from-electric-500 hover:to-cyber-400 rounded-lg font-mono font-bold text-white shadow-glow-lg hover:shadow-glow-cyber-lg transition-all duration-300 text-lg"
                    >
                        {isAuthenticated ? 'Start New Interview' : 'Sign In to Get Started'}
                    </button>
                    <p className="mt-4 text-sm text-slate-500 font-mono">
                        {isAuthenticated ? 'Choose your interview type above' : 'Create a free account to start practicing'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AIInterview;
