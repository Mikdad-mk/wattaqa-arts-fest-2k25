'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Team, Candidate, Programme, Result } from '@/types';
import { PublicNavbar } from '@/components/Navigation/PublicNavbar';
import { PublicFooter } from '@/components/Navigation/PublicFooter';

interface TeamLeaderboard {
    team: Team;
    totalPoints: number;
    totalWins: number;
    winsByPosition: {
        first: number;
        second: number;
        third: number;
    };
    memberCount: number;
    rank: number;
}

interface IndividualLeaderboard {
    candidate: Candidate;
    team: Team;
    totalPoints: number;
    totalWins: number;
    winsByPosition: {
        first: number;
        second: number;
        third: number;
    };
    rank: number;
}

interface SectionLeaderboard {
    section: string;
    totalPoints: number;
    totalWins: number;
    teamCount: number;
    topTeam: string;
    rank: number;
}

interface ProgrammeResult {
    programme: Programme;
    result: Result;
    winners: {
        first: Array<{ type: 'individual' | 'team'; name: string; team?: string; chestNumber?: string }>;
        second: Array<{ type: 'individual' | 'team'; name: string; team?: string; chestNumber?: string }>;
        third: Array<{ type: 'individual' | 'team'; name: string; team?: string; chestNumber?: string }>;
    };
}

