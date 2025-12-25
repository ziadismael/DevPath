import React, { useState, useEffect, useRef } from 'react';
import { internshipsAPI } from '../api/internships';
import { Internship } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Internships: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [locationSearchInput, setLocationSearchInput] = useState('');
    const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const locationButtonRef = useRef<HTMLDivElement>(null);
    const [internships, setInternships] = useState<Internship[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [displayCount, setDisplayCount] = useState(20);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Mock internships for preview mode
    const mockInternships: Internship[] = [
        {
            internshipID: 'mock-1',
            company: 'TechCorp',
            title: 'Software Engineering Intern',
            description: 'Join our team to work on cutting-edge web technologies. Great opportunity for students looking to gain real-world experience.',
            location: 'Remote',
            type: 'Remote',
        },
        {
            internshipID: 'mock-2',
            company: 'DataFlow Inc',
            title: 'Data Science Intern',
            description: 'Work with big data and machine learning models. Perfect for students passionate about AI and analytics.',
            location: 'New York, NY',
            type: 'Hybrid',
        },
        {
            internshipID: 'mock-3',
            company: 'CloudBase',
            title: 'DevOps Engineering Intern',
            description: 'Learn cloud infrastructure and CI/CD pipelines. Hands-on experience with AWS, Docker, and Kubernetes.',
            location: 'San Francisco, CA',
            type: 'On-site',
        },
    ];

    useEffect(() => {
        if (isAuthenticated) {
            fetchInternships();
        } else {
            setInternships(mockInternships);
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        // Set dynamic page title
        if (isAuthenticated) {
            document.title = 'Opportunities | DevPath';
        } else {
            document.title = 'DevPath | Empower Your Developer Journey';
        }
    }, [isAuthenticated]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            // Check if click is outside both the button container and the dropdown
            if (!target.closest('.location-dropdown-container') &&
                !target.closest('.location-dropdown-menu')) {
                setIsLocationDropdownOpen(false);
            }
        };

        if (isLocationDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isLocationDropdownOpen]);

    // Update dropdown position when opened
    useEffect(() => {
        if (isLocationDropdownOpen && locationButtonRef.current) {
            const rect = locationButtonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom, // Use viewport coordinates for fixed positioning
                left: rect.left,
                width: rect.width
            });
        }
    }, [isLocationDropdownOpen]);

    // Close dropdown on window scroll (not dropdown internal scroll)
    useEffect(() => {
        const handleScroll = (e: Event) => {
            const target = e.target;
            // Only close if scrolling the window/document, not the dropdown itself
            if (target === document || target === window ||
                (target instanceof HTMLElement && !target.closest('.location-dropdown-menu'))) {
                setIsLocationDropdownOpen(false);
            }
        };

        if (isLocationDropdownOpen) {
            window.addEventListener('scroll', handleScroll, true);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isLocationDropdownOpen]);

    const fetchInternships = async () => {
        try {
            setIsLoading(true);
            setError('');
            const response = await internshipsAPI.getInternships();
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

    const handleInternshipClick = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: '/internships' } } });
        }
    };

    const handleLoadMore = async () => {
        setIsLoadingMore(true);
        // Simulate loading delay for smooth UX
        await new Promise(resolve => setTimeout(resolve, 500));
        setDisplayCount(prev => prev + 20);
        setIsLoadingMore(false);
    };

    // Extract unique countries from internships (last part after comma)
    const extractCountry = (location: string): string => {
        const parts = location.split(',').map(p => p.trim());
        let country = parts[parts.length - 1]; // Get the last part (country)

        // Normalize country names
        const countryMap: { [key: string]: string } = {
            'US': 'USA',
            'United States': 'USA',
            'U.S.': 'USA',
            'U.S.A.': 'USA',
            'Egypt': 'Egypt',
            'Canada': 'Canada',
            'UK': 'United Kingdom',
            'U.K.': 'United Kingdom',
        };

        // US state codes to filter out
        const usStateCodes = [
            'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
            'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
            'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
            'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
            'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
        ];

        // If it's a US state code, look for USA in earlier parts or default to USA
        if (usStateCodes.includes(country)) {
            return 'USA';
        }

        // Apply normalization
        return countryMap[country] || country;
    };

    const availableLocations = Array.from(new Set(
        internships
            .map(i => i.location)
            .filter((loc): loc is string => !!loc)
            .map(extractCountry)
    )).sort();

    // Filter locations based on search input
    const filteredLocations = availableLocations.filter(loc =>
        loc.toLowerCase().includes(locationSearchInput.toLowerCase())
    );

    const filteredInternships = internships.filter((internship) => {
        // Search term filter (company, title, description)
        const matchesSearch = searchTerm === '' ||
            internship.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            internship.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            internship.description?.toLowerCase().includes(searchTerm.toLowerCase());

        // Location multiselect filter (match by country)
        const matchesLocation = selectedLocations.length === 0 ||
            (internship.location && selectedLocations.includes(extractCountry(internship.location)));

        return matchesSearch && matchesLocation;
    });

    // Limit displayed internships based on authentication
    const displayedInternships = isAuthenticated
        ? filteredInternships.slice(0, displayCount)
        : filteredInternships;

    const hasMore = isAuthenticated && displayCount < filteredInternships.length;

    return (
        <div className="min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-mono font-bold mb-4">
                        <span className="gradient-text">Find Your Next</span>
                        <br />
                        <span className="text-white">Opportunity</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Discover curated opportunities from top tech companies
                    </p>
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
                                    Sign in to see all internships and apply directly to opportunities
                                </p>
                            </div>
                        </div>
                    </div>
                )}

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

                        <div className="relative location-dropdown-container">
                            <div
                                ref={locationButtonRef}
                                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                                className="w-full px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-white cursor-pointer hover:border-electric-500 transition-all flex items-center justify-between"
                            >
                                <span className={selectedLocations.length === 0 ? 'text-slate-500' : 'text-white'}>
                                    {selectedLocations.length === 0
                                        ? 'Select countries...'
                                        : `${selectedLocations.length} countr${selectedLocations.length > 1 ? 'ies' : 'y'} selected`
                                    }
                                </span>
                                <span className="text-slate-400">▼</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location Dropdown - Rendered outside glass container */}
                {isLocationDropdownOpen && (
                    <div
                        className="location-dropdown-menu fixed z-[9999] bg-[rgb(15,23,42)] border border-white/10 rounded-lg shadow-2xl max-h-80 overflow-hidden"
                        style={{
                            top: `${dropdownPosition.top + 8}px`,
                            left: `${dropdownPosition.left}px`,
                            width: `${dropdownPosition.width}px`
                        }}
                    >
                        {/* Search Input */}
                        <div className="p-3 border-b border-white/10 bg-[rgb(15,23,42)]">
                            <input
                                type="text"
                                placeholder="Search countries..."
                                value={locationSearchInput}
                                onChange={(e) => setLocationSearchInput(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full px-3 py-2 bg-[rgb(30,41,59)] border border-white/10 rounded text-white placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
                            />
                        </div>

                        {/* Selected Items */}
                        {selectedLocations.length > 0 && (
                            <div className="p-3 border-b border-white/10 bg-[rgb(30,41,59)]/50">
                                <div className="flex flex-wrap gap-2">
                                    {selectedLocations.map(loc => (
                                        <span
                                            key={loc}
                                            className="px-2 py-1 bg-electric-600/20 text-electric-400 rounded text-xs flex items-center gap-1"
                                        >
                                            {loc}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedLocations(prev => prev.filter(l => l !== loc));
                                                }}
                                                className="hover:text-electric-300"
                                            >
                                                ✕
                                            </button>
                                        </span>
                                    ))}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedLocations([]);
                                        }}
                                        className="px-2 py-1 text-slate-400 hover:text-white text-xs"
                                    >
                                        Clear all
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Location List */}
                        <div className="max-h-60 overflow-y-auto bg-[rgb(15,23,42)]">
                            {filteredLocations.length === 0 ? (
                                <div className="p-4 text-center text-slate-500 text-sm">
                                    No countries found
                                </div>
                            ) : (
                                filteredLocations.map(location => (
                                    <div
                                        key={location}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedLocations(prev =>
                                                prev.includes(location)
                                                    ? prev.filter(l => l !== location)
                                                    : [...prev, location]
                                            );
                                            // Clear search input after selection
                                            setLocationSearchInput('');
                                        }}
                                        className="px-4 py-2 hover:bg-[rgb(30,41,59)] cursor-pointer flex items-center gap-3 text-sm transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedLocations.includes(location)}
                                            onChange={() => { }}
                                            className="w-4 h-4 rounded border-white/10 bg-[rgb(30,41,59)] text-electric-500 focus:ring-electric-500"
                                        />
                                        <span className="text-white">{location}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 border-4 border-electric-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-400 font-mono">Loading Opportunities...</p>
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
                        {displayedInternships.length === 0 ? (
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
                            <>
                                {displayedInternships.map((internship) => (
                                    <div
                                        key={internship.internshipID || internship.id}
                                        onClick={!isAuthenticated ? handleInternshipClick : undefined}
                                        className={`glass glass-hover rounded-xl p-6 glow-electric ${!isAuthenticated ? 'cursor-pointer' : ''}`}
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
                                                    {internship.type && (
                                                        <span className="px-2 py-1 bg-electric-600/20 text-electric-400 rounded text-xs">
                                                            {internship.type}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right: Apply Button */}
                                            <div className="flex flex-col gap-2">
                                                {internship.applyLink && isAuthenticated ? (
                                                    <a
                                                        href={internship.applyLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="px-6 py-3 bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 rounded-lg font-mono font-semibold text-white shadow-glow-sm hover:shadow-glow-md transition-all duration-300 whitespace-nowrap text-center"
                                                    >
                                                        Apply Now →
                                                    </a>
                                                ) : (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (!isAuthenticated) {
                                                                navigate('/login', { state: { from: { pathname: '/internships' } } });
                                                            }
                                                        }}
                                                        className="px-6 py-3 bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 rounded-lg font-mono font-semibold text-white shadow-glow-sm hover:shadow-glow-md transition-all duration-300 whitespace-nowrap"
                                                    >
                                                        Sign In to Apply
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Load More Button */}
                                {hasMore && (
                                    <div className="text-center pt-8">
                                        <button
                                            onClick={handleLoadMore}
                                            disabled={isLoadingMore}
                                            className="px-8 py-4 bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 rounded-lg font-mono font-semibold text-white shadow-glow-md hover:shadow-glow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoadingMore ? (
                                                <span className="flex items-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Loading...
                                                </span>
                                            ) : (
                                                `Load More (${filteredInternships.length - displayCount} remaining)`
                                            )}
                                        </button>
                                    </div>
                                )}

                                {/* Sign in prompt for unauthenticated users */}
                                {!isAuthenticated && (
                                    <div className="text-center pt-8">
                                        <div className="glass rounded-xl p-8 border border-electric-500/30">
                                            <h3 className="text-xl font-mono font-bold text-white mb-2">
                                                Want to see more opportunities?
                                            </h3>
                                            <p className="text-slate-400 mb-4">
                                                Sign in to access all internships and apply directly
                                            </p>
                                            <button
                                                onClick={() => navigate('/login', { state: { from: { pathname: '/internships' } } })}
                                                className="px-8 py-4 bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 rounded-lg font-mono font-semibold text-white shadow-glow-md hover:shadow-glow-lg transition-all duration-300"
                                            >
                                                Sign In to View All
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Internships;

