import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectsAPI } from '../api/projects';
import { Project } from '../types';
import { useAuth } from '../context/AuthContext';
import ProjectModal from '../components/ProjectModal';
import ImageSlider from '../components/ImageSlider';

const ProjectDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isTeamMember, setIsTeamMember] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        // Set dynamic page title
        if (project) {
            document.title = `${project.projectName} | DevPath`;
        } else {
            document.title = 'Project Details | DevPath';
        }
    }, [project]);

    useEffect(() => {
        if (id) {
            fetchProject();
        }
    }, [id]);

    const fetchProject = async () => {
        try {
            setIsLoading(true);
            setError('');
            const data = await projectsAPI.getProject(id!);
            setProject(data);

            // Check if current user is a team member
            if (isAuthenticated && user && data.Team?.Users) {
                const isMember = data.Team.Users.some((teamUser: any) =>
                    teamUser.userID === user.userID || teamUser.username === user.username
                );
                setIsTeamMember(isMember);
            }
        } catch (err: any) {
            console.error('Error fetching project:', err);
            setError(err.message || 'Failed to load project');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditModalOpen(true);
    };

    const handleEditSuccess = () => {
        fetchProject();  // Refresh project data after edit
        setIsEditModalOpen(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen py-20 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-electric-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="glass rounded-xl p-12 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-600/20 flex items-center justify-center">
                            <span className="text-4xl">⚠️</span>
                        </div>
                        <h2 className="text-2xl font-mono font-bold text-white mb-4">
                            {error || 'Project Not Found'}
                        </h2>
                        <p className="text-slate-400 mb-6">
                            The project you're looking for doesn't exist or has been removed.
                        </p>
                        <Link
                            to="/projects"
                            className="inline-block px-6 py-3 bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 rounded-lg font-mono font-semibold text-white shadow-glow-md hover:shadow-glow-lg transition-all duration-300"
                        >
                            ← Back to Projects
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    to="/projects"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 font-mono text-sm"
                >
                    <span>←</span> Back to Projects
                </Link>

                {/* Project Header */}
                <div className="glass rounded-xl p-8 mb-6">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <h1 className="text-4xl font-mono font-bold text-white mb-4">
                                {project.projectName}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-slate-400">
                                <span className="flex items-center gap-2">
                                    <span>👤</span>
                                    <span>by @{project.user?.username || project.Team?.Users?.[0]?.username || 'anonymous'}</span>
                                </span>
                                {project.createdAt && (
                                    <span className="flex items-center gap-2">
                                        <span>📅</span>
                                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Edit Button (only for team members) */}
                        {isTeamMember && (
                            <button
                                onClick={handleEdit}
                                className="px-6 py-3 bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 rounded-lg font-mono font-semibold text-white shadow-glow-md hover:shadow-glow-lg transition-all duration-300"
                            >
                                Edit Project
                            </button>
                        )}
                    </div>

                    {/* Tech Stack */}
                    {project.techStack && project.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {project.techStack.map((tech, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-void-900 border border-white/10 rounded-full text-xs font-mono text-electric-400"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Description */}
                    <div className="prose prose-invert max-w-none">
                        <p className="text-slate-300 text-lg leading-relaxed">
                            {project.description || 'No description provided.'}
                        </p>
                    </div>
                </div>

                {/* Links Section */}
                {(project.gitHubRepo || project.liveDemoURL) && (
                    <div className="glass rounded-xl p-6 mb-6">
                        <h2 className="text-xl font-mono font-bold text-white mb-4">Links</h2>
                        <div className="flex flex-wrap gap-4">
                            {project.gitHubRepo && (
                                <a
                                    href={project.gitHubRepo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-3 glass glass-hover rounded-lg font-mono text-white transition-all"
                                >
                                    <span>🔗</span>
                                    <span>GitHub Repository</span>
                                </a>
                            )}
                            {project.liveDemoURL && (
                                <a
                                    href={project.liveDemoURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyber-500 to-cyber-600 hover:from-cyber-400 hover:to-cyber-500 rounded-lg font-mono text-white shadow-glow-cyber-sm hover:shadow-glow-cyber-md transition-all"
                                >
                                    <span>🚀</span>
                                    <span>Live Demo</span>
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* Team Members */}
                {project.Team?.Users && project.Team.Users.length > 0 && (
                    <div className="glass rounded-xl p-6">
                        <h2 className="text-xl font-mono font-bold text-white mb-4">Team Members</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {project.Team.Users.map((member: any) => (
                                <div
                                    key={member.userID || member.username}
                                    className="flex items-center gap-3 p-3 glass rounded-lg"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-600 to-electric-700 flex items-center justify-center text-sm font-bold text-white">
                                        {member.username?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <p className="font-mono font-semibold text-white">
                                            @{member.username}
                                        </p>
                                        {member.TeamMember?.role && (
                                            <p className="text-xs text-slate-500">
                                                {member.TeamMember.role}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {/* Screenshots */}
                {project.screenshots && project.screenshots.length > 0 && (
                    <div className="glass rounded-xl p-6 mb-6">
                        <h2 className="text-xl font-mono font-bold text-white mb-4">Screenshots</h2>
                        <ImageSlider images={project.screenshots} autoHeight={true} />
                    </div>
                )}
                
            </div>

            {/* Edit Project Modal */}
            {project && (
                <ProjectModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSuccess={handleEditSuccess}
                    mode="edit"
                    project={project}
                />
            )}
        </div>
    );
};

export default ProjectDetails;
