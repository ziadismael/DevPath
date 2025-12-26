import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectsAPI } from '../api/projects';
import { communityAPI } from '../api/community';
import { usersAPI } from '../api/users';
import { Project, Post } from '../types';
import PostDetailModal from '../components/PostDetailModal';

const Home: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const [recentProjects, setRecentProjects] = useState<Project[]>([]);
    const [recentPosts, setRecentPosts] = useState<Post[]>([]);
    const [stats, setStats] = useState({ projects: 0, followers: 0, following: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    useEffect(() => {
        // Set dynamic page title
        if (isAuthenticated && user) {
            document.title = `DevPath | @${user.username}`;
        } else {
            document.title = 'DevPath | Empower Your Developer Journey';
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchDashboardData();
        }
    }, [isAuthenticated]);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);

            // Fetch MY projects (personal or team projects I'm part of)
            const myProjects = await projectsAPI.getMyProjects();
            const projects = Array.isArray(myProjects) ? myProjects : [];
            setRecentProjects(projects.slice(0, 3));

            // Fetch posts and filter to only MY posts
            const postsResponse = await communityAPI.getPosts();
            const allPosts = Array.isArray(postsResponse)
                ? postsResponse
                : (postsResponse.posts || postsResponse.data || []);

            // Filter to show only current user's posts
            const myPosts = allPosts.filter((post: Post) =>
                post.userID === user?.userID ||
                post.User?.username === user?.username ||
                post.user?.username === user?.username
            );
            setRecentPosts(myPosts.slice(0, 3));

            // Fetch fresh profile data for accurate follower/following counts
            try {
                const profile = await usersAPI.getProfile();
                setStats({
                    projects: projects.length,
                    followers: profile.followers?.length || 0,
                    following: profile.following?.length || 0
                });
            } catch {
                // Fallback to user context if profile fetch fails
                setStats({
                    projects: projects.length,
                    followers: user?.followers?.length || 0,
                    following: user?.following?.length || 0
                });
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle post click to open modal
    const handlePostClick = (post: Post) => {
        setSelectedPost(post);
        setIsPostModalOpen(true);
    };

    // Handle modal close
    const handlePostModalClose = () => {
        setIsPostModalOpen(false);
        setSelectedPost(null);
    };

    // Authenticated Dashboard
    if (isAuthenticated) {
        return (
            <div className="min-h-screen py-20 relative overflow-hidden">
                {/* Ambient Background - Pulsing glows */}
                <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
                    {/* Purple - top left */}
                    <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-electric-600/[0.06] rounded-full blur-3xl" style={{ animation: 'gentlePulse 14s ease-in-out infinite' }}></div>
                    {/* Cyan - center */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] bg-cyber-500/[0.06] rounded-full blur-3xl" style={{ animation: 'gentlePulse 14s ease-in-out infinite', animationDelay: '2.5s' }}></div>
                    {/* Pink - bottom right */}
                    <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-syntax-pink/[0.06] rounded-full blur-3xl" style={{ animation: 'gentlePulse 14s ease-in-out infinite', animationDelay: '5s' }}></div>
                    {/* Green - bottom left */}
                    <div className="absolute bottom-1/4 left-1/4 -translate-x-1/2 translate-y-1/2 w-80 h-80 bg-syntax-green/[0.06] rounded-full blur-3xl" style={{ animation: 'gentlePulse 14s ease-in-out infinite', animationDelay: '7.5s' }}></div>
                </div>

                {/* Gentle pulse animation - smoother with more steps */}
                <style>{`
                    @keyframes gentlePulse {
                        0% { opacity: 0.5; transform: scale(1); }
                        25% { opacity: 0.6; transform: scale(1.02); }
                        50% { opacity: 0.7; transform: scale(1.04); }
                        75% { opacity: 0.6; transform: scale(1.02); }
                        100% { opacity: 0.5; transform: scale(1); }
                    }
                `}</style>

                {/* Post Detail Modal */}
                <PostDetailModal
                    isOpen={isPostModalOpen}
                    onClose={handlePostModalClose}
                    post={selectedPost}
                    onPostUpdated={fetchDashboardData}
                />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Welcome Header */}
                    <div className="mb-8">
                        <div className="terminal p-6 shadow-glow-md">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <span className="text-slate-500 text-xs">~/devpath/dashboard</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex">
                                    <span className="text-syntax-green">$</span>
                                    <span className="ml-2 text-slate-300">echo "Welcome back, ‎</span>
                                    <span className="text-electric-400"> @{user?.username}</span>
                                    <span className="text-slate-300">"</span>
                                </div>
                                <div className="text-syntax-blue ml-4">
                                    → Your coding journey continues...
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats & Quick Actions Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Quick Stats */}
                        <div className="glass rounded-xl p-6">
                            <h3 className="text-lg font-mono font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-syntax-green">const</span>
                                <span className="text-syntax-blue">stats</span>
                                <span className="text-slate-400">=</span>
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 glass rounded-lg">
                                    <div className="text-3xl font-mono font-bold gradient-text">{stats.projects}</div>
                                    <div className="text-sm text-slate-500">Projects</div>
                                </div>
                                <div className="text-center p-4 glass rounded-lg">
                                    <div className="text-3xl font-mono font-bold gradient-text">{stats.followers}</div>
                                    <div className="text-sm text-slate-500">Followers</div>
                                </div>
                                <div className="text-center p-4 glass rounded-lg">
                                    <div className="text-3xl font-mono font-bold gradient-text">{stats.following}</div>
                                    <div className="text-sm text-slate-500">Following</div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="glass rounded-xl p-6">
                            <h3 className="text-lg font-mono font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-syntax-pink">function</span>
                                <span className="text-syntax-blue">quickActions</span>
                                <span className="text-slate-400">()</span>
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <Link
                                    to="/projects"
                                    className="flex items-center gap-2 p-4 glass glass-hover rounded-lg text-white hover:text-electric-400 transition-colors"
                                >
                                    <span className="text-xl">🚀</span>
                                    <span className="font-mono text-sm">New Project</span>
                                </Link>
                                <Link
                                    to="/community"
                                    className="flex items-center gap-2 p-4 glass glass-hover rounded-lg text-white hover:text-cyber-400 transition-colors"
                                >
                                    <span className="text-xl">✍️</span>
                                    <span className="font-mono text-sm">Create Post</span>
                                </Link>
                                <Link
                                    to="/opportunities"
                                    className="flex items-center gap-2 p-4 glass glass-hover rounded-lg text-white hover:text-syntax-pink transition-colors"
                                >
                                    <span className="text-xl">🎯</span>
                                    <span className="font-mono text-sm">Find Jobs</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Recent Projects */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-mono font-bold text-white">
                                <span className="text-syntax-green">// </span>Your Projects
                            </h3>
                            <Link to="/projects" className="text-sm font-mono text-electric-400 hover:text-electric-300 transition-colors">
                                View All →
                            </Link>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="w-8 h-8 border-2 border-electric-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : recentProjects.length === 0 ? (
                            <div className="glass rounded-xl p-8 text-center">
                                <p className="text-slate-400 mb-4">No projects yet. Start building!</p>
                                <Link
                                    to="/projects"
                                    className="inline-block px-6 py-3 bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 rounded-lg font-mono font-semibold text-white shadow-glow-md hover:shadow-glow-lg transition-all"
                                >
                                    Create Your First Project
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {recentProjects.map((project) => (
                                    <Link
                                        key={project.projectID || project.id}
                                        to={`/projects/${project.projectID || project.id}`}
                                        className="glass glass-hover rounded-xl p-5 group"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-electric-600 to-electric-700 flex items-center justify-center text-lg font-bold text-white">
                                                {project.projectName?.[0]?.toUpperCase() || 'P'}
                                            </div>
                                            <div>
                                                <h4 className="font-mono font-semibold text-white group-hover:text-electric-400 transition-colors">
                                                    {project.projectName}
                                                </h4>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-400 line-clamp-2">
                                            {project.description || 'No description'}
                                        </p>
                                        {project.techStack && project.techStack.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-3">
                                                {project.techStack.slice(0, 3).map((tech, i) => (
                                                    <span key={i} className="px-2 py-0.5 text-xs bg-electric-600/20 text-electric-400 rounded">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* My Posts */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-mono font-bold text-white">
                                <span className="text-syntax-green">// </span>My Posts
                            </h3>
                            <Link to="/community" className="text-sm font-mono text-electric-400 hover:text-electric-300 transition-colors">
                                View All →
                            </Link>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="w-8 h-8 border-2 border-electric-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : recentPosts.length === 0 ? (
                            <div className="glass rounded-xl p-8 text-center">
                                <p className="text-slate-400 mb-4">No posts in the community yet.</p>
                                <Link
                                    to="/community"
                                    className="inline-block px-6 py-3 bg-gradient-to-r from-cyber-500 to-cyber-600 hover:from-cyber-400 hover:to-cyber-500 rounded-lg font-mono font-semibold text-white shadow-glow-cyber-md hover:shadow-glow-cyber-lg transition-all"
                                >
                                    Be the First to Post
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentPosts.map((post) => (
                                    <div
                                        key={post.postID || post.id}
                                        onClick={() => handlePostClick(post)}
                                        className="block glass glass-hover rounded-xl p-5 group cursor-pointer"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-500 to-cyber-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                                                {post.User?.username?.[0]?.toUpperCase() || post.user?.username?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-mono font-semibold text-white">
                                                        @{post.User?.username || post.user?.username || 'anonymous'}
                                                    </span>
                                                </div>
                                                <h4 className="font-semibold text-white group-hover:text-electric-400 transition-colors mb-1">
                                                    {post.title}
                                                </h4>
                                                <p className="text-sm text-slate-400 line-clamp-2">
                                                    {post.bodyText}
                                                </p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                                    <span>❤️ {post.likes || 0}</span>
                                                    <span>💬 {post.Comments?.length || post.comments?.length || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Landing Page for Unauthenticated Users
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

