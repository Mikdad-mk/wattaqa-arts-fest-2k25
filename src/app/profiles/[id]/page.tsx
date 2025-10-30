"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Candidate, Team, ProgrammeParticipant, Result, Programme } from '@/types';

export default function ProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params.id as string;

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [participations, setParticipations] = useState<ProgrammeParticipant[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'participations' | 'results' | 'achievements'>('overview');

  useEffect(() => {
    if (candidateId) {
      fetchData();
    }
  }, [candidateId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [candidatesRes, teamsRes, participantsRes, resultsRes, programmesRes] = await Promise.all([
        fetch('/api/candidates'),
        fetch('/api/teams'),
        fetch('/api/programme-participants'),
        fetch('/api/results'),
        fetch('/api/programmes')
      ]);

      const [candidatesData, teamsData, participantsData, resultsData, programmesData] = await Promise.all([
        candidatesRes.json(),
        teamsRes.json(),
        participantsRes.json(),
        resultsRes.json(),
        programmesRes.json()
      ]);

      const foundCandidate = candidatesData.find((c: Candidate) => c._id?.toString() === candidateId);
      if (!foundCandidate) {
        router.push('/profiles');
        return;
      }

      setCandidate(foundCandidate);
      
      const candidateTeam = teamsData.find((t: Team) => t._id?.toString() === foundCandidate.teamId);
      setTeam(candidateTeam);

      const candidateParticipations = participantsData.filter((p: ProgrammeParticipant) =>
        p.participants.some(participant => participant.candidateId === candidateId)
      );
      setParticipations(candidateParticipations);

      const candidateResults = resultsData.filter((r: Result) =>
        r.participants?.some(p => p.name?.toLowerCase().includes(foundCandidate.name.toLowerCase()))
      );
      setResults(candidateResults);

      setProgrammes(programmesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTeamColor = (teamName?: string) => {
    switch (teamName?.toLowerCase()) {
      case 'team sumud': return 'from-green-500 to-emerald-600';
      case 'team aqsa': return 'from-gray-500 to-gray-600';
      case 'team inthifada': return 'from-red-500 to-rose-600';
      default: return 'from-blue-500 to-indigo-600';
    }
  };

  const getTeamBadgeColor = (teamName?: string) => {
    switch (teamName?.toLowerCase()) {
      case 'team sumud': return 'bg-green-100 text-green-800 border-green-200';
      case 'team aqsa': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'team inthifada': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getSectionColor = (section: string) => {
    switch (section?.toLowerCase()) {
      case 'senior': return 'bg-purple-100 text-purple-800';
      case 'junior': return 'bg-yellow-100 text-yellow-800';
      case 'sub-junior': return 'bg-pink-100 text-pink-800';
      case 'general': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgrammeName = (programmeId: string) => {
    const programme = programmes.find(p => p._id?.toString() === programmeId);
    return programme?.name || 'Unknown Programme';
  };

  const getProgrammeCategory = (programmeId: string) => {
    const programme = programmes.find(p => p._id?.toString() === programmeId);
    return programme?.category || 'general';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'arts': return '🎭';
      case 'sports': return '⚽';
      default: return '🏆';
    }
  };

  const getTotalPoints = () => {
    return results.reduce((total, result) => {
      const participant = result.participants?.find(p => 
        p.name?.toLowerCase().includes(candidate?.name.toLowerCase() || '')
      );
      return total + (participant?.points || 0);
    }, 0);
  };

  const getPositionStats = () => {
    const positions = results.map(result => {
      const participant = result.participants?.find(p => 
        p.name?.toLowerCase().includes(candidate?.name.toLowerCase() || '')
      );
      return participant?.position;
    }).filter(Boolean);

    const first = positions.filter(p => p === 1).length;
    const second = positions.filter(p => p === 2).length;
    const third = positions.filter(p => p === 3).length;

    return { first, second, third, total: positions.length };
  };

  const getPerformanceRating = () => {
    const totalPoints = getTotalPoints();
    const totalEvents = participations.length;
    if (totalEvents === 0) return 'No Data';
    
    const avgPoints = totalPoints / totalEvents;
    if (avgPoints >= 8) return 'Excellent';
    if (avgPoints >= 6) return 'Good';
    if (avgPoints >= 4) return 'Average';
    return 'Needs Improvement';
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Excellent': return 'text-green-600 bg-green-100';
      case 'Good': return 'text-blue-600 bg-blue-100';
      case 'Average': return 'text-yellow-600 bg-yellow-100';
      case 'Needs Improvement': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">👤</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">The requested profile could not be found.</p>
          <Link href="/profiles" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Back to Profiles
          </Link>
        </div>
      </div>
    );
  }

  const positionStats = getPositionStats();
  const totalPoints = getTotalPoints();
  const performanceRating = getPerformanceRating();

  return (
    <div className="min-h-screen bg-gray-50"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}>
      
      {/* Profile Header */}
      <div className={`bg-gradient-to-r ${getTeamColor(team?.name)} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <Link href="/profiles" className="text-white hover:text-gray-200 transition-colors">
              ← Back to Profiles
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-white text-3xl font-bold">
                {candidate.name.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{candidate.name}</h1>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border bg-white ${getTeamBadgeColor(team?.name).replace('bg-', 'text-').replace('text-', 'text-')}`}>
                  {team?.name || 'Unknown Team'}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSectionColor(candidate.section)}`}>
                  {candidate.section}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white">
                  #{candidate.chestNumber}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
                <div className="text-center">
                  <div className="text-2xl font-bold">{participations.length}</div>
                  <div className="text-sm opacity-90">Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{totalPoints}</div>
                  <div className="text-sm opacity-90">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{positionStats.first}</div>
                  <div className="text-sm opacity-90">Gold Medals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{results.length}</div>
                  <div className="text-sm opacity-90">Results</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="flex flex-wrap border-b">
            {[
              { key: 'overview', label: '📊 Overview', icon: '📊' },
              { key: 'participations', label: '🎭 Participations', icon: '🎭' },
              { key: 'results', label: '🏆 Results', icon: '🏆' },
              { key: 'achievements', label: '🌟 Achievements', icon: '🌟' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-4 font-medium text-sm md:text-base transition-colors duration-200 ${
                  activeTab === tab.key
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.icon}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Performance Rating</h3>
                  <span className="text-2xl">📈</span>
                </div>
                <div className={`text-2xl font-bold px-3 py-1 rounded-lg ${getRatingColor(performanceRating)}`}>
                  {performanceRating}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Based on average points per event
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Medal Count</h3>
                  <span className="text-2xl">🏅</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-yellow-600">🥇 Gold:</span>
                    <span className="font-bold">{positionStats.first}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">🥈 Silver:</span>
                    <span className="font-bold">{positionStats.second}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-600">🥉 Bronze:</span>
                    <span className="font-bold">{positionStats.third}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Activity Summary</h3>
                  <span className="text-2xl">📋</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Events Joined:</span>
                    <span className="font-bold">{participations.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Results Recorded:</span>
                    <span className="font-bold">{results.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Points:</span>
                    <span className="font-bold">
                      {participations.length > 0 ? (totalPoints / participations.length).toFixed(1) : '0'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
              </div>
              <div className="p-6">
                {results.length > 0 ? (
                  <div className="space-y-4">
                    {results.slice(0, 5).map((result, index) => {
                      const participant = result.participants?.find(p => 
                        p.name?.toLowerCase().includes(candidate.name.toLowerCase())
                      );
                      return (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">🏆</span>
                            <div>
                              <h4 className="font-semibold text-gray-900">{result.programme}</h4>
                              <p className="text-sm text-gray-600">Position: #{participant?.position}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-indigo-600">{participant?.points} pts</div>
                            <div className="text-sm text-gray-500">
                              {new Date(result.createdAt || '').toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <span className="text-4xl mb-4 block">📊</span>
                    <p className="text-gray-600">No recent activity recorded</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Participations Tab */}
        {activeTab === 'participations' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-2xl font-bold text-white">Programme Participations</h2>
                <p className="text-blue-100">All events this participant has registered for</p>
              </div>
              <div className="p-6">
                {participations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {participations.map((participation, index) => {
                      const programmeName = getProgrammeName(participation.programmeId);
                      const category = getProgrammeCategory(participation.programmeId);
                      const participant = participation.participants.find(p => p.candidateId === candidateId);
                      
                      return (
                        <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl">{getCategoryIcon(category)}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(participation.createdAt || '').toLocaleDateString()}
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">{programmeName}</h4>
                          <div className="text-sm text-gray-600">
                            <p>Team: {team?.name}</p>
                            <p>Role: {participant?.role || 'Participant'}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <span className="text-4xl mb-4 block">🎭</span>
                    <p className="text-gray-600">No participations recorded</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                <h2 className="text-2xl font-bold text-white">Competition Results</h2>
                <p className="text-green-100">Detailed performance in each event</p>
              </div>
              <div className="p-6">
                {results.length > 0 ? (
                  <div className="space-y-4">
                    {results.map((result, index) => {
                      const participant = result.participants?.find(p => 
                        p.name?.toLowerCase().includes(candidate.name.toLowerCase())
                      );
                      
                      const getPositionColor = (position: number) => {
                        if (position === 1) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                        if (position === 2) return 'bg-gray-100 text-gray-800 border-gray-200';
                        if (position === 3) return 'bg-orange-100 text-orange-800 border-orange-200';
                        return 'bg-blue-100 text-blue-800 border-blue-200';
                      };

                      const getPositionIcon = (position: number) => {
                        if (position === 1) return '🥇';
                        if (position === 2) return '🥈';
                        if (position === 3) return '🥉';
                        return '🏅';
                      };

                      return (
                        <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xl font-semibold text-gray-900">{result.programme}</h4>
                            <div className="flex items-center space-x-2">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPositionColor(participant?.position || 0)}`}>
                                {getPositionIcon(participant?.position || 0)} Position #{participant?.position}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <div className="text-2xl font-bold text-indigo-600">{participant?.points || 0}</div>
                              <div className="text-sm text-gray-600">Points Earned</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <div className="text-2xl font-bold text-green-600">#{participant?.position || 'N/A'}</div>
                              <div className="text-sm text-gray-600">Final Position</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <div className="text-2xl font-bold text-purple-600">{result.participants?.length || 0}</div>
                              <div className="text-sm text-gray-600">Total Participants</div>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>Date:</span>
                              <span>{new Date(result.createdAt || '').toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <span className="text-4xl mb-4 block">🏆</span>
                    <p className="text-gray-600">No results recorded yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Medals & Awards */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🏅 Medals & Awards</h3>
                <div className="space-y-4">
                  {positionStats.first > 0 && (
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🥇</span>
                        <span className="font-medium">Gold Medals</span>
                      </div>
                      <span className="text-xl font-bold text-yellow-600">{positionStats.first}</span>
                    </div>
                  )}
                  {positionStats.second > 0 && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🥈</span>
                        <span className="font-medium">Silver Medals</span>
                      </div>
                      <span className="text-xl font-bold text-gray-600">{positionStats.second}</span>
                    </div>
                  )}
                  {positionStats.third > 0 && (
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🥉</span>
                        <span className="font-medium">Bronze Medals</span>
                      </div>
                      <span className="text-xl font-bold text-orange-600">{positionStats.third}</span>
                    </div>
                  )}
                  {positionStats.total === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No medals earned yet
                    </div>
                  )}
                </div>
              </div>

              {/* Performance Milestones */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🌟 Milestones</h3>
                <div className="space-y-3">
                  <div className={`p-3 rounded-lg ${participations.length >= 5 ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-600'}`}>
                    <div className="flex items-center justify-between">
                      <span>Active Participant</span>
                      <span>{participations.length >= 5 ? '✅' : '⏳'}</span>
                    </div>
                    <div className="text-sm opacity-75">Join 5+ events ({participations.length}/5)</div>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${positionStats.first >= 1 ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-600'}`}>
                    <div className="flex items-center justify-between">
                      <span>Champion</span>
                      <span>{positionStats.first >= 1 ? '✅' : '⏳'}</span>
                    </div>
                    <div className="text-sm opacity-75">Win 1st place ({positionStats.first}/1)</div>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${totalPoints >= 50 ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-600'}`}>
                    <div className="flex items-center justify-between">
                      <span>Point Collector</span>
                      <span>{totalPoints >= 50 ? '✅' : '⏳'}</span>
                    </div>
                    <div className="text-sm opacity-75">Earn 50+ points ({totalPoints}/50)</div>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${positionStats.total >= 3 ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-600'}`}>
                    <div className="flex items-center justify-between">
                      <span>Podium Finisher</span>
                      <span>{positionStats.total >= 3 ? '✅' : '⏳'}</span>
                    </div>
                    <div className="text-sm opacity-75">3+ podium finishes ({positionStats.total}/3)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}