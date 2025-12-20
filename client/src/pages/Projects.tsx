import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../api/projects';
import { Project } from '../types';

const Projects: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    // State for authenticated users
    const [myProjects, setMyProjects] = useState<Project[]>([]);
    const [communityProjects, setCommunityProjects] = useState<Project[]>([]);
    const [showAllMyProjects, setShowAllMyProjects] = useState(false);
    const [showAllCommunityProjects, setShowAllCommunityProjects] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            fetchProjects();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        // Set dynamic page title
        if (isAuthenticated) {
            document.title = 'Projects | DevPath';
        } else {
            document.title = 'DevPath | Empower Your Developer Journey';
        }
    }, [isAuthenticated]);

    const fetchProjects = async () => {
        try {
            setIsLoading(true);
            setError('');

            // Fetch user's projects and all projects in parallel
            const [myProjectsData, allProjectsData] = await Promise.all([
                projectsAPI.getMyProjects(),
                projectsAPI.getCommunityProjects()
            ]);

            setMyProjects(myProjectsData);

            // Filter out user's projects from community projects
            const userProjectIds = new Set(myProjectsData.map(p => p.projectID || p.id));
            const filteredCommunity = allProjectsData.filter(p =>
                !userProjectIds.has(p.projectID || p.id)
            );
            setCommunityProjects(filteredCommunity);
        } catch (err: any) {
            console.error('Error fetching projects:', err);
            setError(err.message || 'Failed to load projects');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddProject = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: '/projects' } } });
        } else {
            // TODO: Navigate to create project page or open modal
            console.log('Create project');
        }
    };

    const handleProjectClick = (project: Project) => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: '/projects' } } });
            return;
        }
        // Navigate to project details page
        navigate(`/projects/${project.projectID || project.id}`);
    };

    // Mock projects for guest users
    const mockProjects: Project[] = [
        {
            projectID: 'mock-1',
            projectName: 'AI Task Manager',
            description: 'An intelligent task management system powered by AI to help you prioritize and organize your work efficiently.',
            techStack: ['React', 'TypeScript', 'Node.js', 'OpenAI'],
            user: { username: 'devmaster', firstName: 'Dev', lastName: 'Master' },
        },
        {
            projectID: 'mock-2',
            projectName: 'Real-time Chat App',
            description: 'A modern chat application with real-time messaging, file sharing, and video calls.',
            techStack: ['Next.js', 'Socket.io', 'MongoDB', 'WebRTC'],
            user: { username: 'codewarrior', firstName: 'Code', lastName: 'Warrior' },
        },
        {
            projectID: 'mock-3',
            projectName: 'E-commerce Platform',
            description: 'Full-featured e-commerce platform with payment integration, inventory management, and analytics.',
            techStack: ['Vue.js', 'Express', 'PostgreSQL', 'Stripe'],
            user: { username: 'fullstackdev', firstName: 'Full', lastName: 'Stack' },
        },
        {
            projectID: 'mock-4',
            projectName: 'Fitness Tracker',
            description: 'Track your workouts, nutrition, and progress with detailed analytics and personalized recommendations.',
            techStack: ['React Native', 'Firebase', 'TensorFlow'],
            user: { username: 'healthcoder', firstName: 'Health', lastName: 'Coder' },
        },
        {
            projectID: 'mock-5',
            projectName: 'Code Snippet Manager',
            description: 'Organize and share your code snippets with syntax highlighting and team collaboration features.',
            techStack: ['Angular', 'NestJS', 'Redis', 'Elasticsearch'],
            user: { username: 'snippetking', firstName: 'Snippet', lastName: 'King' },
        },
        {
            projectID: 'mock-6',
            projectName: 'Weather Dashboard',
            description: 'Beautiful weather dashboard with forecasts, maps, and historical data visualization.',
            techStack: ['Svelte', 'D3.js', 'Python', 'FastAPI'],
            user: { username: 'weatherdev', firstName: 'Weather', lastName: 'Dev' },
        },
    ];

    const renderProjectCard = (project: Project) => (
        <div
            key={project.projectID || project.id}
            onClick={() => handleProjectClick(project)}
            className="glass glass-hover rounded-xl p-6 glow-electric cursor-pointer"
        >
            {/* Project Header */}
            <div className="mb-4">
                <h3 className="text-xl font-mono font-bold text-white mb-2">
                    {project.projectName}
                </h3>
                <p className="text-sm text-slate-400 line-clamp-2">
                    {project.description}
                </p>
            </div>

            {/* Tech Stack */}
            {project.techStack && project.techStack.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.slice(0, 4).map((tech, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-void-900 border border-white/10 rounded-full text-xs font-mono text-electric-400"
                        >
                            {tech}
                        </span>
                    ))}
                    {project.techStack.length > 4 && (
                        <span className="px-3 py-1 text-xs font-mono text-slate-500">
                            +{project.techStack.length - 4} more
                        </span>
                    )}
                </div>
            )}

            {/* Author */}
            <div className="pt-4 border-t border-white/10">
                <span className="text-xs text-slate-600">
                    by @{project.user?.username || 'anonymous'}
                </span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
                    <div>
                        <h1 className="text-5xl font-mono font-bold mb-4">
                            <span className="gradient-text">Project</span>
                            <span className="text-white"> Showcase</span>
                        </h1>
                        <p className="text-xl text-slate-400">
                            Share your work and get feedback from the community
                        </p>
                    </div>

                    <button
                        onClick={handleAddProject}
                        className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 rounded-lg font-mono font-semibold text-white shadow-glow-md hover:shadow-glow-lg transition-all duration-300"
                    >
                        Add Project
                    </button>
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
                                    Sign in to upload projects, leave feedback, and interact with the community
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Guest View: Mock Projects */}
                {!isAuthenticated && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockProjects.map(renderProjectCard)}
                    </div>
                )}

                {/* Authenticated View: My Projects & Community Projects */}
                {isAuthenticated && (
                    <>
                        {/* Loading State */}
                        {isLoading && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 border-4 border-electric-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-slate-400 font-mono">Loading projects...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && !isLoading && (
                            <div className="text-center py-12">
                                <div className="glass rounded-xl p-8 max-w-md mx-auto">
                                    <p className="text-red-400 mb-4">{error}</p>
                                    <button
                                        onClick={fetchProjects}
                                        className="px-6 py-3 bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 rounded-lg font-mono font-semibold text-white shadow-glow-md hover:shadow-glow-lg transition-all duration-300"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Projects Content */}
                        {!isLoading && !error && (
                            <>
                                {/* My Projects Section */}
                                <div className="mb-12">
                                    <h2 className="text-3xl font-mono font-bold text-white mb-6">
                                        My Projects
                                    </h2>
                                    {myProjects.length === 0 ? (
                                        <div className="text-center py-12 glass rounded-xl">
                                            <div className="mb-6">
                                                <svg className="w-20 h-20 mx-auto text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                </svg>
                                            </div>
                                            <h3 className="text-2xl font-mono font-bold text-white mb-2">No projects yet</h3>
                                            <p className="text-slate-400 mb-6">Share your amazing work with the community!</p>
                                            <button
                                                onClick={handleAddProject}
                                                className="px-6 py-3 bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 rounded-lg font-mono font-semibold text-white shadow-glow-md hover:shadow-glow-lg transition-all duration-300"
                                            >
                                                Add Your First Project
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {(showAllMyProjects ? myProjects : myProjects.slice(0, 3)).map(renderProjectCard)}
                                            </div>
                                            {myProjects.length > 3 && (
                                                <div className="text-center mt-6">
                                                    <button
                                                        onClick={() => setShowAllMyProjects(!showAllMyProjects)}
                                                        className="px-6 py-3 glass glass-hover rounded-lg font-mono font-semibold text-white transition-all"
                                                    >
                                                        {showAllMyProjects ? 'Show Less' : `View More (${myProjects.length - 3} more)`}
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Community Projects Section */}
                                <div>
                                    <h2 className="text-3xl font-mono font-bold text-white mb-6">
                                        Community Projects
                                    </h2>
                                    {communityProjects.length === 0 ? (
                                        <div className="text-center py-12 glass rounded-xl">
                                            <p className="text-slate-400">No community projects available yet.</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {(showAllCommunityProjects ? communityProjects : communityProjects.slice(0, 3)).map(renderProjectCard)}
                                            </div>
                                            {communityProjects.length > 3 && (
                                                <div className="text-center mt-6">
                                                    <button
                                                        onClick={() => setShowAllCommunityProjects(!showAllCommunityProjects)}
                                                        className="px-6 py-3 glass glass-hover rounded-lg font-mono font-semibold text-white transition-all"
                                                    >
                                                        {showAllCommunityProjects ? 'Show Less' : `View More (${communityProjects.length - 3} more)`}
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Projects;
