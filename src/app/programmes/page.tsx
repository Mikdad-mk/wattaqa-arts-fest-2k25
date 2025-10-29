'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Programme, ProgrammeParticipant, Team, Candidate, Result } from '@/types';
import { PublicNavbar } from '@/components/Navigation/PublicNavbar';
import { PublicFooter } from '@/components/Navigation/PublicFooter';

export default function ProgrammesPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [participants, setParticipants] = useState<ProgrammeParticipant[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'arts' | 'sports'>('all');
  const [selectedSection, setSelectedSection] = useState<'all' | 'senior' | 'junior' | 'sub-junior' | 'general'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'upcoming' | 'completed' | 'active'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [programmesRes, participantsRes, teamsRes, candidatesRes, resultsRes] = await Promise.all([
        fetch('/api/programmes'),
        fetch('/api/programme-participants'),
        fetch('/api/teams'),
        fetch('/api/candidates'),
        fetch('/api/results')
      ]);

      const [programmesData, participantsData, teamsData, candidatesData, resultsData] = await Promise.all([
        programmesRes.json(),
        participantsRes.json(),
        teamsRes.json(),
        candidatesRes.json(),
        resultsRes.json()
      ]);

      setProgrammes(programmesData || []);
      setParticipants(participantsData || []);
      setTeams(teamsData || []);
      setCandidates(candidatesData || []);
      setResults(resultsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'arts': return '🎭';
      case 'sports': return '⚽';
      default: return '🏆';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'arts': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'sports': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'senior': return 'bg-red-100 text-red-800';
      case 'junior': return 'bg-yellow-100 text-yellow-800';
      case 'sub-junior': return 'bg-pink-100 text-pink-800';
      case 'general': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPositionTypeIcon = (positionType: string) => {
    switch (positionType) {
      case 'individual': return '👤';
      case 'group': return '👥';
      case 'general': return '🌟';
      default: return '📋';
    }
  };

  const getProgrammeParticipants = (programmeId: string) => {
    return participants.filter(p => p.programmeId === programmeId);
  };

  const getProgrammeResults = (programmeName: string) => {
    return results.filter(r => r.programme.includes(programmeName));
  };

  const getProgrammeStatus = (programme: Programme) => {
    const programmeResults = getProgrammeResults(programme.name);
    if (programmeResults.length > 0) return 'completed';
    if (programme.status === 'active') return 'active';
    return 'upcoming';
  };

  const filteredProgrammes = programmes.filter(programme => {
    const matchesSearch = programme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programme.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || programme.category === selectedCategory;
    const matchesSection = selectedSection === 'all' || programme.section === selectedSection;
    const programmeStatus = getProgrammeStatus(programme);
    const matchesStatus = selectedStatus === 'all' || programmeStatus === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesSection && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'active': return '🔄';
      case 'upcoming': return '⏰';
      default: return '📋';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading programmes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <PublicNavbar />
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">🏆 Festival Programmes</h1>
            <p className="text-lg text-gray-600">Wattaqa Arts Festival 2K25 - All Competitions</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{programmes.length}</div>
            <div className="text-sm text-gray-600">Total Programmes</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {programmes.filter(p => p.category === 'arts').length}
            </div>
            <div className="text-sm text-gray-600">Arts Programmes</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {programmes.filter(p => p.category === 'sports').length}
            </div>
            <div className="text-sm text-gray-600">Sports Programmes</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">
              {programmes.filter(p => getProgrammeStatus(p) === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search programmes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Categories</option>
                <option value="arts">🎭 Arts</option>
                <option value="sports">⚽ Sports</option>
              </select>

              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Sections</option>
                <option value="senior">Senior</option>
                <option value="junior">Junior</option>
                <option value="sub-junior">Sub Junior</option>
                <option value="general">General</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="upcoming">⏰ Upcoming</option>
                <option value="active">🔄 Active</option>
                <option value="completed">✅ Completed</option>
              </select>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  📊 Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  📋 List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProgrammes.length} of {programmes.length} programmes
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Programmes Display */}
        {filteredProgrammes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Programmes Found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProgrammes.map((programme) => {
              const programmeParticipants = getProgrammeParticipants(programme._id?.toString() || '');
              const programmeResults = getProgrammeResults(programme.name);
              const status = getProgrammeStatus(programme);
              const totalParticipants = programmeParticipants.reduce((sum, p) => sum + p.participants.length, 0);
              
              return (
                <Link
                  key={programme._id?.toString()}
                  href={`/programmes/${programme._id}`}
                  className="block group"
                >
                  <div className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden group-hover:scale-105">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getCategoryIcon(programme.category)}</span>
                          <div>
                            <h3 className="font-bold text-lg group-hover:text-blue-100 transition-colors">
                              {programme.name}
                            </h3>
                            <p className="text-blue-100 text-sm font-mono">{programme.code}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                          {getStatusIcon(status)}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(programme.category)}`}>
                          {programme.category.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSectionColor(programme.section)}`}>
                          {programme.section.toUpperCase()}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          {getPositionTypeIcon(programme.positionType)} {programme.positionType.toUpperCase()}
                        </span>
                      </div>

                      {/* Statistics */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{programmeParticipants.length}</div>
                          <div className="text-xs text-gray-500">Teams</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{totalParticipants}</div>
                          <div className="text-xs text-gray-500">Participants</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">{programme.requiredParticipants}</div>
                          <div className="text-xs text-gray-500">Required</div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      {programme.subcategory && (
                        <div className="mb-3">
                          <span className="text-xs text-gray-500">Subcategory: </span>
                          <span className="text-sm font-medium text-gray-700 capitalize">{programme.subcategory}</span>
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="bg-gray-50 px-6 py-3 border-t">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                          {programmeResults.length > 0 ? 'Results Available' : 'View Details'}
                        </span>
                        <span className="text-blue-600 group-hover:text-blue-800">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Programme</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Category</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Section</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Type</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Teams</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Participants</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProgrammes.map((programme) => {
                    const programmeParticipants = getProgrammeParticipants(programme._id?.toString() || '');
                    const programmeResults = getProgrammeResults(programme.name);
                    const status = getProgrammeStatus(programme);
                    const totalParticipants = programmeParticipants.reduce((sum, p) => sum + p.participants.length, 0);
                    
                    return (
                      <tr key={programme._id?.toString()} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{getCategoryIcon(programme.category)}</span>
                            <div>
                              <div className="font-medium text-gray-900">{programme.name}</div>
                              <div className="text-sm text-gray-500 font-mono">{programme.code}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(programme.category)}`}>
                            {programme.category}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSectionColor(programme.section)}`}>
                            {programme.section}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-gray-700 capitalize">
                            {getPositionTypeIcon(programme.positionType)} {programme.positionType}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-medium text-blue-600">{programmeParticipants.length}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-medium text-green-600">{totalParticipants}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                            {getStatusIcon(status)} {status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <Link
                            href={`/programmes/${programme._id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View Details →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <PublicFooter />
    </div>
  );
}