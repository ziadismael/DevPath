import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';

const Settings: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('account');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Form states
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        username: user?.username || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            setMessage('');

            const updateData: any = {};
            if (formData.firstName !== user?.firstName) updateData.firstName = formData.firstName;
            if (formData.lastName !== user?.lastName) updateData.lastName = formData.lastName;
            if (formData.email !== user?.email) updateData.email = formData.email;

            await apiClient.put(`/users/${user?.username}`, updateData);
            setMessage('Profile updated successfully!');

            // Refresh page after 1 second
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            setIsLoading(true);
            setMessage('');

            await apiClient.put(`/users/${user?.username}`, {
                password: formData.newPassword
            });

            setMessage('Password updated successfully!');
            setFormData({
                ...formData,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Failed to update password');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-mono font-bold gradient-text mb-2">
                        Settings
                    </h1>
                    <p className="text-slate-400">Manage your account preferences</p>
                </div>

                {/* Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-600/20 border border-green-500/30 text-green-400' : 'bg-red-600/20 border border-red-500/30 text-red-400'}`}>
                        {message}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="glass rounded-xl p-4">
                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveTab('account')}
                                    className={`w-full text-left px-4 py-3 rounded-lg font-mono transition-all ${activeTab === 'account'
                                            ? 'bg-electric-600/20 text-electric-400 border border-electric-500/30'
                                            : 'text-slate-400 hover:bg-white/5'
                                        }`}
                                >
                                    Account
                                </button>
                                <button
                                    onClick={() => setActiveTab('security')}
                                    className={`w-full text-left px-4 py-3 rounded-lg font-mono transition-all ${activeTab === 'security'
                                            ? 'bg-electric-600/20 text-electric-400 border border-electric-500/30'
                                            : 'text-slate-400 hover:bg-white/5'
                                        }`}
                                >
                                    Security
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        <div className="glass rounded-xl p-8">
                            {activeTab === 'account' && (
                                <form onSubmit={handleUpdateProfile}>
                                    <h2 className="text-2xl font-mono font-bold text-white mb-6">Account Settings</h2>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-mono text-slate-400 mb-2">First Name</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-electric-500 focus:ring-1 focus:ring-electric-500 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-mono text-slate-400 mb-2">Last Name</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-electric-500 focus:ring-1 focus:ring-electric-500 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-mono text-slate-400 mb-2">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-electric-500 focus:ring-1 focus:ring-electric-500 transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-mono text-slate-400 mb-2">Username (read-only)</label>
                                            <input
                                                type="text"
                                                value={formData.username}
                                                disabled
                                                className="w-full px-4 py-3 bg-void-900/50 border border-white/10 rounded-lg text-slate-500 cursor-not-allowed"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-6 py-3 bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 rounded-lg font-mono font-semibold text-white shadow-glow-md hover:shadow-glow-lg transition-all duration-300 disabled:opacity-50"
                                        >
                                            {isLoading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {activeTab === 'security' && (
                                <form onSubmit={handleChangePassword}>
                                    <h2 className="text-2xl font-mono font-bold text-white mb-6">Security</h2>

                                    <div className="space-y-6">
                                        <h3 className="text-lg font-mono font-semibold text-white mb-4">Change Password</h3>
                                        <div className="space-y-4">
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleInputChange}
                                                placeholder="New password"
                                                className="w-full px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-electric-500 focus:ring-1 focus:ring-electric-500 transition-all"
                                            />
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                placeholder="Confirm new password"
                                                className="w-full px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-electric-500 focus:ring-1 focus:ring-electric-500 transition-all"
                                            />
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="px-6 py-3 bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 rounded-lg font-mono font-semibold text-white shadow-glow-md hover:shadow-glow-lg transition-all duration-300 disabled:opacity-50"
                                            >
                                                {isLoading ? 'Updating...' : 'Update Password'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
