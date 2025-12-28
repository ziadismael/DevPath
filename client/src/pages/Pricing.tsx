import React from 'react';
const Pricing: React.FC = () => {

    return (
        <div className="w-full flex flex-col relative overflow-hidden text-white">

            <div className="flex-1 flex flex-col min-w-0 relative z-10">
                {/* Background Glows */}
                <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-electric-500/10 blur-[150px] rounded-full pointer-events-none" />
                <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-void-500/10 blur-[150px] rounded-full pointer-events-none" />

                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto space-y-12">

                        {/* Title Section */}
                        <div className="text-center space-y-4">
                            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-electric-100 to-electric-300">
                                Upgrade Your Career
                            </h1>
                            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                                Unlock unlimited AI mock interviews and get hired faster.
                            </p>
                        </div>

                        {/* Pricing Cards */}
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                            {/* Free Plan */}
                            <div className="relative p-8 rounded-3xl border border-white/10 bg-void-900/50 backdrop-blur-md flex flex-col gap-6 hover:border-white/20 transition-all group">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-white">Free Launch</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold text-white">$0</span>
                                        <span className="text-slate-500 text-sm">/ forever</span>
                                    </div>
                                    <p className="text-slate-400 text-sm">For curious developers.</p>
                                </div>

                                <div className="border-t border-white/10" />

                                <ul className="space-y-3 text-sm text-slate-300 flex-1">
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-400">✓</span> 1 AI Mock Interview (5 mins)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-400">✓</span> Basic Feedback
                                    </li>
                                    <li className="flex items-center gap-2 opacity-50">
                                        <span className="text-slate-600">✕</span> Detailed Performance Analytics
                                    </li>
                                    {/* <li className="flex items-center gap-2 opacity-50">
                                        <span className="text-slate-600">✕</span> Resume Parsing
                                    </li> */}
                                </ul>

                                <button
                                    className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors cursor-not-allowed opacity-70"
                                    disabled
                                >
                                    Current Plan
                                </button>
                            </div>

                            {/* Pro Plan */}
                            <div className="relative p-8 rounded-3xl border border-electric-500/30 bg-gradient-to-b from-electric-900/20 to-void-900/50 backdrop-blur-md flex flex-col gap-6 shadow-2xl hover:shadow-electric-500/20 transition-all transform hover:-translate-y-1">
                                {/* Badge */}
                                <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 bg-gradient-to-r from-electric-400 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                    RECOMMENDED
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-white">Pro Access</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold text-white">$29</span>
                                        <span className="text-slate-500 text-sm">/ month</span>
                                    </div>
                                    <p className="text-electric-200 text-sm">For serious job seekers.</p>
                                </div>

                                <div className="border-t border-electric-500/20" />

                                <ul className="space-y-3 text-sm text-slate-300 flex-1">
                                    <li className="flex items-center gap-2">
                                        <span className="text-electric-400">✓</span> Unlimited AI Interviews
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-electric-400">✓</span> Unlimited Duration
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-electric-400">✓</span> Detailed Code & Speech Analytics
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-electric-400">✓</span> Priority Access to New Models
                                    </li>
                                </ul>

                                <button
                                    onClick={() => alert("Payment Integration Coming Soon!")}
                                    className="w-full py-3 rounded-xl bg-electric-500 text-white font-bold hover:bg-electric-400 transition-colors shadow-lg shadow-electric-500/20"
                                >
                                    Upgrade Now
                                </button>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Pricing;
