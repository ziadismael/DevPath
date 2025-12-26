import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usersAPI } from '../api/users';
import { projectsAPI } from '../api/projects';
import { communityAPI } from '../api/community';
import { useAuth } from '../context/AuthContext';
import { User, Post, Project } from '../types';
import PostDetailModal from '../components/PostDetailModal';

const UserProfile: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'posts' | 'projects'>('posts');
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowLoading, setIsFollowLoading] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    useEffect(() => {
        if (username) {
            fetchUserProfile();
        }
    }, [username]);

    const fetchUserProfile = async () => {
        setIsLoading(true);
        setError('');
        try {
            const userData = await usersAPI.getUserByUsername(username!);
            setProfileUser(userData);

            if (currentUser && userData.followers) {
                setIsFollowing(userData.followers.some((f: User) => f.username === currentUser.username));
            }

            const allPosts = await communityAPI.getPosts();
            const userPosts = allPosts.filter((post: Post) =>
                post.User?.username === username || post.user?.username === username
            );
            setPosts(userPosts);

            const allProjects = await projectsAPI.getProjects();
            const userProjects = allProjects.filter((project: Project) =>
                project.Team?.Users?.some((member: any) => member.username === username)
            );
            setProjects(userProjects);

        } catch (err: any) {
            console.error('Error fetching user profile:', err);
            setError(err.response?.data?.message || 'Failed to load user profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFollowToggle = async () => {
        if (!profileUser || !currentUser) return;

        setIsFollowLoading(true);
        try {
            if (isFollowing) {
                await usersAPI.unfollowUser(profileUser.username);
                setIsFollowing(false);
            } else {
                await usersAPI.followUser(profileUser.username);
                setIsFollowing(true);
            }
            fetchUserProfile();
        } catch (err) {
            console.error('Error toggling follow:', err);
        } finally {
            setIsFollowLoading(false);
        }
    };

    const handlePostClick = (post: Post) => {
        setSelectedPost(post);
        setIsPostModalOpen(true);
    };

    const handlePostModalClose = () => {
        setIsPostModalOpen(false);
        setSelectedPost(null);
    };

    const isOwnProfile = currentUser?.username === username;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-void-950 pt-20 px-4">
                <div className="max-w-[95vw] mx-auto">
                    <div className="terminal p-8 animate-pulse min-h-[85vh]">
                        <div className="flex items-center gap-6 mb-6">
                            <div className="w-24 h-24 rounded-full bg-slate-700"></div>
                            <div className="flex-1">
                                <div className="h-8 bg-slate-700 rounded w-48 mb-2"></div>
                                <div className="h-4 bg-slate-700 rounded w-32"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !profileUser) {
        return (
            <div className="min-h-screen bg-void-950 pt-20 px-4">
                <div className="max-w-[95vw] mx-auto">
                    <div className="terminal p-8 text-center min-h-[85vh]">
                        <div className="flex items-center gap-2 mb-6 pb-3 border-b border-white/10">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <span className="text-slate-500 text-xs">~/devpath/error</span>
                        </div>
                        <div className="space-y-2 text-left mb-6">
                            <div className="flex">
                                <span className="text-syntax-green">$</span>
                                <span className="ml-2 text-slate-300">cat user/{username}</span>
                            </div>
                            <div className="text-red-400 ml-4">
                                cat: user/{username}: No such file or directory
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/community')}
                            className="px-6 py-2 bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 text-white rounded-lg font-mono font-semibold transition-all shadow-glow-md"
                        >
                            cd /community
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-void-950">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Post Detail Modal */}
            <PostDetailModal
                isOpen={isPostModalOpen}
                onClose={handlePostModalClose}
                post={selectedPost}
                onPostUpdated={fetchUserProfile}
            />

            <div className="w-full relative z-10 px-8 pt-8">
                {/* Single Continuous Terminal */}
                <div className="terminal shadow-glow-lg max-h-[85vh] overflow-auto rounded-none">
                    {/* Terminal Header */}
                    <div className="flex items-center gap-2 mb-6 pb-3 border-b border-white/10">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <span className="text-slate-500 text-xs">~/devpath/users/{username}</span>
                    </div>

                    {/* Terminal Content */}
                    <div className="space-y-6">
                        {/* User Info Command */}
                        <div className="flex">
                            <span className="text-syntax-green">$</span>
                            <span className="ml-2 text-slate-300">cat user.json</span>
                        </div>

                        {/* User Data Display */}
                        <div className="ml-4 space-y-4">
                            <div className="flex items-start gap-6">
                                {/* Avatar */}
                                <div className="relative flex-shrink-0">
                                    <div className="absolute inset-0 bg-gradient-to-r from-electric-500 to-purple-500 rounded-lg blur-md opacity-50"></div>
                                    <div className="relative w-24 h-24 rounded-lg bg-gradient-to-br from-electric-600 via-electric-700 to-purple-700 flex items-center justify-center text-4xl font-bold text-white shadow-glow-md">
                                        {profileUser.username?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                </div>

                                {/* User Details */}
                                <div className="flex-1">
                                    <div className="font-mono text-sm space-y-1">
                                        <div className="flex gap-2">
                                            <span className="text-syntax-pink">"name":</span>
                                            <span className="text-syntax-green">"{profileUser.firstName} {profileUser.lastName}"</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="text-syntax-pink">"username":</span>
                                            <span className="text-syntax-green">"@{profileUser.username}"</span>
                                        </div>
                                        {profileUser.role && (
                                            <div className="flex gap-2">
                                                <span className="text-syntax-pink">"role":</span>
                                                <span className="text-syntax-green">"{profileUser.role}"</span>
                                            </div>
                                        )}
                                        {profileUser.university && (
                                            <div className="flex gap-2">
                                                <span className="text-syntax-pink">"university":</span>
                                                <span className="text-syntax-green">"{profileUser.university}"</span>
                                            </div>
                                        )}
                                        {profileUser.country && (
                                            <div className="flex gap-2">
                                                <span className="text-syntax-pink">"country":</span>
                                                <span className="text-syntax-green">"{profileUser.country}"</span>
                                            </div>
                                        )}
                                        {/* Follow Status - Terminal Style */}
                                        {!isOwnProfile && currentUser && (
                                            <div className="flex gap-2 items-center mt-2">
                                                <span className="text-syntax-pink">"status":</span>
                                                <button
                                                    onClick={handleFollowToggle}
                                                    disabled={isFollowLoading}
                                                    className={`font-mono transition-all duration-300 disabled:opacity-50 cursor-pointer underline decoration-dotted underline-offset-4 animate-pulse-slow ${isFollowing
                                                        ? 'text-syntax-green hover:text-electric-500'
                                                        : 'text-slate-500 hover:text-syntax-green'
                                                        }`}
                                                >
                                                    {isFollowLoading ? '"loading..."' : isFollowing ? '"followed"' : '"not_followed"'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Command */}
                        <div className="flex mt-6">
                            <span className="text-syntax-green">$</span>
                            <span className="ml-2 text-slate-300">ls -la stats/</span>
                        </div>

                        {/* Stats Display */}
                        <div className="ml-4 grid grid-cols-2 gap-4 max-w-md">
                            <div className="glass rounded-lg p-4 hover:bg-white/5 transition-all">
                                {/* <div className="text-xs text-slate-500 font-mono mb-1">drwxr-xr-x</div> */}
                                <div className="text-2xl font-mono font-bold gradient-text">
                                    {profileUser.followers?.length || 0}
                                </div>
                                <div className="text-sm text-electric-400 font-mono">followers/</div>
                            </div>
                            <div className="glass rounded-lg p-4 hover:bg-white/5 transition-all">
                                {/* <div className="text-xs text-slate-500 font-mono mb-1">drwxr-xr-x</div> */}
                                <div className="text-2xl font-mono font-bold gradient-text">
                                    {profileUser.following?.length || 0}
                                </div>
                                <div className="text-sm text-electric-400 font-mono">following/</div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-white/10 my-1"></div>

                        {/* Tab Selector */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => setActiveTab('posts')}
                                className={`px-4 py-2 rounded-lg font-mono font-semibold transition-all ${activeTab === 'posts'
                                    ? 'bg-electric-600/20 text-electric-400 shadow-glow-sm'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <span className="text-syntax-green">$</span> cd posts/ ({posts.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('projects')}
                                className={`px-4 py-2 rounded-lg font-mono font-semibold transition-all ${activeTab === 'projects'
                                    ? 'bg-electric-600/20 text-electric-400 shadow-glow-sm'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <span className="text-syntax-green">$</span> cd projects/ ({projects.length})
                            </button>
                        </div>

                        {/* Content */}
                        <div className="space-y-4 min-h-[40vh]">
                            <span className="text-slate-500 text-xs">~/devpath/{username}/{activeTab}</span>
                            {activeTab === 'posts' && (
                                <>
                                    {posts.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="text-slate-500 font-mono text-sm">
                                                <div className="flex justify-center mb-2">
                                                    <span className="text-syntax-green">$</span>
                                                    <span className="ml-2">ls posts/</span>
                                                </div>
                                                <div className="text-slate-600">ls: cannot access 'posts/': No such file or directory</div>
                                            </div>
                                        </div>
                                    ) : (
                                        posts.map((post, index) => (
                                            <div
                                                key={post.postID || post.id}
                                                className="glass rounded-lg p-5 hover:bg-white/5 hover:shadow-glow-md transition-all duration-300 cursor-pointer border border-white/5 hover:border-electric-500/30 group"
                                                onClick={() => handlePostClick(post)}
                                            >
                                                <div className="flex items-start gap-3 mb-3">
                                                    <span className="text-syntax-blue font-mono text-sm">[{String(index + 1).padStart(2, '0')}]</span>
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-mono font-bold text-white mb-2 group-hover:text-electric-400 transition-colors">
                                                            {post.title}
                                                        </h3>
                                                        <p className="text-slate-400 text-sm line-clamp-2 mb-3">{post.bodyText}</p>
                                                        <div className="flex items-center gap-4 text-xs font-mono">
                                                            <span className="text-syntax-pink">
                                                                likes: <span className="text-syntax-green">{post.likes || 0}</span>
                                                            </span>
                                                            <span className="text-syntax-pink">
                                                                comments: <span className="text-syntax-green">{post.comments?.length || post.Comments?.length || 0}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </>
                            )}

                            {activeTab === 'projects' && (
                                <>
                                    {projects.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="text-slate-500 font-mono text-sm">
                                                <div className="flex justify-center mb-2">
                                                    <span className="text-syntax-green">$</span>
                                                    <span className="ml-2">ls projects/</span>
                                                </div>
                                                <div className="text-slate-600">ls: cannot access 'projects/': No such file or directory</div>
                                            </div>
                                        </div>
                                    ) : (
                                        projects.map((project, index) => (
                                            <div
                                                key={project.projectID}
                                                className="glass rounded-lg p-5 hover:bg-white/5 hover:shadow-glow-md transition-all duration-300 cursor-pointer border border-white/5 hover:border-electric-500/30 group"
                                                onClick={() => navigate(`/projects/${project.projectID}`)}
                                            >
                                                <div className="flex items-start gap-3 mb-3">
                                                    <span className="text-syntax-blue font-mono text-sm">[{String(index + 1).padStart(2, '0')}]</span>
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-mono font-bold text-white mb-2 group-hover:text-electric-400 transition-colors">
                                                            {project.projectName}
                                                        </h3>
                                                        <p className="text-slate-400 text-sm line-clamp-2 mb-3">{project.description}</p>
                                                        {project.techStack && project.techStack.length > 0 && (
                                                            <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
                                                                <span className="text-syntax-pink">tech:</span>
                                                                {project.techStack.slice(0, 5).map((tech, i) => (
                                                                    <span key={i} className="px-2 py-1 bg-electric-500/20 text-electric-400 rounded">
                                                                        {tech}
                                                                    </span>
                                                                ))}
                                                                {project.techStack.length > 5 && (
                                                                    <span className="text-slate-500">+{project.techStack.length - 5}</span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
