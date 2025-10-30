"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Candidate, Team, ProgrammeParticipant, Result } from '@/types';

export default function ProfilesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [participants, setParticipants] = useState<ProgrammeParticipant[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'team' | 'section' | 'points'>('name');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [candidatesRes, teamsRes, participantsRes, resultsRes] = await Promise.all([
        fetch('/api/candidates'),
        fetch('/api/teams'),
        fetch('/api/programme-participants'),
        fetch('/api/results')
      ]);

      const [candidatesData, teamsData, participantsData, resultsData] = await Promise.all([
        candidatesRes.json(),
        participantsRes.json(),
        teamsRes.json(),
        resultsRes.json()
      ]);

      setCandidates(candidatesData || []);
      setTeams(teamsData || []);
      setParticipants(participantsData || []);
      setResults(resultsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t._id?.toString() === teamId);
    return team?.name || 'Unknown Team';
  };

  const getTeamColor = (teamId: string) => {
    const team = teams.find(t => t._id?.toString() === teamId);
    switch (team?.name?.toLowerCase()) {
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

  const getCandidateParticipations = (candidateId: string) => {
    return participants.filter(p => 
      p.participants.some(participant => participant.candidateId === candidateId)
    );
  };

  const getCandidateResults = (candidateName: string) => {
    return results.filter(r => 
      r.participants?.some(p => p.name?.toLowerCase().includes(candidateName.toLowerCase()))
    );
  };

  const getCandidateTotalPoints = (candidate: Candidate) => {
    const candidateResults = getCandidateResults(candidate.name);
    return candidateResults.reduce((total, result) => {
      const participant = result.participants?.find(p => 
        p.name?.toLowerCase().includes(candidate.name.toLowerCase())
      );
      return total + (participant?.points || 0);
    }, 0);
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.chestNumber?.toString().includes(searchTerm);
    const matchesTeam = selectedTeam === 'all' || candidate.teamId === selectedTeam;
    const matchesSection = selectedSection === 'all' || candidate.section === selectedSection;
    
    return matchesSearch && matchesTeam && matchesSection;
  });

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'team':
        return getTeamName(a.teamId).localeCompare(getTeamName(b.teamId));
      case 'section':
        return (a.section || '').localeCompare(b.section || '');
      case 'points':
        return getCandidateTotalPoints(b) - getCandidateTotalPoints(a);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl">Loading profiles...</p>
        </div>
      </div>
    );
  }

  const sections = [...new Set(candidates.map(c => c.section))].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}>
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-6">
              <span className="text-white text-2xl">👥</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Participant Profiles
            </h1>
            <p className="text-xl text-indigo-100 mb-6 max-w-3xl mx-auto">
              Discover talented participants from all teams competing in Wattaqa 2K25
            </p>
            <div className="flex items-center justify-center space-x-6 text-indigo-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{candidates.length}</div>
                <div className="text-sm">Total Participants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{teams.length}</div>
                <div className="text-sm">Teams</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{sections.length}</div>
                <div className="text-sm">Sections</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder="Search by name or chest number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Teams</option>
              {teams.map((team) => (
                <option key={team._id?.toString()} value={team._id?.toString()}>
                  {team.name}
                </option>
              ))}
            </select>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Sections</option>
              {sections.map((section, idx) => (
                <option key={idx} value={section}>{section}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="team">Sort by Team</option>
              <option value="section">Sort by Section</option>
              <option value="points">Sort by Points</option>
            </select>
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedCandidates.map((candidate) => {
            const participations = getCandidateParticipations(candidate._id?.toString() || '');
            const totalPoints = getCandidateTotalPoints(candidate);
            const teamName = getTeamName(candidate.teamId);
            
            return (
              <Link
                key={candidate._id?.toString()}
                href={`/profiles/${candidate._id}`}
                className="block group"
              >
                <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
                  {/* Profile Header */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold">
                          {candidate.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg group-hover:text-indigo-100 transition-colors">
                          {candidate.name}
                        </h3>
                        <p className="text-indigo-100 text-sm">
                          #{candidate.chestNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Content */}
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTeamColor(candidate.teamId)}`}>
                        {teamName}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSectionColor(candidate.section)}`}>
                        {candidate.section}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-lg font-bold text-blue-600">{participations.length}</div>
                        <div className="text-xs text-gray-500">Events</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">{totalPoints}</div>
                        <div className="text-xs text-gray-500">Points</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-600">
                          {getCandidateResults(candidate.name).length}
                        </div>
                        <div className="text-xs text-gray-500">Results</div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Performance</span>
                        <span className="font-medium">
                          {totalPoints > 0 ? `${Math.round(totalPoints / Math.max(participations.length, 1))} avg` : 'No data'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {sortedCandidates.length === 0 && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">👥</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Profiles Found</h2>
            <p className="text-gray-600">
              {searchTerm || selectedTeam !== 'all' || selectedSection !== 'all'
                ? 'Try adjusting your search criteria'
                : 'Participant profiles will appear here once candidates are registered'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}