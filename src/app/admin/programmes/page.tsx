import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

export default function ProgrammesPage() {
  return (
    <>
      <Breadcrumb pageName="Programmes" />

      <div className="space-y-6">
        {/* Add New Programme */}
        <ShowcaseSection title="Add New Programme">
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Programme Code
                </label>
                <input
                  type="text"
                  placeholder="Enter programme code (e.g., P001)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Programme Name
                </label>
                <input
                  type="text"
                  placeholder="Enter programme name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                  <option value="">Select section</option>
                  <option value="senior">Senior</option>
                  <option value="sub-junior">Sub Junior</option>
                  <option value="junior">Junior</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                  <option value="">Select position</option>
                  <option value="individual">Individual</option>
                  <option value="group">Group</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Add Programme
            </button>
          </form>
        </ShowcaseSection>

        {/* Programmes List */}
        <ShowcaseSection title="Programmes List">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Code</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Programme Name</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Section</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Position</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Status</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-bold">P001</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">🎵</span>
                      </div>
                      <span className="font-medium text-gray-900">Classical Singing</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                      Senior
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                      Individual
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
                      Active
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                      <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">View</button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-bold">P002</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">💃</span>
                      </div>
                      <span className="font-medium text-gray-900">Group Dance</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                      Junior
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
                      Group
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
                      Active
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                      <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">View</button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-bold">P003</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">⚽</span>
                      </div>
                      <span className="font-medium text-gray-900">Football</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200">
                      General
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
                      Group
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
                      Active
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                      <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">View</button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-bold">P004</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">🎨</span>
                      </div>
                      <span className="font-medium text-gray-900">Painting Competition</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">
                      Sub Junior
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                      Individual
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
                      Active
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                      <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">View</button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-bold">P005</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">🎭</span>
                      </div>
                      <span className="font-medium text-gray-900">Drama Performance</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                      Senior
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
                      Group
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
                      Active
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                      <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">View</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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