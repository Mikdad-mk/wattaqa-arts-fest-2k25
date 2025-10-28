'use client';

import { useState, useEffect } from 'react';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Programme } from '@/types';

export default function ProgrammesPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: '' as 'arts' | 'sports' | '',
    section: '' as 'senior' | 'junior' | 'sub-junior' | 'general' | '',
    positionType: '' as 'individual' | 'group' | 'general' | ''
  });

  // Filter out blank/empty programmes
  const filterValidProgrammes = (programmes: Programme[]) => {
    return programmes.filter(programme => 
      programme.name && 
      programme.name.trim() !== '' &&
      programme.code && 
      programme.code.trim() !== '' &&
      programme.category && 
      programme.category.trim() !== '' &&
      programme.section && 
      programme.section.trim() !== '' &&
      programme.positionType && 
      programme.positionType.trim() !== ''
    );
  };

  // Fetch programmes from API
  const fetchProgrammes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/programmes');
      const data = await response.json();
      
      // Filter out blank/empty programmes
      const validProgrammes = filterValidProgrammes(data);
      
      setProgrammes(validProgrammes);
    } catch (error) {
      console.error('Error fetching programmes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgrammes();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.name || !formData.category || !formData.section || !formData.positionType) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/programmes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          status: 'active'
        }),
      });

      if (response.ok) {
        // Reset form
        setFormData({
          code: '',
          name: '',
          category: '' as 'arts' | 'sports' | '',
          section: '' as 'senior' | 'junior' | 'sub-junior' | 'general' | '',
          positionType: '' as 'individual' | 'group' | 'general' | ''
        });
        
        // Refresh programmes list
        await fetchProgrammes();
        alert('Programme added successfully!');
      } else {
        alert('Error adding programme');
      }
    } catch (error) {
      console.error('Error adding programme:', error);
      alert('Error adding programme');
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

  // Get category icon
  const getCategoryIcon = (category: string | null | undefined) => {
    if (!category) return '❓';
    return category === 'arts' ? '🎨' : '⚽';
  };

  // Get category color
  const getCategoryColor = (category: string | null | undefined) => {
    if (!category) return 'bg-gray-100 text-gray-800';
    return category === 'arts' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };
  return (
    <>
      <Breadcrumb pageName="Programmes" />

      <div className="space-y-6">
        {/* Add New Programme */}
        <ShowcaseSection title="Add New Programme">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Programme Code
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="Enter programme code (e.g., P001)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Programme Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter programme name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  required
                >
                  <option value="">Select category</option>
                  <option value="arts">Arts</option>
                  <option value="sports">Sports</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <option value="general">General</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position Type
                </label>
                <select 
                  name="positionType"
                  value={formData.positionType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  required
                >
                  <option value="">Select position type</option>
                  <option value="individual">Individual</option>
                  <option value="group">Group</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              {submitting ? 'Adding Programme...' : 'Add Programme'}
            </button>
          </form>
        </ShowcaseSection>

        {/* Programmes List */}
        <ShowcaseSection title="Programmes List">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading programmes...</p>
              </div>
            </div>
          ) : programmes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No programmes found. Add your first programme above!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Code</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Programme Name</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Category</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Section</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Position</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Status</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {programmes.map((programme) => (
                    <tr key={programme._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900 font-bold">{programme.code}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs">{getCategoryIcon(programme.category)}</span>
                          </div>
                          <span className="font-medium text-gray-900">{programme.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(programme.category)}`}>
                          {programme.category ? programme.category.charAt(0).toUpperCase() + programme.category.slice(1) : 'Unknown'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                          {programme.section ? programme.section.charAt(0).toUpperCase() + programme.section.slice(1).replace('-', ' ') : 'Unknown'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
                          {programme.positionType ? programme.positionType.charAt(0).toUpperCase() + programme.positionType.slice(1) : 'Unknown'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          programme.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                        }`}>
                          {programme.status ? programme.status.charAt(0).toUpperCase() + programme.status.slice(1) : 'Unknown'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                          <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">View</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ShowcaseSection>

        {/* Programme Statistics */}
        <ShowcaseSection title="Programme Statistics">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-900 mb-2">Total Programmes</h3>
              <p className="text-2xl font-bold text-gray-900">25</p>
              <p className="text-sm text-gray-600">Active programmes</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-3">👤</div>
              <h3 className="font-semibold text-gray-900 mb-2">Individual</h3>
              <p className="text-2xl font-bold text-gray-900">15</p>
              <p className="text-sm text-gray-600">Individual competitions</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-3">👥</div>
              <h3 className="font-semibold text-gray-900 mb-2">Group</h3>
              <p className="text-2xl font-bold text-gray-900">8</p>
              <p className="text-sm text-gray-600">Group competitions</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-3">🌟</div>
              <h3 className="font-semibold text-gray-900 mb-2">General</h3>
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-sm text-gray-600">General events</p>
            </div>
          </div>
        </ShowcaseSection>
      </div>
    </>
  );
}