import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI } from '../api/users';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import FollowersModal from './FollowersModal';
import { User } from '../types';

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
    const [followingUsernames, setFollowingUsernames] = useState<Set<string>>(new Set());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'followers' | 'following'>('followers');
    const [modalUsers, setModalUsers] = useState<User[]>([]);

    useEffect(() => {
        if (!isAuthenticated) return;

        // Initial fetch
        fetchStats();

        // Poll every 30 seconds for updates
        const interval = setInterval(() => {
            fetchStats();
        }, 30000);

        // Refresh when tab becomes visible again
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                fetchStats();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup
        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isAuthenticated]);

    const fetchStats = async () => {
        try {
            const profile = await usersAPI.getProfile();
            setStats({
                followers: profile.followers?.length || 0,
                following: profile.following?.length || 0,
            });
            // Track which users we're following
            const followingSet = new Set(profile.following?.map(u => u.username) || []);
            setFollowingUsernames(followingSet);
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
            const response = await apiClient.get(`/users?search=${encodeURIComponent(query)}`);
            setSearchResults(Array.isArray(response.data) ? response.data : []);
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
            // Update following set
            setFollowingUsernames(prev => new Set(prev).add(username));
            // Refresh stats
            fetchStats();
            // Remove from search results
            setSearchResults(prev => prev.filter(u => u.username !== username));
        } catch (err) {
            console.error('Error following user:', err);
        }
    };

    const handleUnfollow = async (username: string) => {
        try {
            await usersAPI.unfollowUser(username);
            // Update following set
            setFollowingUsernames(prev => {
                const newSet = new Set(prev);
                newSet.delete(username);
                return newSet;
            });
            // Refresh stats
            fetchStats();
        } catch (err) {
            console.error('Error unfollowing user:', err);
        }
    };

    const openFollowersModal = async () => {
        try {
            const followers = await usersAPI.getFollowers();
            setModalUsers(followers);
            setModalMode('followers');
            setIsModalOpen(true);
        } catch (err) {
            console.error('Error fetching followers:', err);
        }
    };

    const openFollowingModal = async () => {
        try {
            const following = await usersAPI.getFollowing();
            setModalUsers(following);
            setModalMode('following');
            setIsModalOpen(true);
        } catch (err) {
            console.error('Error fetching following:', err);
        }
    };

    const handleUserRemoved = (username: string) => {
        // Remove user from modal list in real-time
        setModalUsers(prev => prev.filter(u => u.username !== username));
    };

    if (!isAuthenticated) return null;

    return (
        <>
            <div className={`glass rounded-xl p-6 ${className}`}>
                {/* Stats */}
                <div className="mb-6">
                    <h3 className="text-lg font-mono font-bold text-white mb-4">Your Network</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={openFollowersModal}
                            className="text-center p-3 glass rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                        >
                            <div className="text-2xl font-mono font-bold gradient-text mb-1">
                                {stats.followers}
                            </div>
                            <div className="text-xs text-slate-500">Followers</div>
                        </button>
                        <button
                            onClick={openFollowingModal}
                            className="text-center p-3 glass rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                        >
                            <div className="text-2xl font-mono font-bold gradient-text mb-1">
                                {stats.following}
                            </div>
                            <div className="text-xs text-slate-500">Following</div>
                        </button>
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
                                            <Link
                                                to={`/user/${searchUser.username}`}
                                                className="w-8 h-8 rounded-full bg-gradient-to-br from-electric-600 to-electric-700 flex items-center justify-center text-xs font-bold text-white hover:scale-110 transition-transform"
                                            >
                                                {searchUser.username?.[0]?.toUpperCase() || 'U'}
                                            </Link>
                                            <div>
                                                <Link
                                                    to={`/user/${searchUser.username}`}
                                                    className="text-sm font-mono font-semibold text-white hover:text-electric-400 transition-colors"
                                                >
                                                    @{searchUser.username}
                                                </Link>
                                                {searchUser.firstName && searchUser.lastName && (
                                                    <p className="text-xs text-slate-500">
                                                        {searchUser.firstName} {searchUser.lastName}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {searchUser.username !== user?.username && (
                                            <button
                                                onClick={() => followingUsernames.has(searchUser.username) ? handleUnfollow(searchUser.username) : handleFollow(searchUser.username)}
                                                className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all duration-300 ${followingUsernames.has(searchUser.username)
                                                    ? 'bg-slate-700 hover:bg-slate-600 text-white'
                                                    : 'bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 text-white'
                                                    }`}
                                            >
                                                {followingUsernames.has(searchUser.username) ? 'Following' : 'Follow'}
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Followers/Following Modal */}
            <FollowersModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mode={modalMode}
                users={modalUsers}
                currentUsername={user?.username}
                onFollowChange={fetchStats}
                onUserRemoved={handleUserRemoved}
                initialFollowingUsernames={followingUsernames}
            />
        </>
    );
};

export default UserStatsWidget;
