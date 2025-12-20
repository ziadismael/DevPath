import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="relative">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Ambient Background Effects */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Value Prop */}
                        <div className="space-y-8">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-mono font-bold leading-tight">
                                <span className="gradient-text">Empower</span>
                                <br />
                                <span className="text-white">Your Developer</span>
                                <br />
                                <span className="text-slate-300">Journey</span>
                            </h1>

                            <p className="text-xl text-slate-400 max-w-xl">
                                Master technical interviews with AI coaching, discover your next internship,
                                and showcase your projects to the world.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/signup" className="px-8 py-4 bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 rounded-lg font-mono font-semibold text-white shadow-glow-md hover:shadow-glow-lg transition-all duration-300 text-lg text-center">
                                    Start Your Journey →
                                </Link>
                                <button className="px-8 py-4 glass glass-hover rounded-lg font-mono font-semibold text-white transition-all duration-300 text-lg">
                                    Watch Demo
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-8 pt-8">
                                <div>
                                    <div className="text-3xl font-mono font-bold gradient-text">10K+</div>
                                    <div className="text-sm text-slate-500">Developers</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-mono font-bold gradient-text">500+</div>
                                    <div className="text-sm text-slate-500">Companies</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-mono font-bold gradient-text">95%</div>
                                    <div className="text-sm text-slate-500">Success Rate</div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Terminal Visual */}
                        <div className="relative">
                            <div className="terminal shadow-glow-cyber-md">
                                {/* Terminal Header */}
                                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <span className="text-slate-500 text-xs">~/devpath</span>
                                </div>

                                {/* Terminal Content */}
                                <div className="space-y-2">
                                    <div className="flex">
                                        <span className="text-syntax-green">$</span>
                                        <span className="ml-2 text-slate-300">npm install @devpath/success</span>
                                    </div>
                                    <div className="text-slate-500 ml-4">
                                        ✓ Installing AI Interview Coach...
                                    </div>
                                    <div className="text-slate-500 ml-4">
                                        ✓ Installing Internship Finder...
                                    </div>
                                    <div className="text-slate-500 ml-4">
                                        ✓ Installing Project Showcase...
                                    </div>
                                    <div className="flex mt-4">
                                        <span className="text-syntax-green">$</span>
                                        <span className="ml-2 text-slate-300">devpath start</span>
                                    </div>
                                    <div className="text-syntax-blue ml-4">
                                        → Server running on{' '}
                                        <span className="text-syntax-pink">https://your-career.dev</span>
                                    </div>
                                    <div className="flex items-center mt-4">
                                        <span className="text-syntax-green">$</span>
                                        <span className="ml-2 text-slate-300 animate-pulse">_</span>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Code Snippets */}
                            <div className="absolute -top-4 -right-4 glass px-3 py-2 rounded text-xs font-mono text-syntax-purple animate-pulse">
                                const success = true;
                            </div>
                            <div className="absolute -bottom-4 -left-4 glass px-3 py-2 rounded text-xs font-mono text-syntax-blue animate-pulse" style={{ animationDelay: '0.5s' }}>
                                {'{ hired: "✓" }'}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-mono font-bold mb-4">
                            <span className="gradient-text">Your Complete</span>
                            <span className="text-white"> Career Toolkit</span>
                        </h2>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            Everything you need to land your dream role, all in one platform.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1: AI Interview Coach */}
                        <Link to="/interview" className="group glass glass-hover rounded-xl p-8 glow-electric cursor-pointer block">
                            <div className="mb-6">
                                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-electric-600 to-electric-700 flex items-center justify-center shadow-glow-sm">
                                    <span className="text-2xl">🤖</span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-mono font-bold text-white mb-4">
                                AI Interview Coach
                            </h3>
                            <p className="text-slate-400 mb-6">
                                Practice with our AI-powered mock interviews. Get real-time feedback,
                                personalized tips, and master behavioral & technical questions.
                            </p>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li className="flex items-center gap-2">
                                    <span className="text-syntax-green">✓</span>
                                    Real-time code evaluation
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-syntax-green">✓</span>
                                    Behavioral question prep
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-syntax-green">✓</span>
                                    Performance analytics
                                </li>
                            </ul>
                            <div className="mt-6 font-mono text-electric-500 group-hover:text-electric-400 transition-colors">
                                Start Practicing →
                            </div>
                        </Link>

                        {/* Feature 2: Internship Finder */}
                        <Link to="/internships" className="group glass glass-hover rounded-xl p-8 glow-cyber cursor-pointer block">
                            <div className="mb-6">
                                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-cyber-500 to-cyber-600 flex items-center justify-center shadow-glow-cyber-sm">
                                    <span className="text-2xl">🎯</span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-mono font-bold text-white mb-4">
                                Internship Finder
                            </h3>
                            <p className="text-slate-400 mb-6">
                                Discover curated internship opportunities from top companies.
                                Filter by tech stack, location, and your skill level.
                            </p>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li className="flex items-center gap-2">
                                    <span className="text-syntax-blue">✓</span>
                                    Curated opportunities
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-syntax-blue">✓</span>
                                    Smart matching algorithm
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-syntax-blue">✓</span>
                                    Application tracking
                                </li>
                            </ul>
                            <div className="mt-6 font-mono text-cyber-400 group-hover:text-cyber-300 transition-colors">
                                Browse Internships →
                            </div>
                        </Link>

                        {/* Feature 3: Peer Review */}
                        <Link to="/projects" className="group glass glass-hover rounded-xl p-8 glow-electric cursor-pointer block">
                            <div className="mb-6">
                                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-syntax-pink to-syntax-purple flex items-center justify-center shadow-glow-sm">
                                    <span className="text-2xl">🚀</span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-mono font-bold text-white mb-4">
                                Project Showcase
                            </h3>
                            <p className="text-slate-400 mb-6">
                                Share your projects, get constructive feedback from peers,
                                and build a portfolio that stands out to recruiters.
                            </p>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li className="flex items-center gap-2">
                                    <span className="text-syntax-pink">✓</span>
                                    Peer code reviews
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-syntax-pink">✓</span>
                                    Portfolio builder
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-syntax-pink">✓</span>
                                    Community feedback
                                </li>
                            </ul>
                            <div className="mt-6 font-mono text-syntax-pink group-hover:text-syntax-purple transition-colors">
                                Showcase Projects →
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="glass rounded-2xl p-12 shadow-glow-lg">
                        <h2 className="text-4xl md:text-5xl font-mono font-bold mb-6">
                            <span className="gradient-text">Ready to Level Up?</span>
                        </h2>
                        <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                            Join thousands of developers who are accelerating their careers with DevPath.
                        </p>
                        <Link to="/signup" className="inline-block px-10 py-5 bg-gradient-to-r from-electric-600 to-cyber-500 hover:from-electric-500 hover:to-cyber-400 rounded-lg font-mono font-bold text-white shadow-glow-lg hover:shadow-glow-cyber-lg transition-all duration-300 text-lg">
                            Get Started for Free →
                        </Link>
                        <p className="mt-4 text-sm text-slate-500 font-mono">
                            No credit card required • Free forever plan available
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
