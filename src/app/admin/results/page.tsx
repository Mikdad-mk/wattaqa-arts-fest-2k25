'use client';

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

interface Winner {
  id: string;
  name: string;
}

export default function ResultsPage() {
  const [firstPlaceWinners, setFirstPlaceWinners] = useState<Winner[]>([{ id: '1', name: '' }]);
  const [secondPlaceWinners, setSecondPlaceWinners] = useState<Winner[]>([{ id: '1', name: '' }]);
  const [thirdPlaceWinners, setThirdPlaceWinners] = useState<Winner[]>([{ id: '1', name: '' }]);

  const addWinner = (position: 'first' | 'second' | 'third') => {
    const newId = Date.now().toString();
    const newWinner = { id: newId, name: '' };
    
    if (position === 'first') {
      setFirstPlaceWinners([...firstPlaceWinners, newWinner]);
    } else if (position === 'second') {
      setSecondPlaceWinners([...secondPlaceWinners, newWinner]);
    } else {
      setThirdPlaceWinners([...thirdPlaceWinners, newWinner]);
    }
  };

  const removeWinner = (position: 'first' | 'second' | 'third', id: string) => {
    if (position === 'first' && firstPlaceWinners.length > 1) {
      setFirstPlaceWinners(firstPlaceWinners.filter(w => w.id !== id));
    } else if (position === 'second' && secondPlaceWinners.length > 1) {
      setSecondPlaceWinners(secondPlaceWinners.filter(w => w.id !== id));
    } else if (position === 'third' && thirdPlaceWinners.length > 1) {
      setThirdPlaceWinners(thirdPlaceWinners.filter(w => w.id !== id));
    }
  };

  const updateWinner = (position: 'first' | 'second' | 'third', id: string, name: string) => {
    if (position === 'first') {
      setFirstPlaceWinners(firstPlaceWinners.map(w => w.id === id ? { ...w, name } : w));
    } else if (position === 'second') {
      setSecondPlaceWinners(secondPlaceWinners.map(w => w.id === id ? { ...w, name } : w));
    } else {
      setThirdPlaceWinners(thirdPlaceWinners.map(w => w.id === id ? { ...w, name } : w));
    }
  };

  const renderWinnerInputs = (
    winners: Winner[], 
    position: 'first' | 'second' | 'third', 
    label: string, 
    emoji: string,
    bgColor: string
  ) => (
    <div className={`p-4 ${bgColor} border border-gray-200 rounded-lg`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{emoji}</span>
          <label className="block text-sm font-medium text-gray-700">{label}</label>
        </div>
        <button
          type="button"
          onClick={() => addWinner(position)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          + Add More
        </button>
      </div>
      
      <div className="space-y-2">
        {winners.map((winner) => (
          <div key={winner.id} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Enter chest number or team name"
              value={winner.name}
              onChange={(e) => updateWinner(position, winner.id, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
            />
            {winners.length > 1 && (
              <button
                type="button"
                onClick={() => removeWinner(position, winner.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-2 rounded text-sm transition-colors"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <Breadcrumb pageName="Results" />

      {/* Single Background Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-12">
        
        {/* Add New Result Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Result</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Programme
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700">
                  <option value="">Select programme</option>
                  <option value="P001">P001 - Classical Singing</option>
                  <option value="P002">P002 - Group Dance</option>
                  <option value="P003">P003 - Football</option>
                  <option value="P004">P004 - Painting Competition</option>
                  <option value="P005">P005 - Drama Performance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700">
                  <option value="">Select section</option>
                  <option value="senior">Senior</option>
                  <option value="junior">Junior</option>
                  <option value="sub-junior">Sub Junior</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700">
                  <option value="">Select grade</option>
                  <option value="A">Grade A</option>
                  <option value="B">Grade B</option>
                  <option value="C">Grade C</option>
                  <option value="D">Grade D</option>
                  <option value="E">Grade E</option>
                  <option value="F">Grade F</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position Type
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700">
                  <option value="">Select position</option>
                  <option value="individual">Individual</option>
                  <option value="group">Group</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>

            {/* Winners Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Winners</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderWinnerInputs(firstPlaceWinners, 'first', '1st Place Winners', '🥇', 'bg-yellow-50')}
                {renderWinnerInputs(secondPlaceWinners, 'second', '2nd Place Winners', '🥈', 'bg-gray-50')}
                {renderWinnerInputs(thirdPlaceWinners, 'third', '3rd Place Winners', '🥉', 'bg-orange-50')}
              </div>
            </div>

            {/* Points Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points (1st Place)
                </label>
                <input
                  type="number"
                  placeholder="Enter points"
                  defaultValue="10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points (2nd Place)
                </label>
                <input
                  type="number"
                  placeholder="Enter points"
                  defaultValue="7"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points (3rd Place)
                </label>
                <input
                  type="number"
                  placeholder="Enter points"
                  defaultValue="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes/Comments
              </label>
              <textarea
                rows={3}
                placeholder="Enter any additional notes about the result"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Add Result
            </button>
          </form>
        </div>

        {/* Results Statistics Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Results Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-900 mb-2">Total Results</h3>
              <p className="text-2xl font-bold text-gray-900">18</p>
              <p className="text-sm text-gray-600">Completed programmes</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-3">🏆</div>
              <h3 className="font-semibold text-gray-900 mb-2">Team Sumud</h3>
              <p className="text-2xl font-bold text-green-600">125</p>
              <p className="text-sm text-gray-600">Total points</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-3">🥇</div>
              <h3 className="font-semibold text-gray-900 mb-2">Team Aqsa</h3>
              <p className="text-2xl font-bold text-gray-700">118</p>
              <p className="text-sm text-gray-600">Total points</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-gray-900 mb-2">Team Inthifada</h3>
              <p className="text-2xl font-bold text-red-600">112</p>
              <p className="text-sm text-gray-600">Total points</p>
            </div>
          </div>
        </div>

        {/* Recent Results Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Results</h2>
          <div className="space-y-4">
            {/* Result Item 1 */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800">
                      P001
                    </span>
                    <h3 className="font-semibold text-gray-900">Classical Singing</h3>
                  </div>
                  <p className="text-sm text-gray-600">Senior • Individual • March 15, 2025 at 10:00 AM</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Completed
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-3xl mb-2">🥇</div>
                  <p className="font-semibold text-gray-900">Chest No. 002</p>
                  <p className="text-sm text-gray-600 mb-1">Fatima Hassan</p>
                  <p className="text-sm font-bold text-gray-900">10 Points</p>
                </div>
                <div className="text-center p-4 bg-gray-100 border border-gray-200 rounded-lg">
                  <div className="text-3xl mb-2">🥈</div>
                  <p className="font-semibold text-gray-900">Chest No. 001</p>
                  <p className="text-sm text-gray-600 mb-1">Ahmed Ali</p>
                  <p className="text-sm font-bold text-gray-900">7 Points</p>
                </div>
                <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="text-3xl mb-2">🥉</div>
                  <p className="font-semibold text-gray-900">Chest No. 003</p>
                  <p className="text-sm text-gray-600 mb-1">Omar Khalil</p>
                  <p className="text-sm font-bold text-gray-900">5 Points</p>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <button className="bg-gray-900 text-white py-2 px-4 rounded-lg text-sm hover:bg-gray-800 transition-colors">
                  Edit Result
                </button>
                <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-300 transition-colors">
                  View Details
                </button>
              </div>
            </div>

            {/* Result Item 2 */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-purple-100 text-purple-800">
                      P002
                    </span>
                    <h3 className="font-semibold text-gray-900">Group Dance</h3>
                  </div>
                  <p className="text-sm text-gray-600">Junior • Group • March 14, 2025 at 2:00 PM</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Completed
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-3xl mb-2">🥇</div>
                  <p className="font-semibold text-gray-900">Team Sumud</p>
                  <p className="text-sm text-gray-600 mb-1">Group Performance</p>
                  <p className="text-sm font-bold text-gray-900">10 Points</p>
                </div>
                <div className="text-center p-4 bg-gray-100 border border-gray-200 rounded-lg">
                  <div className="text-3xl mb-2">🥈</div>
                  <p className="font-semibold text-gray-900">Team Inthifada</p>
                  <p className="text-sm text-gray-600 mb-1">Group Performance</p>
                  <p className="text-sm font-bold text-gray-900">7 Points</p>
                </div>
                <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="text-3xl mb-2">🥉</div>
                  <p className="font-semibold text-gray-900">Team Aqsa</p>
                  <p className="text-sm text-gray-600 mb-1">Group Performance</p>
                  <p className="text-sm font-bold text-gray-900">5 Points</p>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <button className="bg-gray-900 text-white py-2 px-4 rounded-lg text-sm hover:bg-gray-800 transition-colors">
                  Edit Result
                </button>
                <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-300 transition-colors">
                  View Details
                </button>
              </div>
            </div>

            {/* Result Item 3 */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-yellow-100 text-yellow-800">
                      P004
                    </span>
                    <h3 className="font-semibold text-gray-900">Painting Competition</h3>
                  </div>
                  <p className="text-sm text-gray-600">Sub Junior • Individual • March 13, 2025 at 9:00 AM</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Completed
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-3xl mb-2">🥇</div>
                  <p className="font-semibold text-gray-900">Chest No. 003</p>
                  <p className="text-sm text-gray-600 mb-1">Omar Khalil</p>
                  <p className="text-sm font-bold text-gray-900">10 Points</p>
                </div>
                <div className="text-center p-4 bg-gray-100 border border-gray-200 rounded-lg">
                  <div className="text-3xl mb-2">🥈</div>
                  <p className="font-semibold text-gray-900">Chest No. 002</p>
                  <p className="text-sm text-gray-600 mb-1">Fatima Hassan</p>
                  <p className="text-sm font-bold text-gray-900">7 Points</p>
                </div>
                <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="text-3xl mb-2">🥉</div>
                  <p className="font-semibold text-gray-900">Chest No. 001</p>
                  <p className="text-sm text-gray-600 mb-1">Ahmed Ali</p>
                  <p className="text-sm font-bold text-gray-900">5 Points</p>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <button className="bg-gray-900 text-white py-2 px-4 rounded-lg text-sm hover:bg-gray-800 transition-colors">
                  Edit Result
                </button>
                <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-300 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}