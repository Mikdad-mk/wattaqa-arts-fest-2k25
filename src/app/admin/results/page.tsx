'use client';

import { useState, useEffect } from 'react';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Result, Programme, Candidate } from '@/types';

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    programme: '',
    section: '' as 'senior' | 'junior' | 'sub-junior' | 'general' | '',
    positionType: '' as 'individual' | 'group' | 'general' | '',
    firstPlace: [{ chestNumber: '', grade: undefined }],
    secondPlace: [{ chestNumber: '', grade: undefined }],
    thirdPlace: [{ chestNumber: '', grade: undefined }],
    firstPoints: 10,
    secondPoints: 7,
    thirdPoints: 5,
    notes: ''
  });

  // Filter out blank/empty results
  const filterValidResults = (results: Result[]) => {
    return results.filter(result => 
      result.programme && 
      result.programme.trim() !== '' &&
      result.section && 
      result.section.trim() !== ''
    );
  };

  // Fetch results, programmes, and candidates from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const [resultsRes, programmesRes, candidatesRes] = await Promise.all([
        fetch('/api/results'),
        fetch('/api/programmes'),
        fetch('/api/candidates')
      ]);
      
      const [resultsData, programmesData, candidatesData] = await Promise.all([
        resultsRes.json(),
        programmesRes.json(),
        candidatesRes.json()
      ]);
      
      // Filter out blank/empty results
      const validResults = filterValidResults(resultsData);
      
      setResults(validResults);
      setProgrammes(programmesData);
      setCandidates(candidatesData);
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
    
    if (!formData.programme || !formData.section || !formData.positionType) {
      alert('Please fill in all required fields');
      return;
    }

    // Filter out empty winners (only chest number is required)
    const submitData = {
      ...formData,
      firstPlace: formData.firstPlace.filter(winner => winner.chestNumber.trim() !== ''),
      secondPlace: formData.secondPlace.filter(winner => winner.chestNumber.trim() !== ''),
      thirdPlace: formData.thirdPlace.filter(winner => winner.chestNumber.trim() !== '')
    };

    try {
      setSubmitting(true);
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        // Reset form
        setFormData({
          programme: '',
          section: '' as 'senior' | 'junior' | 'sub-junior' | 'general' | '',
          positionType: '' as 'individual' | 'group' | 'general' | '',
          firstPlace: [{ chestNumber: '', grade: undefined }],
          secondPlace: [{ chestNumber: '', grade: undefined }],
          thirdPlace: [{ chestNumber: '', grade: undefined }],
          firstPoints: 10,
          secondPoints: 7,
          thirdPoints: 5,
          notes: ''
        });
        
        // Refresh results list
        await fetchData();
        alert('Result added successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Error adding result');
      }
    } catch (error) {
      console.error('Error adding result:', error);
      alert('Error adding result');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Points') ? parseInt(value) || 0 : value
    }));
  };

  // Handle winner chest number changes
  const handleWinnerChestNumberChange = (position: 'firstPlace' | 'secondPlace' | 'thirdPlace', index: number, chestNumber: string) => {
    setFormData(prev => ({
      ...prev,
      [position]: prev[position].map((winner, i) => 
        i === index ? { ...winner, chestNumber } : winner
      )
    }));
  };

  // Handle winner grade changes
  const handleWinnerGradeChange = (position: 'firstPlace' | 'secondPlace' | 'thirdPlace', index: number, grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | '') => {
    setFormData(prev => ({
      ...prev,
      [position]: prev[position].map((winner, i) => 
        i === index ? { ...winner, grade: grade === '' ? undefined : grade } : winner
      )
    }));
  };

  // Add winner field
  const addWinner = (position: 'firstPlace' | 'secondPlace' | 'thirdPlace') => {
    setFormData(prev => ({
      ...prev,
      [position]: [...prev[position], { chestNumber: '', grade: undefined }]
    }));
  };

  // Remove winner field
  const removeWinner = (position: 'firstPlace' | 'secondPlace' | 'thirdPlace', index: number) => {
    if (formData[position].length > 1) {
      setFormData(prev => ({
        ...prev,
        [position]: prev[position].filter((_, i) => i !== index)
      }));
    }
  };

  // Get candidates filtered by grade
  const getCandidatesByGrade = (grade: string) => {
    if (!grade) return [];
    return candidates.filter(candidate => candidate.grade === grade);
  };

  // Validate chest number for specific grade (grade is optional)
  const isValidChestNumber = (chestNumber: string, grade?: string) => {
    if (!chestNumber.trim()) return true; // Allow empty chest numbers
    if (!grade) {
      // If no grade specified, check if chest number exists in any grade
      return candidates.some(candidate => candidate.chestNumber === chestNumber.trim());
    }
    // If grade specified, check if chest number exists in that grade
    return getCandidatesByGrade(grade).some(candidate => candidate.chestNumber === chestNumber.trim());
  };

  // Handle delete result
  const handleDelete = async (resultId: string, programmeName: string) => {
    if (!confirm(`Are you sure you want to delete the result for "${programmeName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(resultId);
      const response = await fetch(`/api/results?id=${resultId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchData(); // Refresh the list
        alert('Result deleted successfully!');
      } else {
        const error = await response.json();
        alert(`Error deleting result: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting result:', error);
      alert('Error deleting result');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <>
        <Breadcrumb pageName="Results" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Results" />

      <div className="space-y-6">
        {/* Add New Result */}
        <ShowcaseSection title="Add New Result">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Programme *
                </label>
                <select
                  name="programme"
                  value={formData.programme}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  required
                >
                  <option value="">Select programme</option>
                  {programmes.map((programme) => (
                    <option key={programme._id?.toString()} value={`${programme.code} - ${programme.name}`}>
                      {programme.code} - {programme.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section *
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position Type *
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

            {/* Winners */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* First Place Winners */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    🥇 First Place Winners
                  </label>
                  <button
                    type="button"
                    onClick={() => addWinner('firstPlace')}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    + Add More
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.firstPlace.map((winner, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <select
                          value={winner.grade || ''}
                          onChange={(e) => handleWinnerGradeChange('firstPlace', index, e.target.value as 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | '')}
                          className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700 text-sm"
                        >
                          <option value="">Any</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                          <option value="E">E</option>
                          <option value="F">F</option>
                        </select>
                        <input
                          type="text"
                          value={winner.chestNumber}
                          onChange={(e) => handleWinnerChestNumberChange('firstPlace', index, e.target.value)}
                          placeholder="Chest number"
                          className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700 ${
                            winner.chestNumber && !isValidChestNumber(winner.chestNumber, winner.grade) ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                        {formData.firstPlace.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeWinner('firstPlace', index)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-2 rounded text-sm transition-colors"
                          >
                            ×
                          </button>
                        )}
                      </div>
                      {winner.grade && (
                        <div className="text-xs text-gray-600">
                          Available: {getCandidatesByGrade(winner.grade).map(c => c.chestNumber).join(', ') || 'None'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Second Place Winners */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    🥈 Second Place Winners
                  </label>
                  <button
                    type="button"
                    onClick={() => addWinner('secondPlace')}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    + Add More
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.secondPlace.map((winner, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <select
                          value={winner.grade}
                          onChange={(e) => handleWinnerGradeChange('secondPlace', index, e.target.value as 'A' | 'B' | 'C' | 'D' | 'E' | 'F')}
                          className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700 text-sm"
                          required
                        >
                          <option value="">Grade</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                          <option value="E">E</option>
                          <option value="F">F</option>
                        </select>
                        <input
                          type="text"
                          value={winner.chestNumber}
                          onChange={(e) => handleWinnerChestNumberChange('secondPlace', index, e.target.value)}
                          placeholder="Chest number"
                          className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700 ${
                            winner.chestNumber && !isValidChestNumber(winner.chestNumber, winner.grade) ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          disabled={!winner.grade}
                        />
                        {formData.secondPlace.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeWinner('secondPlace', index)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-2 rounded text-sm transition-colors"
                          >
                            ×
                          </button>
                        )}
                      </div>
                      {winner.grade && (
                        <div className="text-xs text-gray-600">
                          Available: {getCandidatesByGrade(winner.grade).map(c => c.chestNumber).join(', ') || 'None'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Third Place Winners */}
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    🥉 Third Place Winners
                  </label>
                  <button
                    type="button"
                    onClick={() => addWinner('thirdPlace')}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    + Add More
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.thirdPlace.map((winner, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <select
                          value={winner.grade}
                          onChange={(e) => handleWinnerGradeChange('thirdPlace', index, e.target.value as 'A' | 'B' | 'C' | 'D' | 'E' | 'F')}
                          className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700 text-sm"
                          required
                        >
                          <option value="">Grade</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                          <option value="E">E</option>
                          <option value="F">F</option>
                        </select>
                        <input
                          type="text"
                          value={winner.chestNumber}
                          onChange={(e) => handleWinnerChestNumberChange('thirdPlace', index, e.target.value)}
                          placeholder="Chest number"
                          className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700 ${
                            winner.chestNumber && !isValidChestNumber(winner.chestNumber, winner.grade) ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          disabled={!winner.grade}
                        />
                        {formData.thirdPlace.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeWinner('thirdPlace', index)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-2 rounded text-sm transition-colors"
                          >
                            ×
                          </button>
                        )}
                      </div>
                      {winner.grade && (
                        <div className="text-xs text-gray-600">
                          Available: {getCandidatesByGrade(winner.grade).map(c => c.chestNumber).join(', ') || 'None'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>



            {/* Points */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points (1st Place)
                </label>
                <input
                  type="number"
                  name="firstPoints"
                  value={formData.firstPoints}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points (2nd Place)
                </label>
                <input
                  type="number"
                  name="secondPoints"
                  value={formData.secondPoints}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points (3rd Place)
                </label>
                <input
                  type="number"
                  name="thirdPoints"
                  value={formData.thirdPoints}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Enter any additional notes"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg disabled:opacity-50"
            >
              {submitting ? 'Adding Result...' : 'Add Result'}
            </button>
          </form>
        </ShowcaseSection>

        {/* Results List */}
        <ShowcaseSection title="Results List">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading results...</p>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No results found. Add your first result above!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Programme</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Section</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Position Type</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">🥇 First</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">🥈 Second</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">🥉 Third</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result._id?.toString()} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{result.programme}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                          {result.section.charAt(0).toUpperCase() + result.section.slice(1).replace('-', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
                          {result.positionType.charAt(0).toUpperCase() + result.positionType.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          {result.firstPlace && result.firstPlace.length > 0 ? (
                            <div>
                              {result.firstPlace.map((winner, index) => (
                                <div key={index} className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-gray-900">{winner.chestNumber}</span>
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                                    {winner.grade}
                                  </span>
                                </div>
                              ))}
                              <p className="text-gray-500">{result.firstPoints} pts each</p>
                            </div>
                          ) : (
                            <p className="text-gray-400">-</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          {result.secondPlace && result.secondPlace.length > 0 ? (
                            <div>
                              {result.secondPlace.map((winner, index) => (
                                <div key={index} className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-gray-900">{winner.chestNumber}</span>
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                                    {winner.grade}
                                  </span>
                                </div>
                              ))}
                              <p className="text-gray-500">{result.secondPoints} pts each</p>
                            </div>
                          ) : (
                            <p className="text-gray-400">-</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          {result.thirdPlace && result.thirdPlace.length > 0 ? (
                            <div>
                              {result.thirdPlace.map((winner, index) => (
                                <div key={index} className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-gray-900">{winner.chestNumber}</span>
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                                    {winner.grade}
                                  </span>
                                </div>
                              ))}
                              <p className="text-gray-500">{result.thirdPoints} pts each</p>
                            </div>
                          ) : (
                            <p className="text-gray-400">-</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                          <button 
                            onClick={() => handleDelete(result._id!.toString(), result.programme)}
                            disabled={deleting === result._id?.toString()}
                            className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                          >
                            {deleting === result._id?.toString() ? 'Deleting...' : 'Delete'}
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