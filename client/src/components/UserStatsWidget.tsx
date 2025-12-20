import React, { useState, useEffect } from 'react';
import { usersAPI } from '../api/users';
import { useAuth } from '../context/AuthContext';

interface UserStatsWidgetProps {
    className?: string;
}

const UserStatsWidget: React.FC<UserStatsWidgetProps> = ({ className = '' }) => {
    const { user, isAuthenticated } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [stats, setStats] = useState({
        followers: 0,
        following: 0,
    });

    useEffect(() => {
        if (isAuthenticated) {
            fetchStats();
        }
    }, [isAuthenticated]);

    const fetchStats = async () => {
        try {
            const profile = await usersAPI.getProfile();
            // Assuming the profile includes followers/following counts
            setStats({
                followers: profile.followers?.length || 0,
                following: profile.following?.length || 0,
            });
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const handleSearch = async (query: string) => {
        setSearchQuery(query);

        if (query.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            // Note: This assumes there's a search endpoint or we filter from all users
            // For now, we'll use a simple approach
            const response = await fetch(`/api/users?search=${encodeURIComponent(query)}`);
            const data = await response.json();
            setSearchResults(data.users || []);
        } catch (err) {
            console.error('Error searching users:', err);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleFollow = async (username: string) => {
        try {
            await usersAPI.followUser(username);
            // Refresh stats and remove from search results
            fetchStats();
            setSearchResults(prev => prev.filter(u => u.username !== username));
        } catch (err) {
            console.error('Error following user:', err);
        }
    };

    const handleUnfollow = async (username: string) => {
        try {
            await usersAPI.unfollowUser(username);
            fetchStats();
        } catch (err) {
            console.error('Error unfollowing user:', err);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className={`glass rounded-xl p-6 ${className}`}>
            {/* Stats */}
            <div className="mb-6">
                <h3 className="text-lg font-mono font-bold text-white mb-4">Your Network</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 glass rounded-lg">
                        <div className="text-2xl font-mono font-bold gradient-text mb-1">
                            {stats.followers}
                        </div>
                        <div className="text-xs text-slate-500">Followers</div>
                    </div>
                    <div className="text-center p-3 glass rounded-lg">
                        <div className="text-2xl font-mono font-bold gradient-text mb-1">
                            {stats.following}
                        </div>
                        <div className="text-xs text-slate-500">Following</div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div>
                <h3 className="text-sm font-mono font-semibold text-slate-400 mb-3">Find Users</h3>
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search by username..."
                        className="w-full px-4 py-2 pl-10 bg-void-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-electric-500 transition-colors text-sm"
                    />
                    <svg
                        className="w-5 h-5 absolute left-3 top-2.5 text-slate-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Search Results */}
                {searchQuery.length >= 2 && (
                    <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                        {isSearching ? (
                            <div className="text-center py-4">
                                <div className="w-6 h-6 border-2 border-electric-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            </div>
                        ) : searchResults.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-4">No users found</p>
                        ) : (
                            searchResults.map((searchUser) => (
                                <div
                                    key={searchUser.username}
                                    className="flex items-center justify-between p-3 glass rounded-lg hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric-600 to-electric-700 flex items-center justify-center text-xs font-bold text-white">
                                            {searchUser.username?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-mono font-semibold text-white">
                                                @{searchUser.username}
                                            </p>
                                            {searchUser.firstName && searchUser.lastName && (
                                                <p className="text-xs text-slate-500">
                                                    {searchUser.firstName} {searchUser.lastName}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {searchUser.username !== user?.username && (
                                        <button
                                            onClick={() => handleFollow(searchUser.username)}
                                            className="px-3 py-1 bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 rounded-lg text-xs font-mono font-semibold text-white transition-all duration-300"
                                        >
                                            Follow
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserStatsWidget;
