'use client';

import { useState, useEffect } from 'react';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Team } from '@/types';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    color: '',
    description: '',
    captain: '',
    members: 45
  });

  // Fetch teams from API
  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/teams');
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.color || !formData.description || !formData.captain) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          points: 0 // New teams start with 0 points
        }),
      });

      if (response.ok) {
        // Reset form
        setFormData({
          name: '',
          color: '',
          description: '',
          captain: '',
          members: 45
        });
        
        // Refresh teams list
        await fetchTeams();
        alert('Team added successfully!');
      } else {
        alert('Error adding team');
      }
    } catch (error) {
      console.error('Error adding team:', error);
      alert('Error adding team');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'members' ? parseInt(value) || 0 : value
    }));
  };

  // Handle team deletion
  const handleDelete = async (teamId: string, teamName: string) => {
    if (!confirm(`Are you sure you want to delete ${teamName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/teams?id=${teamId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchTeams();
        alert('Team deleted successfully!');
      } else {
        alert('Error deleting team');
      }
    } catch (error) {
      console.error('Error deleting team:', error);
      alert('Error deleting team');
    }
  };

  // Get team color class
  const getTeamColorClass = (color: string) => {
    switch (color.toLowerCase()) {
      case 'green': return 'from-green-400 to-emerald-500';
      case 'blue': return 'from-blue-400 to-blue-500';
      case 'red': return 'from-red-400 to-rose-500';
      case 'yellow': return 'from-yellow-400 to-yellow-500';
      case 'purple': return 'from-purple-400 to-purple-500';
      case 'gray': return 'from-gray-700 to-gray-900';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  // Get team background class
  const getTeamBgClass = (color: string) => {
    switch (color.toLowerCase()) {
      case 'green': return 'from-green-50 to-emerald-50 border-green-200';
      case 'blue': return 'from-blue-50 to-blue-100 border-blue-200';
      case 'red': return 'from-red-50 to-rose-50 border-red-200';
      case 'yellow': return 'from-yellow-50 to-yellow-100 border-yellow-200';
      case 'purple': return 'from-purple-50 to-purple-100 border-purple-200';
      case 'gray': return 'from-gray-50 to-gray-100 border-gray-300';
      default: return 'from-gray-50 to-gray-100 border-gray-200';
    }
  };
  return (
    <>
      <Breadcrumb pageName="Teams" />

      <div className="space-y-6">
        {/* Add New Team */}
        <ShowcaseSection title="Add New Team">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter team name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Color
                </label>
                <select 
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  required
                >
                  <option value="">Select team color</option>
                  <option value="green">Green</option>
                  <option value="blue">Blue</option>
                  <option value="red">Red</option>
                  <option value="yellow">Yellow</option>
                  <option value="purple">Purple</option>
                  <option value="gray">Gray</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Members Count
                </label>
                <input
                  type="number"
                  name="members"
                  value={formData.members}
                  onChange={handleInputChange}
                  placeholder="Number of members"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Enter team description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Captain
              </label>
              <input
                type="text"
                name="captain"
                value={formData.captain}
                onChange={handleInputChange}
                placeholder="Enter team captain name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              {submitting ? 'Adding Team...' : 'Add Team'}
            </button>
          </form>
        </ShowcaseSection>

        {/* Existing Teams */}
        <ShowcaseSection title="Existing Teams">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading teams...</p>
              </div>
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No teams found. Add your first team above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map((team) => (
                <div key={team._id?.toString()} className={`bg-gradient-to-br ${getTeamBgClass(team.color)} border-2 rounded-lg p-4`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${getTeamColorClass(team.color)} rounded-lg flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold">{team.name.charAt(team.name.indexOf(' ') + 1) || team.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{team.name}</h3>
                      <p className="text-sm text-gray-600">{team.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Members:</span>
                      <span className="text-gray-900 font-medium">{team.members}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Captain:</span>
                      <span className="text-gray-900 font-medium">{team.captain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Points:</span>
                      <span className="text-gray-900 font-medium">{team.points}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="text-green-600 font-medium">Active</span>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700 transition-colors">
                      Edit
                    </button>
                    <button className="flex-1 bg-gray-200 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-300 transition-colors">
                      View
                    </button>
                    <button 
                      onClick={() => handleDelete(team._id!.toString(), team.name)}
                      className="flex-1 bg-red-500 text-white py-1 px-3 rounded text-sm hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ShowcaseSection>
      </div>
    </>
  );
}