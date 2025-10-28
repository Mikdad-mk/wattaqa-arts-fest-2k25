import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

export default function ResultsPage() {
  return (
    <>
      <Breadcrumb pageName="Results" />

      <div className="space-y-6">
        {/* Add New Result */}
        <ShowcaseSection title="Add New Result">
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event/Program
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                  <option value="">Select event</option>
                  <option value="singing">Singing Competition</option>
                  <option value="dance">Dance Performance</option>
                  <option value="drama">Drama Competition</option>
                  <option value="arts">Arts & Crafts</option>
                  <option value="sports">Sports Events</option>
                  <option value="literature">Literature</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                  <option value="">Select category</option>
                  <option value="individual">Individual</option>
                  <option value="group">Group</option>
                  <option value="team">Team</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  1st Place
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                  <option value="">Select winner</option>
                  <option value="sumud">Team Sumud</option>
                  <option value="aqsa">Team Aqsa</option>
                  <option value="inthifada">Team Inthifada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  2nd Place
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                  <option value="">Select runner-up</option>
                  <option value="sumud">Team Sumud</option>
                  <option value="aqsa">Team Aqsa</option>
                  <option value="inthifada">Team Inthifada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3rd Place
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                  <option value="">Select third place</option>
                  <option value="sumud">Team Sumud</option>
                  <option value="aqsa">Team Aqsa</option>
                  <option value="inthifada">Team Inthifada</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points (1st Place)
                </label>
                <input
                  type="number"
                  placeholder="Enter points"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points (2nd Place)
                </label>
                <input
                  type="number"
                  placeholder="Enter points"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points (3rd Place)
                </label>
                <input
                  type="number"
                  placeholder="Enter points"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes/Comments
              </label>
              <textarea
                rows={3}
                placeholder="Enter any additional notes"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Add Result
            </button>
          </form>
        </ShowcaseSection>

        {/* Recent Results */}
        <ShowcaseSection title="Recent Results">
          <div className="space-y-4">
            {/* Result Item */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">Singing Competition</h3>
                  <p className="text-sm text-gray-600">Individual Category • March 15, 2025</p>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Completed
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-2xl mb-1">🥇</div>
                  <p className="font-semibold text-gray-900">Team Aqsa</p>
                  <p className="text-sm text-gray-600">10 Points</p>
                </div>
                <div className="text-center p-3 bg-gray-100 border border-gray-200 rounded-lg">
                  <div className="text-2xl mb-1">🥈</div>
                  <p className="font-semibold text-gray-900">Team Sumud</p>
                  <p className="text-sm text-gray-600">7 Points</p>
                </div>
                <div className="text-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="text-2xl mb-1">🥉</div>
                  <p className="font-semibold text-gray-900">Team Inthifada</p>
                  <p className="text-sm text-gray-600">5 Points</p>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <button className="bg-gray-900 text-white py-1 px-3 rounded text-sm hover:bg-gray-800 transition-colors">
                  Edit
                </button>
                <button className="bg-gray-200 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-300 transition-colors">
                  View Details
                </button>
              </div>
            </div>

            {/* Another Result Item */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">Dance Performance</h3>
                  <p className="text-sm text-gray-600">Group Category • March 14, 2025</p>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Completed
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-2xl mb-1">🥇</div>
                  <p className="font-semibold text-gray-900">Team Sumud</p>
                  <p className="text-sm text-gray-600">10 Points</p>
                </div>
                <div className="text-center p-3 bg-gray-100 border border-gray-200 rounded-lg">
                  <div className="text-2xl mb-1">🥈</div>
                  <p className="font-semibold text-gray-900">Team Inthifada</p>
                  <p className="text-sm text-gray-600">7 Points</p>
                </div>
                <div className="text-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="text-2xl mb-1">🥉</div>
                  <p className="font-semibold text-gray-900">Team Aqsa</p>
                  <p className="text-sm text-gray-600">5 Points</p>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <button className="bg-gray-900 text-white py-1 px-3 rounded text-sm hover:bg-gray-800 transition-colors">
                  Edit
                </button>
                <button className="bg-gray-200 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-300 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </ShowcaseSection>
      </div>
    </>
  );
}