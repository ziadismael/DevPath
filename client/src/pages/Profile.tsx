import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { usersAPI } from '../api/users';

const Profile: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        university: '',
        country: '',
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchProfile();
    }, [isAuthenticated]);

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            const response = await usersAPI.getProfile();
            setProfileData(response);
            setFormData({
                firstName: response.firstName || '',
                lastName: response.lastName || '',
                email: response.email || '',
                username: response.username || '',
                university: response.university || '',
                country: response.country || '',
            });
        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsSaving(true);

        try {
            await usersAPI.updateProfile(user?.username || '', formData);
            setSuccessMessage('Profile updated successfully!');
            setIsEditing(false);
            await fetchProfile();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setError('');
        setFormData({
            firstName: profileData?.firstName || '',
            lastName: profileData?.lastName || '',
            email: profileData?.email || '',
            username: profileData?.username || '',
            university: profileData?.university || '',
            country: profileData?.country || '',
        });
    };

    if (!isAuthenticated || isLoading) {
        return (
            <div className="min-h-screen py-20 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-electric-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-mono font-bold gradient-text mb-2">
                        Profile
                    </h1>
                    <p className="text-slate-400">Manage your account information</p>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                        {successMessage}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Profile Card */}
                <div className="glass rounded-xl p-8 mb-6">
                    <div className="flex items-center gap-6 mb-8">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-electric-600 to-electric-700 flex items-center justify-center text-3xl font-bold text-white shadow-glow-md">
                            {user?.username?.[0]?.toUpperCase() || 'U'}
                        </div>

                        {/* User Info */}
                        <div>
                            <h2 className="text-2xl font-mono font-bold text-white mb-1">
                                {profileData?.firstName && profileData?.lastName
                                    ? `${profileData.firstName} ${profileData.lastName}`
                                    : profileData?.username || 'User'}
                            </h2>
                            <p className="text-slate-400">@{profileData?.username || 'username'}</p>
                            <p className="text-sm text-slate-500 mt-1">{profileData?.email || 'email@example.com'}</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/10">
                        <div className="text-center p-4 glass rounded-lg">
                            <div className="text-3xl font-mono font-bold gradient-text mb-1">
                                {profileData?.projects?.length || 0}
                            </div>
                            <div className="text-sm text-slate-500">Projects</div>
                        </div>
                        <div className="text-center p-4 glass rounded-lg">
                            <div className="text-3xl font-mono font-bold gradient-text mb-1">
                                {profileData?.posts?.length || 0}
                            </div>
                            <div className="text-sm text-slate-500">Posts</div>
                        </div>
                        <div className="text-center p-4 glass rounded-lg">
                            <div className="text-3xl font-mono font-bold gradient-text mb-1">0</div>
                            <div className="text-sm text-slate-500">Applications</div>
                        </div>
                    </div>
                </div>

                {/* Account Details */}
                <div className="glass rounded-xl p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-mono font-bold text-white">Account Details</h3>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 rounded-lg font-mono font-semibold text-white text-sm shadow-glow-md hover:shadow-glow-lg transition-all duration-300"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-mono text-slate-400 mb-2">First Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-electric-500 transition-colors"
                                />
                            ) : (
                                <div className="px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-white">
                                    {profileData?.firstName || 'N/A'}
                                </div>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-mono text-slate-400 mb-2">Last Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-electric-500 transition-colors"
                                />
                            ) : (
                                <div className="px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-white">
                                    {profileData?.lastName || 'N/A'}
                                </div>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-mono text-slate-400 mb-2">Email</label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-electric-500 transition-colors"
                                />
                            ) : (
                                <div className="px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-white">
                                    {profileData?.email || 'N/A'}
                                </div>
                            )}
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-mono text-slate-400 mb-2">Username</label>
                            <div className="px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-slate-500">
                                {profileData?.username || 'N/A'} (cannot be changed)
                            </div>
                        </div>

                        {/* University */}
                        <div>
                            <label className="block text-sm font-mono text-slate-400 mb-2">University</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="university"
                                    value={formData.university}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-electric-500 transition-colors"
                                    placeholder="Your university"
                                />
                            ) : (
                                <div className="px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-white">
                                    {profileData?.university || 'Not specified'}
                                </div>
                            )}
                        </div>

                        {/* Country */}
                        <div>
                            <label className="block text-sm font-mono text-slate-400 mb-2">Country</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-electric-500 transition-colors"
                                    placeholder="Your country"
                                />
                            ) : (
                                <div className="px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-white">
                                    {profileData?.country || 'Not specified'}
                                </div>
                            )}
                        </div>

                        {/* Account Type */}
                        <div>
                            <label className="block text-sm font-mono text-slate-400 mb-2">Account Type</label>
                            <div className="px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-white">
                                {user?.role || 'User'}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 px-6 py-3 bg-void-900 hover:bg-void-800 border border-white/10 rounded-lg font-mono font-semibold text-white transition-all duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 rounded-lg font-mono font-semibold text-white shadow-glow-md hover:shadow-glow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
