import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { usersAPI } from '../api/users';

interface FollowersModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'followers' | 'following';
    users: User[];
    currentUsername?: string;
    onFollowChange: () => void;
    onUserRemoved?: (username: string) => void;
    initialFollowingUsernames?: Set<string>;
}

const FollowersModal: React.FC<FollowersModalProps> = ({
    isOpen,
    onClose,
    mode,
    users,
    currentUsername,
    onFollowChange,
    onUserRemoved,
    initialFollowingUsernames = new Set()
}) => {
    const [followingUsernames, setFollowingUsernames] = useState<Set<string>>(initialFollowingUsernames);
    const [processingUsernames, setProcessingUsernames] = useState<Set<string>>(new Set());

    // Update followingUsernames when initialFollowingUsernames changes
    useEffect(() => {
        setFollowingUsernames(new Set(initialFollowingUsernames));
    }, [initialFollowingUsernames]);

    if (!isOpen) return null;

    const handleFollow = async (username: string) => {
        setProcessingUsernames(prev => new Set(prev).add(username));
        try {
            await usersAPI.followUser(username);
            setFollowingUsernames(prev => new Set(prev).add(username));
            onFollowChange();
        } catch (err) {
            console.error('Error following user:', err);
        } finally {
            setProcessingUsernames(prev => {
                const newSet = new Set(prev);
                newSet.delete(username);
                return newSet;
            });
        }
    };

    const handleUnfollow = async (username: string) => {
        setProcessingUsernames(prev => new Set(prev).add(username));
        try {
            await usersAPI.unfollowUser(username);
            setFollowingUsernames(prev => {
                const newSet = new Set(prev);
                newSet.delete(username);
                return newSet;
            });
            onFollowChange();
            // Only remove user from modal list if we're in the "Following" modal
            // In "Followers" modal, they're still our follower even if we unfollow them
            if (mode === 'following' && onUserRemoved) {
                onUserRemoved(username);
            }
        } catch (err) {
            console.error('Error unfollowing user:', err);
        } finally {
            setProcessingUsernames(prev => {
                const newSet = new Set(prev);
                newSet.delete(username);
                return newSet;
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="glass rounded-xl max-w-md w-full max-h-[70vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-mono font-bold text-white">
                            {mode === 'followers' ? 'Followers' : 'Following'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Users List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {users.length === 0 ? (
                        <p className="text-center text-slate-500 py-8">
                            No {mode} yet
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {users.map((user) => (
                                <div
                                    key={user.userID || user.username}
                                    className="flex items-center justify-between p-3 glass rounded-lg hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-600 to-electric-700 flex items-center justify-center text-sm font-bold text-white">
                                            {user.username?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-mono font-semibold text-white">
                                                @{user.username}
                                            </p>
                                            {user.firstName && user.lastName && (
                                                <p className="text-xs text-slate-500">
                                                    {user.firstName} {user.lastName}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {user.username !== currentUsername && (
                                        <button
                                            onClick={() => {
                                                // If in "following" mode, all users are already followed, so show unfollow
                                                // If in "followers" mode, check if we're following them
                                                if (mode === 'following') {
                                                    handleUnfollow(user.username);
                                                } else {
                                                    followingUsernames.has(user.username) ? handleUnfollow(user.username) : handleFollow(user.username);
                                                }
                                            }}
                                            disabled={processingUsernames.has(user.username)}
                                            className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all duration-300 disabled:opacity-50 ${mode === 'following' || followingUsernames.has(user.username)
                                                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                                                : 'bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 text-white'
                                                }`}
                                        >
                                            {mode === 'following' ? 'Unfollow' : (followingUsernames.has(user.username) ? 'Following' : 'Follow')}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowersModal;
