import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = async () => {
        await logout();
        setShowUserMenu(false);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-mono font-bold gradient-text">
                            {'<DevPath>'}
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/opportunities"
                            className="text-slate-300 hover:text-electric-500 transition-colors duration-200 font-medium"
                        >
                            Opportunities
                        </Link>
                        <Link
                            to="/interview"
                            className="text-slate-300 hover:text-electric-500 transition-colors duration-200 font-medium"
                        >
                            AI Interview
                        </Link>
                        <Link
                            to="/projects"
                            className="text-slate-300 hover:text-electric-500 transition-colors duration-200 font-medium"
                        >
                            Projects
                        </Link>
                        <Link
                            to="/community"
                            className="text-slate-300 hover:text-electric-500 transition-colors duration-200 font-medium"
                        >
                            Community
                        </Link>
                    </div>

                    {/* Auth Buttons / User Menu */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 px-4 py-2 glass glass-hover rounded-lg transition-all"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric-600 to-electric-700 flex items-center justify-center text-sm font-bold text-white">
                                        {user?.username?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="hidden sm:block text-slate-300 font-medium">
                                        {user?.username}
                                    </span>
                                </button>

                                {/* Dropdown Menu */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-void-900/95 backdrop-blur-lg rounded-lg shadow-glow-md border border-white/10 py-2">
                                        <div className="px-4 py-2 border-b border-white/10">
                                            <p className="text-sm font-mono text-slate-400">Signed in as</p>
                                            <p className="text-sm font-semibold text-white truncate">{user?.username}</p>
                                        </div>
                                        <Link
                                            to={`/user/${user?.username}`}
                                            className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            Settings
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="hidden sm:block px-4 py-2 text-slate-300 hover:text-white transition-colors duration-200 font-medium"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-6 py-2 bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 rounded-lg font-mono font-semibold text-white shadow-glow-sm hover:shadow-glow-md transition-all duration-300"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
