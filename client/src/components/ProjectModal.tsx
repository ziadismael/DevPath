import React, { useState, useEffect } from 'react';
import { projectsAPI } from '../api/projects';
import { Project } from '../types';
import { teamsAPI, TeamMember } from '../api/teams';
import { usersAPI } from '../api/users';
import { useAuth } from '../context/AuthContext';

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    mode?: 'create' | 'edit' | 'view';
    project?: Project;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    mode = 'create',
    project
}) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        projectName: '',
        description: '',
        techStack: '',
        gitHubRepo: '',
        liveDemoURL: '',
        screenshots: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Team member management state
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Pre-fill form when in edit or view mode
    useEffect(() => {
        if ((mode === 'edit' || mode === 'view') && project) {
            setFormData({
                projectName: project.projectName || '',
                description: project.description || '',
                techStack: project.techStack?.join(', ') || '',
                gitHubRepo: project.gitHubRepo || '',
                liveDemoURL: project.liveDemoURL || '',
                screenshots: project.screenshots?.join(', ') || '',
            });
        } else if (mode === 'create') {
            // Reset form for create mode
            setFormData({
                projectName: '',
                description: '',
                techStack: '',
                gitHubRepo: '',
                liveDemoURL: '',
                screenshots: '',
            });
        }
    }, [mode, project]);

    // Load team members when in edit mode
    useEffect(() => {
        if (mode === 'edit' && project?.Team?.Users) {
            setTeamMembers(project.Team.Users);
        } else {
            setTeamMembers([]);
        }
    }, [mode, project]);

    // Search for users
    useEffect(() => {
        const searchUsers = async () => {
            if (searchQuery.trim().length < 2) {
                setSearchResults([]);
                return;
            }

            setIsSearching(true);
            try {
                const results = await usersAPI.searchUsers(searchQuery);
                // Filter out current user and already added members
                const filtered = results.filter(
                    (u: any) =>
                        u.username !== user?.username &&
                        !teamMembers.some(m => m.username === u.username)
                );
                setSearchResults(filtered);
            } catch (err) {
                console.error('Error searching users:', err);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        };

        const debounce = setTimeout(searchUsers, 300);
        return () => clearTimeout(debounce);
    }, [searchQuery, teamMembers, user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleAddMember = async (username: string, role: string = 'Contributor') => {
        if (!project?.Team?.teamID) return;

        try {
            await teamsAPI.addTeamMember(project.Team.teamID, username, role);
            // Refresh team members
            const updatedTeam = await teamsAPI.getTeamById(project.Team.teamID);
            console.log('Updated team:', updatedTeam);
            console.log('Users array:', updatedTeam.Users);
            setTeamMembers(updatedTeam.Users || []);
            setSearchQuery('');
            setSearchResults([]);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add team member');
        }
    };

    const handleRemoveMember = async (userID: string) => {
        if (!project?.Team?.teamID) return;

        try {
            await teamsAPI.removeTeamMember(project.Team.teamID, userID);
            // Update local state
            setTeamMembers(teamMembers.filter(m => m.userID !== userID));
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to remove team member');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            // Convert comma-separated strings to arrays
            const techStackArray = formData.techStack
                .split(',')
                .map(item => item.trim())
                .filter(item => item.length > 0);

            const screenshotsArray = formData.screenshots
                .split(',')
                .map(item => item.trim())
                .filter(item => item.length > 0);

            const projectData = {
                projectName: formData.projectName,
                description: formData.description,
                techStack: techStackArray.length > 0 ? techStackArray : undefined,
                gitHubRepo: formData.gitHubRepo || undefined,
                liveDemoURL: formData.liveDemoURL || undefined,
                screenshots: screenshotsArray.length > 0 ? screenshotsArray : undefined,
            };

            if (mode === 'edit' && project?.projectID) {
                await projectsAPI.updateProject(project.projectID, projectData);
            } else {
                await projectsAPI.createProject(projectData);
            }

            // Reset form and close modal
            setFormData({
                projectName: '',
                description: '',
                techStack: '',
                gitHubRepo: '',
                liveDemoURL: '',
                screenshots: '',
            });
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || `Failed to ${mode} project`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const isReadOnly = mode === 'view';
    const modalTitle = mode === 'create' ? 'Add New Project' : mode === 'edit' ? 'Edit Project' : 'Project Details';
    const submitButtonText = mode === 'edit' ? 'Update Project' : 'Create Project';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="glass rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 glass border-b border-white/10 p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-mono font-bold gradient-text">{modalTitle}</h2>
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

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Project Name */}
                    <div>
                        <label className="block text-sm font-mono text-slate-400 mb-2">
                            Project Name {!isReadOnly && <span className="text-red-400">*</span>}
                        </label>
                        <input
                            type="text"
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleChange}
                            required={!isReadOnly}
                            disabled={isReadOnly}
                            className={`w-full px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-electric-500 transition-colors ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                            placeholder="My Awesome Project"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-mono text-slate-400 mb-2">
                            Description {!isReadOnly && <span className="text-red-400">*</span>}
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required={!isReadOnly}
                            disabled={isReadOnly}
                            rows={4}
                            className={`w-full px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-electric-500 transition-colors resize-none ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                            placeholder="Describe your project..."
                        />
                    </div>

                    {/* Tech Stack */}
                    <div>
                        <label className="block text-sm font-mono text-slate-400 mb-2">
                            Tech Stack
                        </label>
                        <input
                            type="text"
                            name="techStack"
                            value={formData.techStack}
                            onChange={handleChange}
                            disabled={isReadOnly}
                            className={`w-full px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-electric-500 transition-colors ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                            placeholder="React, Node.js, MongoDB (comma-separated)"
                        />
                        {!isReadOnly && <p className="mt-1 text-xs text-slate-500">Separate technologies with commas</p>}
                    </div>

                    {/* GitHub Repo */}
                    <div>
                        <label className="block text-sm font-mono text-slate-400 mb-2">
                            GitHub Repository URL
                        </label>
                        <input
                            type="url"
                            name="gitHubRepo"
                            value={formData.gitHubRepo}
                            onChange={handleChange}
                            disabled={isReadOnly}
                            className={`w-full px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-electric-500 transition-colors ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                            placeholder="https://github.com/username/repo"
                        />
                    </div>

                    {/* Live Demo URL */}
                    <div>
                        <label className="block text-sm font-mono text-slate-400 mb-2">
                            Live Demo URL
                        </label>
                        <input
                            type="url"
                            name="liveDemoURL"
                            value={formData.liveDemoURL}
                            onChange={handleChange}
                            disabled={isReadOnly}
                            className={`w-full px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-electric-500 transition-colors ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                            placeholder="https://myproject.com"
                        />
                    </div>

                    {/* Screenshots */}
                    <div>
                        <label className="block text-sm font-mono text-slate-400 mb-2">
                            Screenshot URLs
                        </label>
                        <input
                            type="text"
                            name="screenshots"
                            value={formData.screenshots}
                            onChange={handleChange}
                            disabled={isReadOnly}
                            className={`w-full px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-electric-500 transition-colors ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                            placeholder="https://example.com/img1.png, https://example.com/img2.png"
                        />
                        {!isReadOnly && <p className="mt-1 text-xs text-slate-500">Separate URLs with commas</p>}
                    </div>

                    {/* Team Members Section (Edit Mode Only) */}
                    {mode === 'edit' && project?.Team && (
                        <div className="border-t border-white/10 pt-6 mt-6">
                            <h3 className="text-lg font-mono font-bold text-white mb-4">Team Members</h3>

                            {/* Current Team Members */}
                            <div className="space-y-2 mb-4">
                                {teamMembers.map((member) => (
                                    <div key={member.userID} className="flex items-center justify-between p-3 glass rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric-600 to-electric-700 flex items-center justify-center text-xs font-bold text-white">
                                                {member.username[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-mono text-sm text-white">@{member.username}</p>
                                                <p className="text-xs text-slate-500">{member.TeamMember?.role || 'Member'}</p>
                                            </div>
                                        </div>
                                        {member.TeamMember?.role !== 'Owner' && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveMember(member.userID)}
                                                className="px-3 py-1 text-xs bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Add Member Search */}
                            <div className="space-y-2">
                                <label className="block text-sm font-mono text-slate-400 mb-2">
                                    Add Team Member
                                </label>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by username..."
                                    className="w-full px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-electric-500 transition-colors"
                                />

                                {/* Search Results */}
                                {searchResults.length > 0 && (
                                    <div className="mt-2 max-h-48 overflow-y-auto space-y-1">
                                        {searchResults.map((searchUser: any) => (
                                            <div key={searchUser.username} className="flex items-center justify-between p-2 glass rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyber-500 to-cyber-600 flex items-center justify-center text-xs font-bold text-white">
                                                        {searchUser.username[0].toUpperCase()}
                                                    </div>
                                                    <span className="text-sm text-white">@{searchUser.username}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddMember(searchUser.username)}
                                                    className="px-3 py-1 text-xs bg-electric-600/20 hover:bg-electric-600/30 text-electric-400 rounded-lg transition-colors"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {isSearching && (
                                    <p className="text-xs text-slate-500 mt-2">Searching...</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-void-900 hover:bg-void-800 border border-white/10 rounded-lg font-mono font-semibold text-white transition-all duration-300"
                        >
                            {isReadOnly ? 'Close' : 'Cancel'}
                        </button>
                        {!isReadOnly && (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 rounded-lg font-mono font-semibold text-white shadow-glow-md hover:shadow-glow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (mode === 'edit' ? 'Updating...' : 'Creating...') : submitButtonText}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectModal;