export default function ResultsPage() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [programmes, setProgrammes] = useState<Programme[]>([]);
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'individuals' | 'sections' | 'programmes'>('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [teamsRes, candidatesRes, programmesRes, resultsRes] = await Promise.all([
                fetch('/api/teams'),
                fetch('/api/candidates'),
                fetch('/api/programmes'),
                fetch('/api/results')
            ]);

            const [teamsData, candidatesData, programmesData, resultsData] = await Promise.all([
                teamsRes.json(),
                candidatesRes.json(),
                programmesRes.json(),
                resultsRes.json()
            ]);

            setTeams(teamsData || []);
            setCandidates(candidatesData || []);
            setProgrammes(programmesData || []);
            setResults(resultsData || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateTeamLeaderboard = (): TeamLeaderboard[] => {
        const teamStats: { [teamCode: string]: TeamLeaderboard } = {};

        // Initialize team stats
        teams.forEach(team => {
            const teamCandidates = candidates.filter(c => c.team === team.code);
            teamStats[team.code] = {
                team,
                totalPoints: 0,
                totalWins: 0,
                winsByPosition: { first: 0, second: 0, third: 0 },
                memberCount: teamCandidates.length,
                rank: 0
            };
        });

        // Calculate points from results
        results.forEach(result => {
            // Individual results
            [
                { place: result.firstPlace, points: 5, position: 'first' as const },
                { place: result.secondPlace, points: 3, position: 'second' as const },
                { place: result.thirdPlace, points: 1, position: 'third' as const }
            ].forEach(({ place, points, position }) => {
                (place || []).forEach(participant => {
                    const candidate = candidates.find(c => c.chestNumber === participant.chestNumber);
                    if (candidate && teamStats[candidate.team]) {
                        teamStats[candidate.team].totalPoints += points;
                        teamStats[candidate.team].totalWins += 1;
                        teamStats[candidate.team].winsByPosition[position] += 1;
                    }
                });
            });

            // Team results
            [
                { teams: result.firstPlaceTeams, points: 5, position: 'first' as const },
                { teams: result.secondPlaceTeams, points: 3, position: 'second' as const },
                { teams: result.thirdPlaceTeams, points: 1, position: 'third' as const }
            ].forEach(({ teams, points, position }) => {
                (teams || []).forEach(teamResult => {
                    if (teamStats[teamResult.teamCode]) {
                        teamStats[teamResult.teamCode].totalPoints += points;
                        teamStats[teamResult.teamCode].totalWins += 1;
                        teamStats[teamResult.teamCode].winsByPosition[position] += 1;
                    }
                });
            });
        });

        // Sort and assign ranks
        const sortedTeams = Object.values(teamStats)
            .sort((a, b) => b.totalPoints - a.totalPoints || b.totalWins - a.totalWins)
            .map((team, index) => ({ ...team, rank: index + 1 }));

        return sortedTeams;
    };

    const calculateIndividualLeaderboard = (): IndividualLeaderboard[] => {
        const individualStats: { [chestNumber: string]: IndividualLeaderboard } = {};

        // Initialize individual stats
        candidates.forEach(candidate => {
            const team = teams.find(t => t.code === candidate.team);
            if (team) {
                individualStats[candidate.chestNumber] = {
                    candidate,
                    team,
                    totalPoints: 0,
                    totalWins: 0,
                    winsByPosition: { first: 0, second: 0, third: 0 },
                    rank: 0
                };
            }
        });

        // Calculate points from results
        results.forEach(result => {
            [
                { place: result.firstPlace, points: 5, position: 'first' as const },
                { place: result.secondPlace, points: 3, position: 'second' as const },
                { place: result.thirdPlace, points: 1, position: 'third' as const }
            ].forEach(({ place, points, position }) => {
                (place || []).forEach(participant => {
                    if (individualStats[participant.chestNumber]) {
                        individualStats[participant.chestNumber].totalPoints += points;
                        individualStats[participant.chestNumber].totalWins += 1;
                        individualStats[participant.chestNumber].winsByPosition[position] += 1;
                    }
                });
            });
        });

        // Sort and assign ranks
        const sortedIndividuals = Object.values(individualStats)
            .filter(individual => individual.totalPoints > 0)
            .sort((a, b) => b.totalPoints - a.totalPoints || b.totalWins - a.totalWins)
            .map((individual, index) => ({ ...individual, rank: index + 1 }));

        return sortedIndividuals;
    };

    const calculateSectionLeaderboard = (): SectionLeaderboard[] => {
        const sectionStats: { [section: string]: SectionLeaderboard } = {};
        const teamLeaderboard = calculateTeamLeaderboard();

        // Group teams by section (assuming section is part of team code or name)
        teams.forEach(team => {
            // Extract section from team code (e.g., "CS-A" -> "CS", "EEE-B" -> "EEE")
            const section = team.code.split('-')[0] || 'Other';

            if (!sectionStats[section]) {
                sectionStats[section] = {
                    section,
                    totalPoints: 0,
                    totalWins: 0,
                    teamCount: 0,
                    topTeam: '',
                    rank: 0
                };
            }

            const teamStats = teamLeaderboard.find(t => t.team.code === team.code);
            if (teamStats) {
                sectionStats[section].totalPoints += teamStats.totalPoints;
                sectionStats[section].totalWins += teamStats.totalWins;
                sectionStats[section].teamCount += 1;

                // Update top team if this team has more points
                const currentTopTeam = teamLeaderboard.find(t => t.team.name === sectionStats[section].topTeam);
                if (!currentTopTeam || teamStats.totalPoints > currentTopTeam.totalPoints) {
                    sectionStats[section].topTeam = team.name;
                }
            }
        });

        // Sort and assign ranks
        const sortedSections = Object.values(sectionStats)
            .sort((a, b) => b.totalPoints - a.totalPoints || b.totalWins - a.totalWins)
            .map((section, index) => ({ ...section, rank: index + 1 }));

        return sortedSections;
    };

    const getProgrammeResults = (): ProgrammeResult[] => {
        return results.map(result => {
            // Handle both programmeId and programme field names for backward compatibility
            const programmeId = result.programmeId || result.programme;
            const programme = programmes.find(p => p._id === programmeId || p.id === programmeId || p._id?.toString() === programmeId);
            if (!programme) return null;

            const winners = {
                first: [
                    ...(result.firstPlace || []).map(p => {
                        const candidate = candidates.find(c => c.chestNumber === p.chestNumber);
                        const team = teams.find(t => t.code === candidate?.team);
                        return {
                            type: 'individual' as const,
                            name: candidate?.name || 'Unknown',
                            team: team?.name,
                            chestNumber: p.chestNumber
                        };
                    }),
                    ...(result.firstPlaceTeams || []).map(t => {
                        const team = teams.find(team => team.code === t.teamCode);
                        return {
                            type: 'team' as const,
                            name: team?.name || t.teamCode,
                            team: team?.name
                        };
                    })
                ],
                second: [
                    ...(result.secondPlace || []).map(p => {
                        const candidate = candidates.find(c => c.chestNumber === p.chestNumber);
                        const team = teams.find(t => t.code === candidate?.team);
                        return {
                            type: 'individual' as const,
                            name: candidate?.name || 'Unknown',
                            team: team?.name,
                            chestNumber: p.chestNumber
                        };
                    }),
                    ...(result.secondPlaceTeams || []).map(t => {
                        const team = teams.find(team => team.code === t.teamCode);
                        return {
                            type: 'team' as const,
                            name: team?.name || t.teamCode,
                            team: team?.name
                        };
                    })
                ],
                third: [
                    ...(result.thirdPlace || []).map(p => {
                        const candidate = candidates.find(c => c.chestNumber === p.chestNumber);
                        const team = teams.find(t => t.code === candidate?.team);
                        return {
                            type: 'individual' as const,
                            name: candidate?.name || 'Unknown',
                            team: team?.name,
                            chestNumber: p.chestNumber
                        };
                    }),
                    ...(result.thirdPlaceTeams || []).map(t => {
                        const team = teams.find(team => team.code === t.teamCode);
                        return {
                            type: 'team' as const,
                            name: team?.name || t.teamCode,
                            team: team?.name
                        };
                    })
                ]
            };

            return { programme, result, winners };
        }).filter(Boolean) as ProgrammeResult[];
    };

    const getRankBadge = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    const getRankColor = (rank: number) => {
        if (rank === 1) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        if (rank === 2) return 'bg-gray-100 text-gray-800 border-gray-200';
        if (rank === 3) return 'bg-orange-100 text-orange-800 border-orange-200';
        return 'bg-purple-100 text-purple-800 border-purple-200';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
                <PublicNavbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                        <p className="text-gray-600">Loading results and rankings...</p>
                    </div>
                </div>
                <PublicFooter />
            </div>
        );
    }

    const teamLeaderboard = calculateTeamLeaderboard();
    const individualLeaderboard = calculateIndividualLeaderboard();
    const sectionLeaderboard = calculateSectionLeaderboard();
    const programmeResults = getProgrammeResults();
    const categories = [...new Set(programmes.map(p => p.category))].filter(Boolean);

    const filteredProgrammeResults = programmeResults.filter(pr => {
        if (!pr || !pr.programme) return false;
        const matchesSearch = pr.programme.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || pr.programme.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Check if we have any data to display
    const hasData = teams.length > 0 || candidates.length > 0 || programmes.length > 0 || results.length > 0;

    // Show empty state if no data
    if (!hasData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
                <PublicNavbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📊</div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">No Results Available</h1>
                        <p className="text-gray-600 mb-6">
                            Results and rankings will appear here once competitions begin and data is available.
                        </p>
                        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
                            <h3 className="font-semibold mb-2">What you'll see here:</h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Team rankings and leaderboards</li>
                                <li>• Individual performance statistics</li>
                                <li>• Section-wise comparisons</li>
                                <li>• Detailed programme results</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <PublicFooter />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
            <PublicNavbar />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">🏆 Results & Leaderboards</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Complete results, rankings, and performance analytics for all teams and participants
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <p className="text-3xl font-bold text-purple-600">{teams.length}</p>
                        <p className="text-gray-600">Teams</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <p className="text-3xl font-bold text-green-600">{candidates.length}</p>
                        <p className="text-gray-600">Participants</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <p className="text-3xl font-bold text-blue-600">{programmes.length}</p>
                        <p className="text-gray-600">Programmes</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <p className="text-3xl font-bold text-orange-600">{results.length}</p>
                        <p className="text-gray-600">Results</p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-lg shadow-md mb-8">
                    <div className="flex flex-wrap border-b">
                        {[
                            { key: 'overview', label: '📊 Overview', icon: '📊' },
                            { key: 'teams', label: '🏆 Team Rankings', icon: '🏆' },
                            { key: 'individuals', label: '👤 Individual Rankings', icon: '👤' },
                            { key: 'sections', label: '🏛️ Section Rankings', icon: '🏛️' },
                            { key: 'programmes', label: '🎭 Programme Results', icon: '🎭' }
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as any)}
                                className={`px-4 py-4 font-medium text-sm md:text-base ${activeTab === tab.key
                                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="hidden md:inline">{tab.label}</span>
                                <span className="md:hidden">{tab.icon}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Top 3 Teams */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">🏆 Top 3 Teams</h2>
                            {teamLeaderboard.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {teamLeaderboard.slice(0, 3).map((team, index) => (
                                        <div key={team.team.code} className={`text-center p-6 rounded-lg border-2 ${index === 0 ? 'bg-yellow-50 border-yellow-200' :
                                            index === 1 ? 'bg-gray-50 border-gray-200' :
                                                'bg-orange-50 border-orange-200'
                                            }`}>
                                            <div className="text-4xl mb-3">
                                                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">{team.team.name}</h3>
                                            <p className="text-gray-600 mb-3">{team.team.code}</p>
                                            <div className="space-y-2">
                                                <p className="text-2xl font-bold text-purple-600">{team.totalPoints} pts</p>
                                                <p className="text-sm text-gray-600">{team.totalWins} wins • {team.memberCount} members</p>
                                            </div>
                                            <Link
                                                href={`/teams/${team.team.code}`}
                                                className="inline-block mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No team rankings available yet.</p>
                                </div>
                            )}
                        </div>

                        {/* Top Individual Performers */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">⭐ Top Individual Performers</h2>
                            {individualLeaderboard.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {individualLeaderboard.slice(0, 6).map((individual) => (
                                        <div key={individual.candidate.chestNumber} className="border rounded-lg p-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getRankColor(individual.rank)}`}>
                                                    {getRankBadge(individual.rank)}
                                                </span>
                                                <div className="flex-1">
                                                    <p className="font-semibold">{individual.candidate.name}</p>
                                                    <p className="text-sm text-gray-600">#{individual.candidate.chestNumber}</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-purple-600 font-bold">{individual.totalPoints} pts</span>
                                                <span className="text-sm text-gray-600">{individual.team.name}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No individual rankings available yet.</p>
                                </div>
                            )}
                        </div>

                        {/* Section Overview */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">🏛️ Section Performance</h2>
                            {sectionLeaderboard.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {sectionLeaderboard.slice(0, 6).map((section) => (
                                        <div key={section.section} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-lg font-bold">{section.section}</h3>
                                                <span className={`px-2 py-1 rounded-full text-sm font-bold border ${getRankColor(section.rank)}`}>
                                                    {getRankBadge(section.rank)}
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-purple-600 font-bold">{section.totalPoints} points</p>
                                                <p className="text-sm text-gray-600">{section.teamCount} teams • {section.totalWins} wins</p>
                                                <p className="text-sm text-green-600">Top: {section.topTeam}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No section performance data available yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'teams' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">🏆 Team Leaderboard</h2>
                            <div className="text-sm text-gray-600">
                                Ranked by total points • {teamLeaderboard.length} teams
                            </div>
                        </div>

                        <div className="space-y-4">
                            {teamLeaderboard.map((team) => (
                                <div key={team.team.code} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-2 rounded-full font-bold border ${getRankColor(team.rank)}`}>
                                                {getRankBadge(team.rank)}
                                            </span>
                                            <div>
                                                <h3 className="text-lg font-bold">{team.team.name}</h3>
                                                <p className="text-gray-600">{team.team.code} • {team.memberCount} members</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-purple-600">{team.totalPoints}</p>
                                                <p className="text-sm text-gray-600">Points</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xl font-bold text-green-600">{team.totalWins}</p>
                                                <p className="text-sm text-gray-600">Wins</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                                                    🥇 {team.winsByPosition.first}
                                                </span>
                                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                                                    🥈 {team.winsByPosition.second}
                                                </span>
                                                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                                                    🥉 {team.winsByPosition.third}
                                                </span>
                                            </div>
                                            <Link
                                                href={`/teams/${team.team.code}`}
                                                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'individuals' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">👤 Individual Leaderboard</h2>
                            <div className="text-sm text-gray-600">
                                Top performers • {individualLeaderboard.length} winners
                            </div>
                        </div>

                        <div className="space-y-4">
                            {individualLeaderboard.map((individual) => (
                                <div key={individual.candidate.chestNumber} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-2 rounded-full font-bold border ${getRankColor(individual.rank)}`}>
                                                {getRankBadge(individual.rank)}
                                            </span>
                                            <div>
                                                <h3 className="text-lg font-bold">{individual.candidate.name}</h3>
                                                <p className="text-gray-600">#{individual.candidate.chestNumber} • {individual.team.name}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-purple-600">{individual.totalPoints}</p>
                                                <p className="text-sm text-gray-600">Points</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xl font-bold text-green-600">{individual.totalWins}</p>
                                                <p className="text-sm text-gray-600">Wins</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                                                    🥇 {individual.winsByPosition.first}
                                                </span>
                                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                                                    🥈 {individual.winsByPosition.second}
                                                </span>
                                                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                                                    🥉 {individual.winsByPosition.third}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'sections' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">🏛️ Section Leaderboard</h2>
                            <div className="text-sm text-gray-600">
                                Department-wise performance • {sectionLeaderboard.length} sections
                            </div>
                        </div>

                        <div className="space-y-4">
                            {sectionLeaderboard.map((section) => (
                                <div key={section.section} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-2 rounded-full font-bold border ${getRankColor(section.rank)}`}>
                                                {getRankBadge(section.rank)}
                                            </span>
                                            <div>
                                                <h3 className="text-xl font-bold">{section.section}</h3>
                                                <p className="text-gray-600">{section.teamCount} teams participating</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-purple-600">{section.totalPoints}</p>
                                                <p className="text-sm text-gray-600">Total Points</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xl font-bold text-green-600">{section.totalWins}</p>
                                                <p className="text-sm text-gray-600">Total Wins</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-blue-600">Top Team:</p>
                                                <p className="text-sm text-gray-600">{section.topTeam}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'programmes' && (
                    <div className="space-y-6">
                        {/* Search and Filter */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search programmes..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map((category, idx) => (
                                        <option key={`category-${idx}-${category}`} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Programme Results */}
                        <div className="space-y-6">
                            {filteredProgrammeResults.length === 0 ? (
                                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                    <div className="text-6xl mb-4">🎭</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Programme Results Found</h3>
                                    <p className="text-gray-600">
                                        {searchTerm || selectedCategory !== 'all'
                                            ? 'Try adjusting your search or filter criteria.'
                                            : 'Programme results will appear here once competitions are completed.'}
                                    </p>
                                </div>
                            ) : (
                                filteredProgrammeResults.map((pr) => (
                                    <div key={pr.result._id?.toString() || pr.result.id || Math.random().toString()} className="bg-white rounded-lg shadow-md p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">{pr.programme.name}</h3>
                                                <p className="text-gray-600">{pr.programme.category} • {pr.programme.type || pr.programme.positionType}</p>
                                            </div>
                                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                                                {pr.programme.category}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {/* First Place */}
                                            {pr.winners.first.length > 0 && (
                                                <div>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="text-2xl">🥇</span>
                                                        <h4 className="font-bold text-yellow-600">First Place</h4>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {pr.winners.first.map((winner, idx) => (
                                                            <div key={`first-${pr.result._id?.toString() || pr.result.id}-${idx}-${winner.chestNumber || winner.name}`} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                                                <p className="font-semibold">{winner.name}</p>
                                                                {winner.type === 'individual' && (
                                                                    <p className="text-sm text-gray-600">
                                                                        #{winner.chestNumber} • {winner.team}
                                                                    </p>
                                                                )}
                                                                {winner.type === 'team' && (
                                                                    <p className="text-sm text-gray-600">Team Event</p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Second Place */}
                                            {pr.winners.second.length > 0 && (
                                                <div>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="text-2xl">🥈</span>
                                                        <h4 className="font-bold text-gray-600">Second Place</h4>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {pr.winners.second.map((winner, idx) => (
                                                            <div key={`second-${pr.result._id?.toString() || pr.result.id}-${idx}-${winner.chestNumber || winner.name}`} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                                                <p className="font-semibold">{winner.name}</p>
                                                                {winner.type === 'individual' && (
                                                                    <p className="text-sm text-gray-600">
                                                                        #{winner.chestNumber} • {winner.team}
                                                                    </p>
                                                                )}
                                                                {winner.type === 'team' && (
                                                                    <p className="text-sm text-gray-600">Team Event</p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Third Place */}
                                            {pr.winners.third.length > 0 && (
                                                <div>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="text-2xl">🥉</span>
                                                        <h4 className="font-bold text-orange-600">Third Place</h4>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {pr.winners.third.map((winner, idx) => (
                                                            <div key={`third-${pr.result._id?.toString() || pr.result.id}-${idx}-${winner.chestNumber || winner.name}`} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                                                <p className="font-semibold">{winner.name}</p>
                                                                {winner.type === 'individual' && (
                                                                    <p className="text-sm text-gray-600">
                                                                        #{winner.chestNumber} • {winner.team}
                                                                    </p>
                                                                )}
                                                                {winner.type === 'team' && (
                                                                    <p className="text-sm text-gray-600">Team Event</p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            <PublicFooter />
        </div>
    );
}