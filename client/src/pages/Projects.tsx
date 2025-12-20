import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../api/projects';
import { Project } from '../types';
import ProjectModal from '../components/ProjectModal';

const Projects: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
    const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);

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
            const response = await projectsAPI.getProjects();
            // Handle both array response and object with projects property
            const data = Array.isArray(response) ? response : (response.projects || response.data || []);
            console.log('Projects data:', data);
            setProjects(data);
        } catch (err: any) {
            console.error('Error fetching projects:', err);
            setError(err.message || 'Failed to load projects');
            setProjects([]); // Set empty array on error
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddProject = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: '/projects' } } });
        } else {
            setModalMode('create');
            setSelectedProject(undefined);
            setIsModalOpen(true);
        }
    };

    const handleProjectClick = (project: Project) => {
        // Check if current user owns this project
        // Projects belong to teams, and teams have users
        // For simplicity, we'll check if the user's username matches any team member
        const isOwner = project.Team?.Users?.some(
            (teamUser: any) => teamUser.username === user?.username
        );

        if (isOwner) {
            setModalMode('edit');
        } else {
            setModalMode('view');
        }
        setSelectedProject(project);
        setIsModalOpen(true);
    };



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

                {/* Login Prompt for Unauthenticated Users */}
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

                {/* Projects Grid */}
                {!isLoading && !error && (
                    projects.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="mb-6">
                                <svg className="w-24 h-24 mx-auto text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-mono font-bold text-white mb-2">No projects yet</h3>
                            <p className="text-slate-400 mb-6">Be the first to share your amazing work!</p>
                            {isAuthenticated && (
                                <button
                                    onClick={handleAddProject}
                                    className="px-6 py-3 bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 rounded-lg font-mono font-semibold text-white shadow-glow-md hover:shadow-glow-lg transition-all duration-300"
                                >
                                    Add Your First Project
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <div
                                    key={project.projectID || project.id}
                                    onClick={() => handleProjectClick(project)}
                                    className="glass rounded-xl p-6 hover:shadow-glow-lg transition-all duration-300 cursor-pointer group"
                                >
                                    {/* Project Header */}
                                    <div className="mb-4">
                                        <h3 className="text-xl font-mono font-bold text-white mb-2">
                                            {project.projectName}
                                        </h3>
                                        <p className="text-sm text-slate-400">
                                            {project.description}
                                        </p>
                                    </div>

                                    {/* Tech Stack */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.techStack?.map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-3 py-1 bg-void-900 border border-white/10 rounded-full text-xs font-mono text-electric-400"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Author */}
                                    <div className="pt-4 border-t border-white/10">
                                        <span className="text-xs text-slate-600">
                                            by @{project.user?.username || 'anonymous'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>

            {/* Project Modal */}
            <ProjectModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedProject(undefined);
                }}
                onSuccess={fetchProjects}
                mode={modalMode}
                project={selectedProject}
            />
        </div>
    );
};

export default Projects;
