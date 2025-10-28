import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

export default function CandidatesPage() {
  return (
    <>
      <Breadcrumb pageName="Candidates" />

      <div className="space-y-6">
        {/* Add New Candidate */}
        <ShowcaseSection title="Add New Candidate">
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chest Number
                </label>
                <input
                  type="text"
                  placeholder="Enter chest number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter candidate full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                  <option value="">Select team</option>
                  <option value="sumud">Team Sumud</option>
                  <option value="aqsa">Team Aqsa</option>
                  <option value="inthifada">Team Inthifada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                  <option value="">Select section</option>
                  <option value="junior">Junior</option>
                  <option value="sub-junior">Sub Junior</option>
                  <option value="senior">Senior</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Add Candidate
            </button>
          </form>
        </ShowcaseSection>

        {/* Candidates List */}
        <ShowcaseSection title="Candidates List">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Chest No.</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Name</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Team</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Section</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Status</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-bold">001</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-xs font-bold text-white">AA</span>
                      </div>
                      <span className="font-bold text-green-700">Ahmed Ali</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200">
                      Team Sumud
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700 font-medium">Senior</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg">
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
                  <td className="py-3 px-4 text-gray-900 font-bold">002</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-xs font-bold text-white">FH</span>
                      </div>
                      <span className="font-bold text-gray-800">Fatima Hassan</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300">
                      Team Aqsa
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700 font-medium">Junior</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg">
                      Active
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium">Edit</button>
                      <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">View</button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-bold">003</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-rose-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-xs font-bold text-white">OK</span>
                      </div>
                      <span className="font-bold text-red-700">Omar Khalil</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200">
                      Team Inthifada
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700 font-medium">Sub Junior</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-400 to-rose-500 text-white shadow-lg">
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
      </div>
    </>
  );
}