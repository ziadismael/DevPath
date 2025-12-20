import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="glass border-t border-white/10 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-2xl font-mono font-bold gradient-text mb-4">
                            {'<DevPath>'}
                        </h3>
                        <p className="text-slate-400 max-w-md">
                            Empowering software engineers through AI-powered interview prep,
                            curated internships, and collaborative project showcases.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-mono font-semibold text-white mb-4">Platform</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="/internships" className="text-slate-400 hover:text-electric-500 transition-colors">
                                    Internships
                                </a>
                            </li>
                            <li>
                                <a href="/interview" className="text-slate-400 hover:text-electric-500 transition-colors">
                                    AI Interview
                                </a>
                            </li>
                            <li>
                                <a href="/projects" className="text-slate-400 hover:text-electric-500 transition-colors">
                                    Projects
                                </a>
                            </li>
                            <li>
                                <a href="/community" className="text-slate-400 hover:text-electric-500 transition-colors">
                                    Community
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-mono font-semibold text-white mb-4">Resources</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-slate-400 hover:text-electric-500 transition-colors">
                                    Documentation
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-slate-400 hover:text-electric-500 transition-colors">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-slate-400 hover:text-electric-500 transition-colors">
                                    Community
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-slate-400 hover:text-electric-500 transition-colors">
                                    Support
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-slate-500 text-sm font-mono">
                        © {currentYear} DevPath. Crafted with{' '}
                        <span className="text-syntax-pink">{'<code/>'}</span> and{' '}
                        <span className="text-syntax-green">passion</span>.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="text-slate-500 hover:text-electric-500 transition-colors">
                            Privacy
                        </a>
                        <a href="#" className="text-slate-500 hover:text-electric-500 transition-colors">
                            Terms
                        </a>
                        <a href="#" className="text-slate-500 hover:text-electric-500 transition-colors">
                            GitHub
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
