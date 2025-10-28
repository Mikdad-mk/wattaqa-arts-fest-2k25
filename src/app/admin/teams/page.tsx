import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

export default function TeamsPage() {
  return (
    <>
      <Breadcrumb pageName="Teams" />

      <div className="space-y-6">
        {/* Add New Team */}
        <ShowcaseSection title="Add New Team">
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  placeholder="Enter team name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Color
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                  <option value="">Select team color</option>
                  <option value="green">Green</option>
                  <option value="blue">Blue</option>
                  <option value="red">Red</option>
                  <option value="yellow">Yellow</option>
                  <option value="purple">Purple</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Description
              </label>
              <textarea
                rows={3}
                placeholder="Enter team description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Captain
              </label>
              <input
                type="text"
                placeholder="Enter team captain name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Add Team
            </button>
          </form>
        </ShowcaseSection>

        {/* Existing Teams */}
        <ShowcaseSection title="Existing Teams">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Team Sumud */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold">S</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Team Sumud</h3>
                  <p className="text-sm text-green-600">Arts & Sports Excellence</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Members:</span>
                  <span className="text-gray-900 font-medium">45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Captain:</span>
                  <span className="text-gray-900 font-medium">Ahmed Ali</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="flex-1 bg-gray-900 text-white py-1 px-3 rounded text-sm hover:bg-gray-800 transition-colors">
                  Edit
                </button>
                <button className="flex-1 bg-gray-200 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-300 transition-colors">
                  View
                </button>
              </div>
            </div>

            {/* Team Aqsa */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold">A</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Team Aqsa</h3>
                  <p className="text-sm text-blue-600">Creative & Athletic</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Members:</span>
                  <span className="text-gray-900 font-medium">45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Captain:</span>
                  <span className="text-gray-900 font-medium">Fatima Hassan</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="flex-1 bg-gray-900 text-white py-1 px-3 rounded text-sm hover:bg-gray-800 transition-colors">
                  Edit
                </button>
                <button className="flex-1 bg-gray-200 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-300 transition-colors">
                  View
                </button>
              </div>
            </div>

            {/* Team Inthifada */}
            <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-rose-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold">I</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Team Inthifada</h3>
                  <p className="text-sm text-red-600">Innovation & Competition</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Members:</span>
                  <span className="text-gray-900 font-medium">45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Captain:</span>
                  <span className="text-gray-900 font-medium">Omar Khalil</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="flex-1 bg-gray-900 text-white py-1 px-3 rounded text-sm hover:bg-gray-800 transition-colors">
                  Edit
                </button>
                <button className="flex-1 bg-gray-200 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-300 transition-colors">
                  View
                </button>
              </div>
            </div>
          </div>
        </ShowcaseSection>
      </div>
    </>
  );
}