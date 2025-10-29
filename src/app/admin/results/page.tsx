'use client';

import { useState, useEffect } from 'react';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Result, Programme, Candidate, ProgrammeParticipant } from '@/types';

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [participants, setParticipants] = useState<ProgrammeParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  
  // Enhanced form state
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [filteredParticipants, setFilteredParticipants] = useState<any[]>([]);
  const [showParticipants, setShowParticipants] = useState(false);
  
  const [formData, setFormData] = useState({
    programme: '',
    section: '' as 'senior' | 'junior' | 'sub-junior' | 'general' | '',
    positionType: '' as 'individual' | 'group' | 'general' | '',
    firstPlace: [] as string[],
    secondPlace: [] as string[],
    thirdPlace: [] as string[],
    participationGrades: [] as { chestNumber: string; grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'; points: number }[],
    firstPoints: 10,
    secondPoints: 7,
    thirdPoints: 5,
    participationPoints: 2,
    notes: ''
  });

  // Fetch data from APIs
  const fetchData = async () => {
    try {
      setLoading(true);
      const [resultsRes, programmesRes, candidatesRes, participantsRes] = await Promise.all([
        fetch('/api/results'),
        fetch('/api/programmes'),
        fetch('/api/candidates'),
        fetch('/api/programme-participants')
      ]);
      
      const [resultsData, programmesData, candidatesData, participantsData] = await Promise.all([
        resultsRes.json(),
        programmesRes.json(),
        candidatesRes.json(),
        participantsRes.json()
      ]);
      
      setResults(resultsData);
      setProgrammes(programmesData);
      setCandidates(candidatesData);
      setParticipants(participantsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle programme selection
  const handleProgrammeSelection = (programmeId: string) => {
    const programme = programmes.find(p => p._id?.toString() === programmeId);
    setSelectedProgramme(programme || null);
    setSelectedSection('');
    setFilteredParticipants([]);
    setShowParticipants(false);
    
    if (programme) {
      setFormData(prev => ({
        ...prev,
        programme: `${programme.code} - ${programme.name}`,
        positionType: programme.positionType || 'individual'
      }));
    }
  };

  // Handle section selection
  const handleSectionSelection = (section: string) => {
    setSelectedSection(section);
    setFormData(prev => ({ ...prev, section: section as any }));
    
    if (selectedProgramme && section) {
      // Filter participants for this programme and section
      const programmeParticipants = participants.filter(p => 
        p.programmeId === selectedProgramme._id?.toString()
      );
      
      // Get detailed participant info
      const detailedParticipants = programmeParticipants.flatMap(pp => 
        pp.participants.map(chestNumber => {
          const candidate = candidates.find(c => c.chestNumber === chestNumber);
          return {
            chestNumber,
            candidate,
            teamCode: pp.teamCode,
            programmeName: pp.programmeName,
            programmeCode: pp.programmeCode
          };
        })
      ).filter(p => p.candidate && (section === 'general' || p.candidate.section === section));
      
      setFilteredParticipants(detailedParticipants);
      setShowParticipants(true);
    }
  };

  // Check if participant is assigned
  const isParticipantAssigned = (chestNumber: string) => {
    return [
      ...formData.firstPlace,
      ...formData.secondPlace,
      ...formData.thirdPlace,
      ...formData.participationGrades.map(pg => pg.chestNumber)
    ].includes(chestNumber);
  };

  // Add/remove from position
  const togglePosition = (position: 'firstPlace' | 'secondPlace' | 'thirdPlace', chestNumber: string) => {
    setFormData(prev => ({
      ...prev,
      [position]: prev[position].includes(chestNumber)
        ? prev[position].filter(cn => cn !== chestNumber)
        : [...prev[position], chestNumber]
    }));
  };

  // Add participation grade
  const addParticipationGrade = (chestNumber: string, grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F', points: number) => {
    setFormData(prev => ({
      ...prev,
      participationGrades: [
        ...prev.participationGrades.filter(pg => pg.chestNumber !== chestNumber),
        { chestNumber, grade, points }
      ]
    }));
  };

  // Remove participation grade
  const removeParticipationGrade = (chestNumber: string) => {
    setFormData(prev => ({
      ...prev,
      participationGrades: prev.participationGrades.filter(pg => pg.chestNumber !== chestNumber)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.programme || !formData.section || !formData.positionType) {
      alert('Please fill in all required fields');
      return;
    }

    const submitData = {
      ...formData,
      firstPlace: formData.firstPlace.map(cn => ({ chestNumber: cn })),
      secondPlace: formData.secondPlace.map(cn => ({ chestNumber: cn })),
      thirdPlace: formData.thirdPlace.map(cn => ({ chestNumber: cn })),
      participationGrades: formData.participationGrades
    };

    try {
      setSubmitting(true);
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        // Reset form
        setFormData({
          programme: '',
          section: '' as any,
          positionType: '' as any,
          firstPlace: [],
          secondPlace: [],
          thirdPlace: [],
          participationGrades: [],
          firstPoints: 10,
          secondPoints: 7,
          thirdPoints: 5,
          participationPoints: 2,
          notes: ''
        });
        setSelectedProgramme(null);
        setSelectedSection('');
        setFilteredParticipants([]);
        setShowParticipants(false);
        
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

  // Handle delete
  const handleDelete = async (resultId: string, programmeName: string) => {
    if (!confirm(`Are you sure you want to delete the result for "${programmeName}"?`)) {
      return;
    }

    try {
      setDeleting(resultId);
      const response = await fetch(`/api/results?id=${resultId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchData();
        alert('Result deleted successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
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
            {/* Programme and Section Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Programme *
                </label>
                <select
                  value={selectedProgramme?._id?.toString() || ''}
                  onChange={(e) => handleProgrammeSelection(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  required
                >
                  <option value="">Select programme</option>
                  {programmes.map((programme) => (
                    <option key={programme._id?.toString()} value={programme._id?.toString()}>
                      {programme.code} - {programme.name} ({programme.category})
                    </option>
                  ))}
                </select>
                {selectedProgramme && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm text-blue-800">
                      <p><strong>Category:</strong> {selectedProgramme.category}</p>
                      <p><strong>Position Type:</strong> {selectedProgramme.positionType}</p>
                      <p><strong>Required Participants:</strong> {selectedProgramme.requiredParticipants}</p>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section *
                </label>
                <select
                  value={selectedSection}
                  onChange={(e) => handleSectionSelection(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  required
                  disabled={!selectedProgramme}
                >
                  <option value="">Select section</option>
                  <option value="senior">Senior</option>
                  <option value="junior">Junior</option>
                  <option value="sub-junior">Sub Junior</option>
                  <option value="general">General</option>
                </select>
                {selectedSection && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-sm text-green-800">
                      <p><strong>Selected Section:</strong> {selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1).replace('-', ' ')}</p>
                      {showParticipants && (
                        <p><strong>Registered Participants:</strong> {filteredParticipants.length}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Registered Participants Display */}
            {showParticipants && filteredParticipants.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">👥</span>
                  Registered Participants ({filteredParticipants.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredParticipants.map((participant, index) => {
                    const isAssigned = isParticipantAssigned(participant.chestNumber);
                    const isFirst = formData.firstPlace.includes(participant.chestNumber);
                    const isSecond = formData.secondPlace.includes(participant.chestNumber);
                    const isThird = formData.thirdPlace.includes(participant.chestNumber);
                    const participationGrade = formData.participationGrades.find(pg => pg.chestNumber === participant.chestNumber);
                    
                    return (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          isAssigned
                            ? 'border-green-300 bg-green-50'
                            : 'border-gray-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-bold text-gray-900 font-mono">
                              {participant.chestNumber}
                            </div>
                            <div className="text-sm text-gray-700">
                              {participant.candidate?.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {participant.teamCode} • {participant.candidate?.section} section
                            </div>
                          </div>
                          {isAssigned && (
                            <div className="text-green-600 font-bold text-sm">
                              ✅
                            </div>
                          )}
                        </div>
                        
                        {/* Position Buttons */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          <button
                            type="button"
                            onClick={() => togglePosition('firstPlace', participant.chestNumber)}
                            className={`px-2 py-1 text-xs rounded ${
                              isFirst ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            }`}
                          >
                            🥇 1st
                          </button>
                          <button
                            type="button"
                            onClick={() => togglePosition('secondPlace', participant.chestNumber)}
                            className={`px-2 py-1 text-xs rounded ${
                              isSecond ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            🥈 2nd
                          </button>
                          <button
                            type="button"
                            onClick={() => togglePosition('thirdPlace', participant.chestNumber)}
                            className={`px-2 py-1 text-xs rounded ${
                              isThird ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                            }`}
                          >
                            🥉 3rd
                          </button>
                        </div>
                        
                        {/* Participation Grade */}
                        <div className="flex items-center space-x-1">
                          <select
                            value={participationGrade?.grade || ''}
                            onChange={(e) => {
                              if (e.target.value) {
                                addParticipationGrade(
                                  participant.chestNumber, 
                                  e.target.value as 'A' | 'B' | 'C' | 'D' | 'E' | 'F',
                                  formData.participationPoints
                                );
                              } else {
                                removeParticipationGrade(participant.chestNumber);
                              }
                            }}
                            className="text-xs px-1 py-1 border border-gray-300 rounded bg-white"
                          >
                            <option value="">Grade</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="E">E</option>
                            <option value="F">F</option>
                          </select>
                          {participationGrade && (
                            <input
                              type="number"
                              value={participationGrade.points}
                              onChange={(e) => addParticipationGrade(
                                participant.chestNumber, 
                                participationGrade.grade, 
                                parseInt(e.target.value) || 0
                              )}
                              className="text-xs px-1 py-1 border border-gray-300 rounded bg-white w-12"
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {showParticipants && filteredParticipants.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <div className="text-yellow-600 text-4xl mb-2">⚠️</div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Participants Found</h3>
                <p className="text-yellow-700">
                  No teams have registered for this programme in the selected section.
                </p>
              </div>
            )}

            {/* Points Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points (1st Place)
                </label>
                <input
                  type="number"
                  value={formData.firstPoints}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstPoints: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points (2nd Place)
                </label>
                <input
                  type="number"
                  value={formData.secondPoints}
                  onChange={(e) => setFormData(prev => ({ ...prev, secondPoints: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points (3rd Place)
                </label>
                <input
                  type="number"
                  value={formData.thirdPoints}
                  onChange={(e) => setFormData(prev => ({ ...prev, thirdPoints: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points (Participation)
                </label>
                <input
                  type="number"
                  value={formData.participationPoints}
                  onChange={(e) => setFormData(prev => ({ ...prev, participationPoints: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-700"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                placeholder="Enter any additional notes"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !showParticipants}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg disabled:opacity-50"
            >
              {submitting ? 'Adding Result...' : 'Add Result'}
            </button>
          </form>
        </ShowcaseSection>

        {/* Results List */}
        <ShowcaseSection title="Results List">
          {results.length === 0 ? (
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
                    <th className="text-left py-4 px-4 font-bold text-gray-700">🥇 First</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">🥈 Second</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">🥉 Third</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">🎖️ Participation</th>
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
                        <div className="text-sm">
                          {result.firstPlace && result.firstPlace.length > 0 ? (
                            <div>
                              {result.firstPlace.map((winner, index) => (
                                <div key={index} className="mb-1">
                                  <span className="font-medium text-gray-900">{winner.chestNumber}</span>
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
                                <div key={index} className="mb-1">
                                  <span className="font-medium text-gray-900">{winner.chestNumber}</span>
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
                                <div key={index} className="mb-1">
                                  <span className="font-medium text-gray-900">{winner.chestNumber}</span>
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
                        <div className="text-sm">
                          {result.participationGrades && result.participationGrades.length > 0 ? (
                            <div>
                              {result.participationGrades.map((pg, index) => (
                                <div key={index} className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-gray-900">{pg.chestNumber}</span>
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                                    {pg.grade}
                                  </span>
                                  <span className="text-xs text-gray-500">({pg.points} pts)</span>
                                </div>
                              ))}
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