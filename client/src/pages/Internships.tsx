import React, { useState, useEffect } from 'react';
import { internshipsAPI } from '../api/internships';
import { Internship } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Internships: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [internships, setInternships] = useState<Internship[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchInternships();
    }, [selectedFilter]);

    const fetchInternships = async () => {
        try {
            setIsLoading(true);
            setError('');
            const params: any = {};
            if (selectedFilter !== 'all') {
                params.location = selectedFilter;
            }
            const response = await internshipsAPI.getInternships(params);
            // Handle both array response and object with internships property
            const data = Array.isArray(response) ? response : (response.internships || response.data || []);
            console.log('Internships data:', data);
            setInternships(data);
        } catch (err: any) {
            console.error('Error fetching internships:', err);
            setError(err.message || 'Failed to load internships');
            setInternships([]); // Set empty array on error
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = async (id: string | number) => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: '/internships' } } });
            return;
        }

        try {
            await internshipsAPI.applyToInternship(id as number);
            alert('Application submitted successfully!');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to submit application');
        }
    };

    const filteredInternships = internships.filter((internship) =>
        searchTerm === '' ||
        internship.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-mono font-bold mb-4">
                        <span className="gradient-text">Find Your Next</span>
                        <br />
                        <span className="text-white">Internship</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Discover curated opportunities from top tech companies
                    </p>
                </div>

                {/* Search & Filters */}
                <div className="glass rounded-xl p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search Bar */}
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                placeholder="Search by company, position, or tech stack..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-electric-500 focus:ring-1 focus:ring-electric-500 transition-all"
                            />
                        </div>

                        {/* Filter Dropdown */}
                        <select
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                            className="px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-electric-500 focus:ring-1 focus:ring-electric-500 transition-all"
                        >
                            <option value="all">All Locations</option>
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="On-site">On-site</option>
                        </select>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 border-4 border-electric-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-400 font-mono">Loading internships...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="text-center py-12">
                        <div className="glass rounded-xl p-8 max-w-md mx-auto">
                            <p className="text-red-400 mb-4">{error}</p>
                            <button
                                onClick={fetchInternships}
                                className="px-6 py-3 bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 rounded-lg font-mono font-semibold text-white shadow-glow-md hover:shadow-glow-lg transition-all duration-300"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {/* Internship Listings */}
                {!isLoading && !error && (
                    <div className="space-y-4">
                        {filteredInternships.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="glass rounded-xl p-12">
                                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-electric-600/20 flex items-center justify-center">
                                        <span className="text-4xl">🔍</span>
                                    </div>
                                    <h3 className="text-2xl font-mono font-bold text-white mb-4">
                                        No internships found
                                    </h3>
                                    <p className="text-slate-400 mb-6">
                                        Try adjusting your search or filters
                                    </p>
                                </div>
                            </div>
                        ) : (
                            filteredInternships.map((internship) => (
                                <div
                                    key={internship.internshipID || internship.id}
                                    className="glass glass-hover rounded-xl p-6 glow-electric"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        {/* Left: Company & Position Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-electric-600 to-electric-700 flex items-center justify-center text-2xl font-bold text-white">
                                                    {internship.company?.[0] || 'C'}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-mono font-bold text-white">
                                                        {internship.title || internship.position || 'Software Engineering Intern'}
                                                    </h3>
                                                    <p className="text-slate-400">{internship.company || 'Company'}</p>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            {internship.description && (
                                                <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                                                    {internship.description}
                                                </p>
                                            )}

                                            {/* Details */}
                                            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                                {internship.location && (
                                                    <span className="flex items-center gap-1">
                                                        📍 {internship.location}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right: Apply Button */}
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => handleApply(internship.internshipID || internship.id || 0)}
                                                className="px-6 py-3 bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 rounded-lg font-mono font-semibold text-white shadow-glow-sm hover:shadow-glow-md transition-all duration-300 whitespace-nowrap"
                                            >
                                                {isAuthenticated ? 'Apply Now →' : 'Sign In to Apply'}
                                            </button>
                                            {internship.applyLink && (
                                                <a
                                                    href={internship.applyLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-6 py-2 glass glass-hover rounded-lg font-mono text-slate-300 hover:text-white transition-all whitespace-nowrap text-center"
                                                >
                                                    View Details
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Internships;
