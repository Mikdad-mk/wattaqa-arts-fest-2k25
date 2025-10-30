"use client";

import { useState, useEffect } from 'react';
import { Team, Result, Candidate, Programme } from '@/types';

interface TeamRanking {
  name: string;
  code: string;
  points: number;
  color: string;
  description: string;
  firstPlaces: number;
  secondPlaces: number;
  thirdPlaces: number;
  participations: number;
  winRate: number;
}

interface IndividualRanking {
  name: string;
  chestNumber: string;
  team: string;
  teamColor: string;
  section: string;
  points: number;
  firstPlaces: number;
  secondPlaces: number;
  thirdPlaces: number;
  participations: number;
  winRate: number;
}

interface SectionRanking {
  section: string;
  teams: {
    [teamCode: string]: {
      name: string;
      color: string;
      points: number;
      firstPlaces: number;
      secondPlaces: number;
      thirdPlaces: number;
      participations: number;
    }
  };
  totalPoints: number;
  totalParticipations: number;
}

export default function LeaderboardPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [teamRankings, setTeamRankings] = useState<TeamRanking[]>([]);
  const [individualRankings, setIndividualRankings] = useState<IndividualRanking[]>([]);
  const [sectionRankings, setSectionRankings] = useState<SectionRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'general' | 'teams' | 'individual' | 'sections'>('general');

  // Fetch data from APIs
  const fetchData = async () => {
    try {
      setLoading(true);
      const [teamsRes, resultsRes, candidatesRes, programmesRes] = await Promise.all([
        fetch('/api/teams'),
        fetch('/api/results'),
        fetch('/api/candidates'),
        fetch('/api/programmes')
      ]);

      const [teamsData, resultsData, candidatesData, programmesData] = await Promise.all([
        teamsRes.json(),
        resultsRes.json(),
        candidatesRes.json(),
        programmesRes.json()
      ]);

      setTeams(teamsData || []);
      setResults(resultsData || []);
      setCandidates(candidatesData || []);
      setProgrammes(programmesData || []);
      setLastUpdated(new Date());

      // Calculate rankings
      calculateRankings(teamsData, resultsData, candidatesData, programmesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRankings = (teamsData: Team[], resultsData: Result[], candidatesData: Candidate[], programmesData: Programme[]) => {
    const teamStats: {
      [key: string]: {
        points: number;
        firstPlaces: number;
        secondPlaces: number;
        thirdPlaces: number;
        participations: number;
      }
    } = {};

    teamsData.forEach(team => {
      teamStats[team.code] = {
        points: 0,
        firstPlaces: 0,
        secondPlaces: 0,
        thirdPlaces: 0,
        participations: 0
      };
    });

    // Calculate points from results
    resultsData.forEach(result => {
      // Process individual results
      if (result.firstPlace) {
        result.firstPlace.forEach(winner => {
          const candidate = candidatesData.find(c => c.chestNumber === winner.chestNumber);
          if (candidate && teamStats[candidate.team]) {
            teamStats[candidate.team].points += result.firstPoints;
            teamStats[candidate.team].firstPlaces += 1;
            teamStats[candidate.team].participations += 1;
          }
        });
      }

      if (result.secondPlace) {
        result.secondPlace.forEach(winner => {
          const candidate = candidatesData.find(c => c.chestNumber === winner.chestNumber);
          if (candidate && teamStats[candidate.team]) {
            teamStats[candidate.team].points += result.secondPoints;
            teamStats[candidate.team].secondPlaces += 1;
            teamStats[candidate.team].participations += 1;
          }
        });
      }

      if (result.thirdPlace) {
        result.thirdPlace.forEach(winner => {
          const candidate = candidatesData.find(c => c.chestNumber === winner.chestNumber);
          if (candidate && teamStats[candidate.team]) {
            teamStats[candidate.team].points += result.thirdPoints;
            teamStats[candidate.team].thirdPlaces += 1;
            teamStats[candidate.team].participations += 1;
          }
        });
      }

      // Process team results
      if (result.firstPlaceTeams) {
        result.firstPlaceTeams.forEach(winner => {
          if (teamStats[winner.teamCode]) {
            teamStats[winner.teamCode].points += result.firstPoints;
            teamStats[winner.teamCode].firstPlaces += 1;
          }
        });
      }

      if (result.secondPlaceTeams) {
        result.secondPlaceTeams.forEach(winner => {
          if (teamStats[winner.teamCode]) {
            teamStats[winner.teamCode].points += result.secondPoints;
            teamStats[winner.teamCode].secondPlaces += 1;
          }
        });
      }

      if (result.thirdPlaceTeams) {
        result.thirdPlaceTeams.forEach(winner => {
          if (teamStats[winner.teamCode]) {
            teamStats[winner.teamCode].points += result.thirdPoints;
            teamStats[winner.teamCode].thirdPlaces += 1;
          }
        });
      }
    });

    // Create team rankings
    const rankings = teamsData.map(team => {
      const stats = teamStats[team.code];
      const totalWins = stats.firstPlaces + stats.secondPlaces + stats.thirdPlaces;
      const winRate = stats.participations > 0 ? (totalWins / stats.participations) * 100 : 0;

      return {
        name: team.name,
        code: team.code,
        points: stats.points,
        color: team.color,
        description: team.description,
        firstPlaces: stats.firstPlaces,
        secondPlaces: stats.secondPlaces,
        thirdPlaces: stats.thirdPlaces,
        participations: stats.participations,
        winRate
      };
    }).sort((a, b) => b.points - a.points);

    setTeamRankings(rankings);

    // Calculate individual rankings
    const individualStats: { [key: string]: IndividualRanking } = {};
    
    candidatesData.forEach(candidate => {
      const team = teamsData.find(t => t.code === candidate.team);
      individualStats[candidate.chestNumber] = {
        name: candidate.name,
        chestNumber: candidate.chestNumber,
        team: candidate.team,
        teamColor: team?.color || '#6B7280',
        section: candidate.section,
        points: 0,
        firstPlaces: 0,
        secondPlaces: 0,
        thirdPlaces: 0,
        participations: 0,
        winRate: 0
      };
    });

    resultsData.forEach(result => {
      // Process individual results only
      [
        { place: result.firstPlace, points: result.firstPoints, position: 'first' },
        { place: result.secondPlace, points: result.secondPoints, position: 'second' },
        { place: result.thirdPlace, points: result.thirdPoints, position: 'third' }
      ].forEach(({ place, points, position }) => {
        (place || []).forEach(winner => {
          if (individualStats[winner.chestNumber]) {
            individualStats[winner.chestNumber].points += points;
            individualStats[winner.chestNumber].participations += 1;
            if (position === 'first') individualStats[winner.chestNumber].firstPlaces += 1;
            if (position === 'second') individualStats[winner.chestNumber].secondPlaces += 1;
            if (position === 'third') individualStats[winner.chestNumber].thirdPlaces += 1;
          }
        });
      });
    });

    // Calculate win rates for individuals
    Object.values(individualStats).forEach(individual => {
      const totalWins = individual.firstPlaces + individual.secondPlaces + individual.thirdPlaces;
      individual.winRate = individual.participations > 0 ? (totalWins / individual.participations) * 100 : 0;
    });

    const individualRankingsList = Object.values(individualStats)
      .filter(individual => individual.participations > 0)
      .sort((a, b) => b.points - a.points);

    setIndividualRankings(individualRankingsList);

    // Calculate section rankings
    const sectionStats: { [key: string]: SectionRanking } = {};
    
    candidatesData.forEach(candidate => {
      if (!sectionStats[candidate.section]) {
        sectionStats[candidate.section] = {
          section: candidate.section,
          teams: {},
          totalPoints: 0,
          totalParticipations: 0
        };
      }
      
      const team = teamsData.find(t => t.code === candidate.team);
      if (team && !sectionStats[candidate.section].teams[candidate.team]) {
        sectionStats[candidate.section].teams[candidate.team] = {
          name: team.name,
          color: team.color,
          points: 0,
          firstPlaces: 0,
          secondPlaces: 0,
          thirdPlaces: 0,
          participations: 0
        };
      }
    });

    resultsData.forEach(result => {
      const programme = programmesData.find(p => p._id === result.programmeId || p.id === result.programmeId);
      if (!programme) return;

      // Process individual results by section
      [
        { place: result.firstPlace, points: result.firstPoints, position: 'first' },
        { place: result.secondPlace, points: result.secondPoints, position: 'second' },
        { place: result.thirdPlace, points: result.thirdPoints, position: 'third' }
      ].forEach(({ place, points, position }) => {
        (place || []).forEach(winner => {
          const candidate = candidatesData.find(c => c.chestNumber === winner.chestNumber);
          if (candidate && sectionStats[candidate.section] && sectionStats[candidate.section].teams[candidate.team]) {
            sectionStats[candidate.section].teams[candidate.team].points += points;
            sectionStats[candidate.section].teams[candidate.team].participations += 1;
            sectionStats[candidate.section].totalPoints += points;
            sectionStats[candidate.section].totalParticipations += 1;
            
            if (position === 'first') sectionStats[candidate.section].teams[candidate.team].firstPlaces += 1;
            if (position === 'second') sectionStats[candidate.section].teams[candidate.team].secondPlaces += 1;
            if (position === 'third') sectionStats[candidate.section].teams[candidate.team].thirdPlaces += 1;
          }
        });
      });
    });

    const sectionRankingsList = Object.values(sectionStats)
      .sort((a, b) => b.totalPoints - a.totalPoints);

    setSectionRankings(sectionRankingsList);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}>
      {/* Hero Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-6">
              <span className="text-white text-2xl">🏆</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Festival Leaderboard
            </h1>
            <p className="text-xl text-purple-100 mb-6 max-w-3xl mx-auto">
              Live rankings and team performance in the Wattaqa Arts & Sports Festival 2K25
            </p>
            <div className="flex items-center justify-center space-x-4 text-purple-200">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Live Updates
              </span>
              <span>•</span>
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="flex flex-wrap border-b">
            {[
              { key: 'general', label: '🏆 General Rankings', icon: '🏆' },
              { key: 'teams', label: '👥 Team Rankings', icon: '👥' },
              { key: 'individual', label: '🎯 Individual Rankings', icon: '🎯' },
              { key: 'sections', label: '📊 Section Rankings', icon: '📊' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-4 font-medium text-sm md:text-base transition-colors duration-200 ${
                  activeTab === tab.key
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
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* General Rankings Tab */}
        {activeTab === 'general' && teamRankings.length > 0 && (
          <div className="space-y-8">
            {/* Top 3 Podium - Grid Layout */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
                <h2 className="text-2xl font-bold text-white">🏆 Championship Podium</h2>
                <p className="text-purple-100">Top 3 performing teams</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {teamRankings.slice(0, 3).map((team, index) => (
                    <div
                      key={team.code}
                      className={`relative rounded-lg border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${
                        index === 0 ? 'md:order-2 transform md:scale-105' : 
                        index === 1 ? 'md:order-1' : 'md:order-3'
                      }`}
                      style={{ 
                        backgroundColor: `${team.color}08`,
                        borderColor: `${team.color}40`
                      }}
                    >
                      {/* Position Badge */}
                      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
                           style={{ backgroundColor: team.color }}>
                        {index + 1}
                      </div>
                      
                      {/* Champion Crown */}
                      {index === 0 && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                               style={{ backgroundColor: team.color }}>
                            <span className="text-white text-sm">👑</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-6">
                        {/* Team Badge */}
                        <div className="text-center mb-4">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 shadow-lg"
                               style={{ backgroundColor: team.color }}>
                            <span className="text-white text-xl font-bold">{team.code}</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">{team.name}</h3>
                          <p className="text-gray-600 text-sm">{team.description}</p>
                        </div>
                        
                        {/* Points Display */}
                        <div className="text-center mb-4">
                          <div className="text-3xl font-bold mb-1" style={{ color: team.color }}>
                            {team.points.toLocaleString()}
                          </div>
                          <div className="text-gray-500 text-sm">Total Points</div>
                        </div>
                        
                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <div className="text-center p-2 bg-white rounded border"
                               style={{ borderColor: `${team.color}30` }}>
                            <div className="font-bold" style={{ color: team.color }}>{team.firstPlaces}</div>
                            <div className="text-xs text-gray-500">1st</div>
                          </div>
                          <div className="text-center p-2 bg-white rounded border"
                               style={{ borderColor: `${team.color}30` }}>
                            <div className="font-bold" style={{ color: team.color }}>{team.secondPlaces}</div>
                            <div className="text-xs text-gray-500">2nd</div>
                          </div>
                          <div className="text-center p-2 bg-white rounded border"
                               style={{ borderColor: `${team.color}30` }}>
                            <div className="font-bold" style={{ color: team.color }}>{team.thirdPlaces}</div>
                            <div className="text-xs text-gray-500">3rd</div>
                          </div>
                        </div>
                        
                        {/* Win Rate */}
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{Math.round(team.winRate)}%</div>
                          <div className="text-gray-500 text-sm">Win Rate</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Complete Rankings Table */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
                <h2 className="text-2xl font-bold text-white">📊 Complete Rankings</h2>
                <p className="text-purple-100">Full team standings and performance metrics</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Team
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Points
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        1st Places
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        2nd Places
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        3rd Places
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Win Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teamRankings.map((team, index) => (
                      <tr key={team.code} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                 style={{ backgroundColor: team.color }}>
                              {index + 1}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3"
                                 style={{ backgroundColor: team.color }}>
                              {team.code}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{team.name}</div>
                              <div className="text-sm text-gray-500">{team.participations} participations</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold" style={{ color: team.color }}>
                            {team.points.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold" style={{ color: team.color }}>
                            {team.firstPlaces}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold" style={{ color: team.color }}>
                            {team.secondPlaces}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold" style={{ color: team.color }}>
                            {team.thirdPlaces}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold text-gray-900">
                            {Math.round(team.winRate)}%
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-white text-xl">🏆</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {teamRankings.reduce((sum, team) => sum + team.firstPlaces, 0)}
                    </div>
                    <div className="text-sm text-gray-500">Total First Places</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-white text-xl">🥈</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {teamRankings.reduce((sum, team) => sum + team.secondPlaces, 0)}
                    </div>
                    <div className="text-sm text-gray-500">Total Second Places</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-white text-xl">🥉</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {teamRankings.reduce((sum, team) => sum + team.thirdPlaces, 0)}
                    </div>
                    <div className="text-sm text-gray-500">Total Third Places</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {Math.round(teamRankings.reduce((sum, team) => sum + team.points, 0) / teamRankings.length)}
                    </div>
                    <div className="text-sm text-gray-500">Average Points</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Team Rankings Tab */}
        {activeTab === 'teams' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-2xl font-bold text-white">👥 Team Rankings</h2>
                <p className="text-blue-100">Complete team standings and performance</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">1st</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">2nd</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">3rd</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Win Rate</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teamRankings.map((team, index) => (
                      <tr key={team.code} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                               style={{ backgroundColor: team.color }}>
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3"
                                 style={{ backgroundColor: team.color }}>
                              {team.code}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{team.name}</div>
                              <div className="text-sm text-gray-500">{team.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold" style={{ color: team.color }}>
                            {team.points.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold text-yellow-600">{team.firstPlaces}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold text-gray-500">{team.secondPlaces}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold text-orange-600">{team.thirdPlaces}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold text-gray-900">{Math.round(team.winRate)}%</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Individual Rankings Tab */}
        {activeTab === 'individual' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                <h2 className="text-2xl font-bold text-white">🎯 Individual Rankings</h2>
                <p className="text-green-100">Top performing individual participants</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">1st</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">2nd</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">3rd</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Win Rate</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {individualRankings.slice(0, 50).map((individual, index) => (
                      <tr key={individual.chestNumber} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            index === 0 ? 'bg-yellow-500' : 
                            index === 1 ? 'bg-gray-400' : 
                            index === 2 ? 'bg-orange-500' : 'bg-purple-500'
                          }`}>
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{individual.name}</div>
                            <div className="text-sm text-gray-500">#{individual.chestNumber}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs mr-2"
                                 style={{ backgroundColor: individual.teamColor }}>
                              {individual.team}
                            </div>
                            <span className="text-sm text-gray-900">{individual.team}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {individual.section}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold" style={{ color: individual.teamColor }}>
                            {individual.points.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold text-yellow-600">{individual.firstPlaces}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold text-gray-500">{individual.secondPlaces}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold text-orange-600">{individual.thirdPlaces}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold text-gray-900">{Math.round(individual.winRate)}%</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Section Rankings Tab */}
        {activeTab === 'sections' && (
          <div className="space-y-8">
            {sectionRankings.map((section, sectionIndex) => (
              <div key={section.section} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
                  <h2 className="text-2xl font-bold text-white">📊 {section.section} Section Rankings</h2>
                  <p className="text-orange-100">
                    Total Points: {section.totalPoints.toLocaleString()} • Participations: {section.totalParticipations}
                  </p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">1st</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">2nd</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">3rd</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participations</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(section.teams)
                        .sort(([,a], [,b]) => b.points - a.points)
                        .map(([teamCode, teamData], index) => (
                        <tr key={teamCode} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                              index === 0 ? 'bg-yellow-500' : 
                              index === 1 ? 'bg-gray-400' : 
                              index === 2 ? 'bg-orange-500' : 'bg-purple-500'
                            }`}>
                              {index + 1}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3"
                                   style={{ backgroundColor: teamData.color }}>
                                {teamCode}
                              </div>
                              <div className="text-sm font-medium text-gray-900">{teamData.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-lg font-bold" style={{ color: teamData.color }}>
                              {teamData.points.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-lg font-bold text-yellow-600">{teamData.firstPlaces}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-lg font-bold text-gray-500">{teamData.secondPlaces}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-lg font-bold text-orange-600">{teamData.thirdPlaces}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-lg font-bold text-gray-900">{teamData.participations}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {teamRankings.length === 0 && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">🏆</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Competition Starting Soon</h2>
            <p className="text-gray-600">
              Rankings will appear here once competitions begin
            </p>
          </div>
        )}
      </div>
    </div>
  );
}