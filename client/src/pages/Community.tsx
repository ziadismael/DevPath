import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { communityAPI } from '../api/community';
import { Post } from '../types';
import CreatePostModal from '../components/CreatePostModal';
import PostDetailModal from '../components/PostDetailModal';
import UserStatsWidget from '../components/UserStatsWidget';
import ImageSlider from '../components/ImageSlider';

const Community: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [isPostDetailOpen, setIsPostDetailOpen] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, [isAuthenticated]);

    useEffect(() => {
        // Set dynamic page title
        if (isAuthenticated) {
            document.title = 'Community | DevPath';
        } else {
            document.title = 'DevPath | Empower Your Developer Journey';
        }
    }, [isAuthenticated]);

    const fetchPosts = async () => {
        try {
            setIsLoading(true);
            setError('');

            // If not authenticated, show mock posts instead of making API call
            if (!isAuthenticated) {
                const mockPosts: Post[] = [
                    {
                        postID: 'mock-1',
                        title: 'Welcome to DevPath Community!',
                        bodyText: 'Join our community to connect with developers, share your projects, and learn together. Sign in to see real posts and start engaging!',
                        User: { username: 'devpath', firstName: 'DevPath', lastName: 'Team' },
                        likes: 42,
                        Comments: [],
                        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                    },
                    {
                        postID: 'mock-2',
                        title: 'Share Your Projects',
                        bodyText: 'Our community loves seeing what you\'re building! Share your latest projects, get feedback, and inspire others.',
                        User: { username: 'community', firstName: 'Community', lastName: 'Manager' },
                        likes: 28,
                        Comments: [],
                        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                    },
                    {
                        postID: 'mock-3',
                        title: 'Learning Resources',
                        bodyText: 'Check out our curated list of learning resources. From beginner tutorials to advanced topics, we\'ve got you covered!',
                        User: { username: 'educator', firstName: 'Learning', lastName: 'Hub' },
                        likes: 35,
                        Comments: [],
                        createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
                    },
                ];
                setPosts(mockPosts);
                setIsLoading(false);
                return;
            }

            // Use getPosts() for global feed (all posts)
            const response = await communityAPI.getPosts();
            const data = Array.isArray(response) ? response : (response.posts || response.data || []);
            console.log('Posts data:', data);
            setPosts(data);
        } catch (err: any) {
            console.error('Error fetching posts:', err);
            // Don't show error for 401 when not authenticated
            if (err.response?.status === 401 && !isAuthenticated) {
                setPosts([]);
            } else {
                setError(err.message || 'Failed to load posts');
                setPosts([]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handlePostClick = (post: Post) => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: '/community' } } });
            return;
        }
        setSelectedPost(post);
        setIsPostDetailOpen(true);
    };

    const handleCreatePost = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: '/community' } } });
        } else {
            setIsModalOpen(true);
        }
    };

    const handlePostCreated = () => {
        setIsModalOpen(false);
        fetchPosts(); // Refresh posts after creating new post
    };

    const handlePostUpdated = async () => {
        // Refetch posts to get updated like counts and comments
        await fetchPosts();
        // Update the selected post with fresh data
        if (selectedPost) {
            const response = await communityAPI.getPosts();
            const data = Array.isArray(response) ? response : (response.posts || response.data || []);
            const updatedPost = data.find((p: Post) =>
                (p.postID || p.id) === (selectedPost.postID || selectedPost.id)
            );
            if (updatedPost) {
                setSelectedPost(updatedPost);
            }
        }
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header with Stats Widget */}
                <div className="flex flex-col lg:flex-row gap-8 mb-8">
                    {/* Left: Title and Create Button */}
                    <div className="flex-1">
                        <h1 className="text-5xl font-mono font-bold mb-4">
                            <span className="gradient-text">Community</span>
                            <span className="text-white"> Hub</span>
                        </h1>
                        <p className="text-xl text-slate-400 mb-6">
                            Connect, share, and learn from fellow developers worldwide
                        </p>
                        <button
                            onClick={handleCreatePost}
                            className="px-6 py-3 bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 rounded-lg font-mono font-semibold text-white shadow-glow-md hover:shadow-glow-lg transition-all duration-300"
                        >
                            Create Post
                        </button>
                    </div>

                    {/* Right: User Stats Widget */}
                    {isAuthenticated && (
                        <div className="lg:w-80">
                            <UserStatsWidget />
                        </div>
                    )}
                </div>

                {/* Preview Mode Banner for Unauthenticated Users */}
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
                                    Sign in to create posts, like, comment, and interact with the community
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Posts Feed */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-16 h-16 border-4 border-electric-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-400 mb-4">{error}</p>
                        <button
                            onClick={fetchPosts}
                            className="px-6 py-3 bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 rounded-lg font-mono font-semibold text-white shadow-glow-md hover:shadow-glow-lg transition-all duration-300"
                        >
                            Try Again
                        </button>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="mb-6">
                            <svg className="w-24 h-24 mx-auto text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-mono font-bold text-white mb-2">No posts yet</h3>
                        <p className="text-slate-400 mb-6">Be the first to start a conversation!</p>
                        {isAuthenticated && (
                            <button
                                onClick={handleCreatePost}
                                className="px-6 py-3 bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 rounded-lg font-mono font-semibold text-white shadow-glow-md hover:shadow-glow-lg transition-all duration-300"
                            >
                                Create First Post
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <div
                                key={post.postID || post.id}
                                onClick={() => handlePostClick(post)}
                                className="glass rounded-xl p-6 hover:shadow-glow-lg transition-all duration-300 cursor-pointer group"
                            >
                                {/* Post Header */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-electric-600 to-electric-700 flex items-center justify-center text-lg font-bold text-white">
                                        {post.User?.username?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <h4 className="font-mono font-semibold text-white">
                                            @{post.User?.username || 'anonymous'}
                                        </h4>
                                        <p className="text-xs text-slate-500">
                                            {post.createdAt ? getTimeAgo(post.createdAt) : 'Recently'}
                                        </p>
                                    </div>
                                </div>

                                {/* Post Content */}
                                <h3 className="text-xl font-mono font-bold text-white mb-2">
                                    {post.title}
                                </h3>
                                <p className="text-slate-400 mb-4 line-clamp-3">
                                    {post.bodyText}
                                </p>

                                {/* Post Image(s) */}
                                {post.mediaURL && post.mediaURL.length > 0 && (
                                    <div className="mb-4">
                                        <ImageSlider images={post.mediaURL} />
                                    </div>
                                )}

                                {/* Post Actions */}
                                <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <span>❤️</span>
                                        <span>{post.likes || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <span>💬</span>
                                        <span>{post.Comments?.length || post.comments?.length || 0}</span>
                                    </div>
                                    <div className="ml-auto text-xs text-slate-600 group-hover:text-electric-400 transition-colors">
                                        Click to view details →
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Post Modal */}
            <CreatePostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchPosts}
            />

            {/* Post Detail Modal */}
            <PostDetailModal
                isOpen={isPostDetailOpen}
                onClose={() => {
                    setIsPostDetailOpen(false);
                    setSelectedPost(null);
                }}
                post={selectedPost}
                onPostUpdated={handlePostUpdated}
            />
        </div>
    );
};

export default Community;
