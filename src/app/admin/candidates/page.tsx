'use client';

import { useState, useEffect } from 'react';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Candidate, Team } from '@/types';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    chestNumber: '',
    name: '',
    team: '',
    section: '' as 'senior' | 'junior' | 'sub-junior' | ''
  });

  // Filter out blank/empty candidates
  const filterValidCandidates = (candidates: Candidate[]) => {
    return candidates.filter(candidate => 
      candidate.name && 
      candidate.name.trim() !== '' &&
      candidate.chestNumber && 
      candidate.chestNumber.trim() !== '' &&
      candidate.team && 
      candidate.team.trim() !== '' &&
      candidate.section && 
      candidate.section.trim() !== ''
    );
  };

  // Fetch candidates and teams from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const [candidatesRes, teamsRes] = await Promise.all([
        fetch('/api/candidates'),
        fetch('/api/teams')
      ]);
      
      const [candidatesData, teamsData] = await Promise.all([
        candidatesRes.json(),
        teamsRes.json()
      ]);
      
      // Filter out blank/empty candidates
      const validCandidates = filterValidCandidates(candidatesData);
      
      setCandidates(validCandidates);
      setTeams(teamsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.chestNumber || !formData.name || !formData.team || !formData.section) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Reset form
        setFormData({
          chestNumber: '',
          name: '',
          team: '',
          section: '' as 'senior' | 'junior' | 'sub-junior' | ''
        });
        
        // Refresh candidates list
        await fetchData();
        alert('Candidate added successfully!');
      } else {
        alert('Error adding candidate');
      }
    } catch (error) {
      console.error('Error adding candidate:', error);
      alert('Error adding candidate');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle delete candidate
  const handleDelete = async (candidateId: string, candidateName: string) => {
    if (!confirm(`Are you sure you want to delete ${candidateName}? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(candidateId);
      const response = await fetch(`/api/candidates?id=${candidateId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchData(); // Refresh the list
        alert('Candidate deleted successfully!');
      } else {
        const error = await response.json();
        alert(`Error deleting candidate: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting candidate:', error);
      alert('Error deleting candidate');
    } finally {
      setDeleting(null);
    }
  };

  // Get team color class
  const getTeamColorClass = (teamName: string) => {
    const team = teams.find(t => t.name === teamName);
    if (!team) return 'from-gray-400 to-gray-500';
    
    switch (team.color.toLowerCase()) {
      case 'green': return 'from-green-400 to-emerald-500';
      case 'blue': return 'from-blue-400 to-blue-500';
      case 'red': return 'from-red-400 to-rose-500';
      case 'yellow': return 'from-yellow-400 to-yellow-500';
      case 'purple': return 'from-purple-400 to-purple-500';
      case 'gray': return 'from-gray-700 to-gray-900';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  // Get team text color
  const getTeamTextColor = (teamName: string) => {
    const team = teams.find(t => t.name === teamName);
    if (!team) return 'text-gray-700';
    
    switch (team.color.toLowerCase()) {
      case 'green': return 'text-green-700';
      case 'blue': return 'text-blue-700';
      case 'red': return 'text-red-700';
      case 'yellow': return 'text-yellow-700';
      case 'purple': return 'text-purple-700';
      case 'gray': return 'text-gray-800';
      default: return 'text-gray-700';
    }
  };
  return (
    <>
      <Breadcrumb pageName="Candidates" />

      <div className="space-y-6">
        {/* Add New Candidate */}
        <ShowcaseSection title="Add New Candidate">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chest Number
                </label>
                <input
                  type="text"
                  name="chestNumber"
                  value={formData.chestNumber}
                  onChange={handleInputChange}
                  placeholder="Enter chest number (e.g., 001)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter candidate full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name
                </label>
                <select 
                  name="team"
                  value={formData.team}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  required
                >
                  <option value="">Select team</option>
                  {teams.map((team) => (
                    <option key={team._id?.toString()} value={team.name}>{team.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section
                </label>
                <select 
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  required
                >
                  <option value="">Select section</option>
                  <option value="senior">Senior</option>
                  <option value="junior">Junior</option>
                  <option value="sub-junior">Sub Junior</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              {submitting ? 'Adding Candidate...' : 'Add Candidate'}
            </button>
          </form>
        </ShowcaseSection>

        {/* Candidates List */}
        <ShowcaseSection title="Candidates List">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading candidates...</p>
              </div>
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No candidates found. Add your first candidate above!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Chest No.</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Name</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Team</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Section</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Points</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Status</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate) => (
                    <tr key={candidate._id?.toString()} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900 font-bold">{candidate.chestNumber}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 bg-gradient-to-r ${getTeamColorClass(candidate.team)} rounded-full flex items-center justify-center shadow-lg`}>
                            <span className="text-xs font-bold text-white">
                              {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <span className={`font-bold ${getTeamTextColor(candidate.team)}`}>{candidate.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200">
                          {candidate.team}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 font-medium">
                        {candidate.section.charAt(0).toUpperCase() + candidate.section.slice(1).replace('-', ' ')}
                      </td>
                      <td className="py-3 px-4 text-gray-900 font-bold">{candidate.points}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
                          Active
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                          <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">View</button>
                          <button 
                            onClick={() => handleDelete(candidate._id!.toString(), candidate.name)}
                            disabled={deleting === candidate._id?.toString()}
                            className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                          >
                            {deleting === candidate._id?.toString() ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ShowcaseSection>
      </div>
    </>
  );
}