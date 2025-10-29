'use client';

import { useState, useEffect } from 'react';
import { Team, Candidate, Programme, Result } from '@/types';
import { PublicNavbar } from '@/components/Navigation/PublicNavbar';
import { PublicFooter } from '@/components/Navigation/PublicFooter';
import { LeaderboardChart, ProgressChart, MedalChart } from '@/components/Charts';
import { SimpleBarChart } from '@/components/Charts/SimpleBarChart';
import { SimpleMedalChart } from '@/components/Charts/SimpleMedalChart';

interface TeamStats {
    team: Team;
    totalPoints: number;
    totalWins: number;
    medals: {
        gold: number;
        silver: number;
        bronze: number;
    };
    memberCount: number;
    rank: number;
    progressData: { programme: string; points: number; date: string }[];
}

interface IndividualStats {
    candidate: Candidate;
    team: Team;
    totalPoints: number;
    totalWins: number;
    medals: {
        gold: number;
        silver: number;
        bronze: number;
    };
    rank: number;
    achievements: string[];
}

interface SectionStats {
    section: string;
    totalPoints: number;
    teamCount: number;
    topTeam: string;
    averagePoints: number;
    rank: number;
}

export default function LeaderboardPage() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [programmes, setProgrammes] = useState<Programme[]>([]);
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'individuals' | 'sections' | 'analytics'>('overview');
    const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
    const [individualStats, setIndividualStats] = useState<IndividualStats[]>([]);
    const [sectionStats, setSectionStats] = useState<SectionStats[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
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

    useEffect(() => {
        if (teams.length > 0 && results.length > 0 && candidates.length > 0) {
            calculateStats();
        }
    }, [teams, results, candidates, programmes]);

    const calculateStats = () => {
        // Initialize team stats
        const teamStatsMap: { [teamCode: string]: TeamStats } = {};
        
        teams.forEach(team => {
            const teamCandidates = candidates.filter(c => c.team === team.code);
            teamStatsMap[team.code] = {
                team,
                totalPoints: 0,
                totalWins: 0,
                medals: { gold: 0, silver: 0, bronze: 0 },
                memberCount: teamCandidates.length,
                rank: 0,
                progressData: []
            };
        });

        // Calculate points from results
        results.forEach(result => {
            const programme = programmes.find(p => p._id === result.programmeId || p.id === result.programmeId);
            const programmeName = programme?.name || 'Unknown Programme';
            const resultDate = result.createdAt ? new Date(result.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

            // Process individual results
            [
                { place: result.firstPlace, points: result.firstPoints, medal: 'gold' as const },
                { place: result.secondPlace, points: result.secondPoints, medal: 'silver' as const },
                { place: result.thirdPlace, points: result.thirdPoints, medal: 'bronze' as const }
            ].forEach(({ place, points, medal }) => {
                (place || []).forEach(participant => {
                    const candidate = candidates.find(c => c.chestNumber === participant.chestNumber);
                    if (candidate && teamStatsMap[candidate.team]) {
                        teamStatsMap[candidate.team].totalPoints += points;
                        teamStatsMap[candidate.team].totalWins += 1;
                        teamStatsMap[candidate.team].medals[medal] += 1;
                        teamStatsMap[candidate.team].progressData.push({
                            programme: programmeName,
                            points: points,
                            date: resultDate
                        });
                    }
                });
            });

            // Process team results
            [
                { teams: result.firstPlaceTeams, points: result.firstPoints, medal: 'gold' as const },
                { teams: result.secondPlaceTeams, points: result.secondPoints, medal: 'silver' as const },
                { teams: result.thirdPlaceTeams, points: result.thirdPoints, medal: 'bronze' as const }
            ].forEach(({ teams, points, medal }) => {
                (teams || []).forEach(teamResult => {
                    if (teamStatsMap[teamResult.teamCode]) {
                        teamStatsMap[teamResult.teamCode].totalPoints += points;
                        teamStatsMap[teamResult.teamCode].totalWins += 1;
                        teamStatsMap[teamResult.teamCode].medals[medal] += 1;
                        teamStatsMap[teamResult.teamCode].progressData.push({
                            programme: programmeName,
                            points: points,
                            date: resultDate
                        });
                    }
                });
            });
        });

        // Sort and assign ranks
        const sortedTeamStats = Object.values(teamStatsMap)
            .sort((a, b) => b.totalPoints - a.totalPoints || b.totalWins - a.totalWins)
            .map((team, index) => ({ ...team, rank: index + 1 }));

        setTeamStats(sortedTeamStats);

        // Calculate individual stats
        const individualStatsMap: { [chestNumber: string]: IndividualStats } = {};
        
        candidates.forEach(candidate => {
            const team = teams.find(t => t.code === candidate.team);
            if (team) {
                individualStatsMap[candidate.chestNumber] = {
                    candidate,
                    team,
                    totalPoints: 0,
                    totalWins: 0,
                    medals: { gold: 0, silver: 0, bronze: 0 },
                    rank: 0,
                    achievements: []
                };
            }
        });

        results.forEach(result => {
            const programme = programmes.find(p => p._id === result.programmeId || p.id === result.programmeId);
            const programmeName = programme?.name || 'Unknown Programme';

            [
                { place: result.firstPlace, points: result.firstPoints, medal: 'gold' as const, emoji: '🥇' },
                { place: result.secondPlace, points: result.secondPoints, medal: 'silver' as const, emoji: '🥈' },
                { place: result.thirdPlace, points: result.thirdPoints, medal: 'bronze' as const, emoji: '🥉' }
            ].forEach(({ place, points, medal, emoji }) => {
                (place || []).forEach(participant => {
                    if (individualStatsMap[participant.chestNumber]) {
                        individualStatsMap[participant.chestNumber].totalPoints += points;
                        individualStatsMap[participant.chestNumber].totalWins += 1;
                        individualStatsMap[participant.chestNumber].medals[medal] += 1;
                        individualStatsMap[participant.chestNumber].achievements.push(`${emoji} ${programmeName}`);
                    }
                });
            });
        });

        const sortedIndividualStats = Object.values(individualStatsMap)
            .filter(individual => individual.totalPoints > 0)
            .sort((a, b) => b.totalPoints - a.totalPoints || b.totalWins - a.totalWins)
            .map((individual, index) => ({ ...individual, rank: index + 1 }));

        setIndividualStats(sortedIndividualStats);

        // Calculate section stats
        const sectionStatsMap: { [section: string]: SectionStats } = {};
        
        teams.forEach(team => {
            const section = team.code.split('-')[0] || 'Other';
            if (!sectionStatsMap[section]) {
                sectionStatsMap[section] = {
                    section,
                    totalPoints: 0,
                    teamCount: 0,
                    topTeam: '',
                    averagePoints: 0,
                    rank: 0
                };
            }

            const teamStat = sortedTeamStats.find(t => t.team.code === team.code);
            if (teamStat) {
                sectionStatsMap[section].totalPoints += teamStat.totalPoints;
                sectionStatsMap[section].teamCount += 1;

                if (!sectionStatsMap[section].topTeam || teamStat.totalPoints > 
                    (sortedTeamStats.find(t => t.team.name === sectionStatsMap[section].topTeam)?.totalPoints || 0)) {
                    sectionStatsMap[section].topTeam = team.name;
                }
            }
        });

        Object.values(sectionStatsMap).forEach(section => {
            section.averagePoints = section.teamCount > 0 ? section.totalPoints / section.teamCount : 0;
        });

        const sortedSectionStats = Object.values(sectionStatsMap)
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .map((section, index) => ({ ...section, rank: index + 1 }));

        setSectionStats(sortedSectionStats);
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

    const filteredTeamStats = teamStats.filter(team => {
        const matchesSearch = team.team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             team.team.code.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const filteredIndividualStats = individualStats.filter(individual => {
        const matchesSearch = individual.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             individual.team.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    if (!isClient || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
                <PublicNavbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                        <p className="text-gray-600">Loading leaderboard data...</p>
                    </div>
                </div>
                <PublicFooter />
            </div>
        );
    }

    const hasData = teams.length > 0 && results.length > 0;

    if (!hasData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
                <PublicNavbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📊</div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Leaderboard Coming Soon</h1>
                        <p className="text-gray-600 mb-6">
                            The interactive leaderboard will be available once competitions begin and results are recorded.
                        </p>
                        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
                            <h3 className="font-semibold mb-2">What you'll see here:</h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Interactive team progress charts</li>
                                <li>• Real-time ranking updates</li>
                                <li>• Medal distribution graphs</li>
                                <li>• Individual performance analytics</li>
                                <li>• Section-wise comparisons</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <PublicFooter />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100" suppressHydrationWarning>
            <PublicNavbar />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">🏆 Interactive Leaderboard</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Real-time rankings, progress tracking, and comprehensive performance analytics
                    </p>
                </div>

                {/* Quick Stats Dashboard */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-transform">
                        <div className="text-3xl mb-2">🏆</div>
                        <p className="text-3xl font-bold text-purple-600">{teamStats.length}</p>
                        <p className="text-gray-600">Teams Competing</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-transform">
                        <div className="text-3xl mb-2">👥</div>
                        <p className="text-3xl font-bold text-green-600">{candidates.length}</p>
                        <p className="text-gray-600">Total Participants</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-transform">
                        <div className="text-3xl mb-2">🎭</div>
                        <p className="text-3xl font-bold text-blue-600">{programmes.length}</p>
                        <p className="text-gray-600">Total Events</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-transform">
                        <div className="text-3xl mb-2">📊</div>
                        <p className="text-3xl font-bold text-orange-600">{results.length}</p>
                        <p className="text-gray-600">Results Published</p>
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
                            { key: 'analytics', label: '📈 Analytics', icon: '📈' }
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as any)}
                                className={`px-4 py-4 font-medium text-sm md:text-base transition-colors ${activeTab === tab.key
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

                {/* Search and Filter */}
                {(activeTab === 'teams' || activeTab === 'individuals') && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder={`Search ${activeTab}...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Championship Podium */}
                        <div className="bg-white rounded-lg shadow-md p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">🏆 Championship Podium</h2>
                            {teamStats.length >= 3 ? (
                                <div className="flex items-end justify-center gap-8 mb-8">
                                    {/* Second Place */}
                                    <div className="text-center">
                                        <div className="bg-gradient-to-t from-gray-400 to-gray-300 rounded-lg p-6 h-32 flex items-end justify-center mb-4 shadow-lg">
                                            <div className="text-center">
                                                <div className="text-4xl mb-2">🥈</div>
                                                <div className="text-white font-bold text-lg">{teamStats[1]?.totalPoints}</div>
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-lg">{teamStats[1]?.team.name}</h3>
                                        <p className="text-gray-600">{teamStats[1]?.team.code}</p>
                                        <div className="mt-2 flex justify-center gap-1">
                                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">🥇 {teamStats[1]?.medals.gold}</span>
                                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">🥈 {teamStats[1]?.medals.silver}</span>
                                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">🥉 {teamStats[1]?.medals.bronze}</span>
                                        </div>
                                    </div>
                                    
                                    {/* First Place */}
                                    <div className="text-center">
                                        <div className="bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-lg p-6 h-40 flex items-end justify-center mb-4 shadow-lg animate-pulse">
                                            <div className="text-center">
                                                <div className="text-5xl mb-2">🥇</div>
                                                <div className="text-white font-bold text-xl">{teamStats[0]?.totalPoints}</div>
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-xl text-yellow-600">{teamStats[0]?.team.name}</h3>
                                        <p className="text-gray-600">{teamStats[0]?.team.code}</p>
                                        <div className="mt-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                                            🏆 Festival Champion
                                        </div>
                                        <div className="mt-2 flex justify-center gap-1">
                                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">🥇 {teamStats[0]?.medals.gold}</span>
                                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">🥈 {teamStats[0]?.medals.silver}</span>
                                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">🥉 {teamStats[0]?.medals.bronze}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Third Place */}
                                    <div className="text-center">
                                        <div className="bg-gradient-to-t from-orange-500 to-orange-400 rounded-lg p-6 h-24 flex items-end justify-center mb-4 shadow-lg">
                                            <div className="text-center">
                                                <div className="text-4xl mb-2">🥉</div>
                                                <div className="text-white font-bold">{teamStats[2]?.totalPoints}</div>
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-lg">{teamStats[2]?.team.name}</h3>
                                        <p className="text-gray-600">{teamStats[2]?.team.code}</p>
                                        <div className="mt-2 flex justify-center gap-1">
                                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">🥇 {teamStats[2]?.medals.gold}</span>
                                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">🥈 {teamStats[2]?.medals.silver}</span>
                                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">🥉 {teamStats[2]?.medals.bronze}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🏆</div>
                                    <p className="text-gray-500">Championship podium will be revealed as results come in...</p>
                                </div>
                            )}
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Team Progress Chart */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">📈 Top Teams Progress</h3>
                                {isClient ? (
                                    <LeaderboardChart data={teamStats.slice(0, 5)} />
                                ) : (
                                    <SimpleBarChart data={teamStats.slice(0, 5)} title="Team Rankings" />
                                )}
                            </div>

                            {/* Medal Distribution */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">🏅 Medal Distribution</h3>
                                {isClient ? (
                                    <MedalChart data={teamStats.slice(0, 8)} />
                                ) : (
                                    <SimpleMedalChart data={teamStats.slice(0, 8)} title="Medal Distribution" />
                                )}
                            </div>
                        </div>

                        {/* Top Individual Performers */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">⭐ Star Performers</h2>
                            {individualStats.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {individualStats.slice(0, 6).map((individual, index) => (
                                        <div key={individual.candidate.chestNumber} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getRankColor(individual.rank)}`}>
                                                    {getRankBadge(individual.rank)}
                                                </span>
                                                <div className="flex-1">
                                                    <p className="font-semibold">{individual.candidate.name}</p>
                                                    <p className="text-sm text-gray-600">#{individual.candidate.chestNumber}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-purple-600 font-bold">{individual.totalPoints} pts</span>
                                                    <span className="text-sm text-gray-600">{individual.team.name}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">🥇 {individual.medals.gold}</span>
                                                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">🥈 {individual.medals.silver}</span>
                                                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">🥉 {individual.medals.bronze}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Individual performers will be showcased here...</p>
                                </div>
                            )}
                        </div>

                        {/* Section Performance */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">🏛️ Section Performance</h2>
                            {sectionStats.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {sectionStats.map((section) => (
                                        <div key={section.section} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-lg font-bold">{section.section}</h3>
                                                <span className={`px-2 py-1 rounded-full text-sm font-bold border ${getRankColor(section.rank)}`}>
                                                    {getRankBadge(section.rank)}
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-purple-600 font-bold">{section.totalPoints} points</p>
                                                <p className="text-sm text-gray-600">{section.teamCount} teams</p>
                                                <p className="text-sm text-blue-600">Avg: {Math.round(section.averagePoints)} pts</p>
                                                <p className="text-sm text-green-600">Top: {section.topTeam}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Section performance data will be displayed here...</p>
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
                                {filteredTeamStats.length} teams • Updated in real-time
                            </div>
                        </div>

                        <div className="space-y-4">
                            {filteredTeamStats.map((team) => (
                                <div key={team.team.code} className="border rounded-lg p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className={`px-4 py-2 rounded-full font-bold border-2 ${getRankColor(team.rank)} text-lg`}>
                                                {getRankBadge(team.rank)}
                                            </span>
                                            <div>
                                                <h3 className="text-xl font-bold">{team.team.name}</h3>
                                                <p className="text-gray-600">{team.team.code} • {team.memberCount} members</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8">
                                            <div className="text-center">
                                                <p className="text-3xl font-bold text-purple-600">{team.totalPoints}</p>
                                                <p className="text-sm text-gray-600">Points</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xl font-bold text-green-600">{team.totalWins}</p>
                                                <p className="text-sm text-gray-600">Wins</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-yellow-600">{team.medals.gold}</div>
                                                    <div className="text-xs text-gray-500">🥇</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-gray-600">{team.medals.silver}</div>
                                                    <div className="text-xs text-gray-500">🥈</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-orange-600">{team.medals.bronze}</div>
                                                    <div className="text-xs text-gray-500">🥉</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Chart for Individual Team */}
                                    {team.progressData.length > 0 && (
                                        <div className="mt-6 pt-4 border-t">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Progress Timeline</h4>
                                            <ProgressChart data={team.progressData} teamColor={team.team.color} />
                                        </div>
                                    )}
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
                                {filteredIndividualStats.length} top performers
                            </div>
                        </div>

                        <div className="space-y-4">
                            {filteredIndividualStats.map((individual) => (
                                <div key={individual.candidate.chestNumber} className="border rounded-lg p-6 hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className={`px-4 py-2 rounded-full font-bold border-2 ${getRankColor(individual.rank)} text-lg`}>
                                                {getRankBadge(individual.rank)}
                                            </span>
                                            <div>
                                                <h3 className="text-xl font-bold">{individual.candidate.name}</h3>
                                                <p className="text-gray-600">#{individual.candidate.chestNumber} • {individual.team.name}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8">
                                            <div className="text-center">
                                                <p className="text-3xl font-bold text-purple-600">{individual.totalPoints}</p>
                                                <p className="text-sm text-gray-600">Points</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xl font-bold text-green-600">{individual.totalWins}</p>
                                                <p className="text-sm text-gray-600">Wins</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-yellow-600">{individual.medals.gold}</div>
                                                    <div className="text-xs text-gray-500">🥇</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-gray-600">{individual.medals.silver}</div>
                                                    <div className="text-xs text-gray-500">🥈</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-orange-600">{individual.medals.bronze}</div>
                                                    <div className="text-xs text-gray-500">🥉</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Achievements */}
                                    {individual.achievements.length > 0 && (
                                        <div className="mt-4 pt-4 border-t">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Achievements</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {individual.achievements.slice(0, 3).map((achievement, idx) => (
                                                    <span key={idx} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                                                        {achievement}
                                                    </span>
                                                ))}
                                                {individual.achievements.length > 3 && (
                                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                                                        +{individual.achievements.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
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
                                Department-wise performance comparison
                            </div>
                        </div>

                        <div className="space-y-6">
                            {sectionStats.map((section) => (
                                <div key={section.section} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <span className={`px-4 py-2 rounded-full font-bold border-2 ${getRankColor(section.rank)} text-lg`}>
                                                {getRankBadge(section.rank)}
                                            </span>
                                            <div>
                                                <h3 className="text-2xl font-bold">{section.section}</h3>
                                                <p className="text-gray-600">{section.teamCount} teams participating</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8">
                                            <div className="text-center">
                                                <p className="text-3xl font-bold text-purple-600">{section.totalPoints}</p>
                                                <p className="text-sm text-gray-600">Total Points</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xl font-bold text-blue-600">{Math.round(section.averagePoints)}</p>
                                                <p className="text-sm text-gray-600">Avg Points</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm text-gray-600">Leading Team</p>
                                                <p className="font-bold text-green-600">{section.topTeam}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">Performance Index</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                                                            style={{ width: `${Math.min((section.averagePoints / (teamStats[0]?.totalPoints || 1)) * 100, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-bold text-green-600">
                                                        {Math.round((section.averagePoints / (teamStats[0]?.totalPoints || 1)) * 100)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="space-y-8">
                        {/* Competition Progress */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Competition Analytics</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-blue-100">Competition Progress</p>
                                            <p className="text-3xl font-bold">{Math.round((results.length / programmes.length) * 100)}%</p>
                                        </div>
                                        <div className="text-4xl opacity-80">📈</div>
                                    </div>
                                    <div className="mt-4 bg-blue-400 rounded-full h-2">
                                        <div 
                                            className="bg-white h-2 rounded-full transition-all duration-1000"
                                            style={{ width: `${(results.length / programmes.length) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-green-100">Total Medals</p>
                                            <p className="text-3xl font-bold">
                                                {teamStats.reduce((sum, team) => sum + team.medals.gold + team.medals.silver + team.medals.bronze, 0)}
                                            </p>
                                        </div>
                                        <div className="text-4xl opacity-80">🏅</div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-purple-100">Avg Points/Team</p>
                                            <p className="text-3xl font-bold">
                                                {Math.round(teamStats.reduce((sum, team) => sum + team.totalPoints, 0) / teamStats.length || 0)}
                                            </p>
                                        </div>
                                        <div className="text-4xl opacity-80">⚡</div>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Charts */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Points Distribution</h3>
                                    {isClient ? (
                                        <LeaderboardChart data={teamStats} />
                                    ) : (
                                        <SimpleBarChart data={teamStats} title="Points Distribution" />
                                    )}
                                </div>

                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">🏅 Medal Analysis</h3>
                                    {isClient ? (
                                        <MedalChart data={teamStats} />
                                    ) : (
                                        <SimpleMedalChart data={teamStats} title="Medal Analysis" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Performance Insights */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">🔍 Performance Insights</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🏆 Top Performers</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                                            <span className="font-medium">Most Gold Medals</span>
                                            <span className="text-yellow-600 font-bold">
                                                {teamStats.reduce((max, team) => team.medals.gold > max.medals.gold ? team : max, teamStats[0] || { medals: { gold: 0 } })?.team?.name || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                                            <span className="font-medium">Highest Points</span>
                                            <span className="text-purple-600 font-bold">
                                                {teamStats[0]?.team?.name || 'N/A'} ({teamStats[0]?.totalPoints || 0} pts)
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                            <span className="font-medium">Most Wins</span>
                                            <span className="text-green-600 font-bold">
                                                {teamStats.reduce((max, team) => team.totalWins > max.totalWins ? team : max, teamStats[0] || { totalWins: 0 })?.team?.name || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Competition Stats</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                            <span className="font-medium">Events Completed</span>
                                            <span className="text-blue-600 font-bold">{results.length} / {programmes.length}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                                            <span className="font-medium">Active Participants</span>
                                            <span className="text-orange-600 font-bold">{individualStats.length}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                                            <span className="font-medium">Competing Sections</span>
                                            <span className="text-red-600 font-bold">{sectionStats.length}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <PublicFooter />
        </div>
    );
}