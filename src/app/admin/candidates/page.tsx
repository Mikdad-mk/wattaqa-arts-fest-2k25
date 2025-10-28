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
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter candidate full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID
                </label>
                <input
                  type="text"
                  placeholder="Enter student ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Assignment
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
                  Class/Grade
                </label>
                <input
                  type="text"
                  placeholder="Enter class or grade"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialties/Skills
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['Arts', 'Sports', 'Music', 'Dance', 'Drama', 'Literature', 'Photography', 'Crafts'].map((skill) => (
                  <label key={skill} className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm text-gray-700">{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Add Candidate
            </button>
          </form>
        </ShowcaseSection>

        {/* Candidates List */}
        <ShowcaseSection title="Candidates List">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                <tr className="border-b-2 border-blue-200">
                  <th className="text-left py-4 px-4 font-bold text-blue-700">Name</th>
                  <th className="text-left py-4 px-4 font-bold text-blue-700">Student ID</th>
                  <th className="text-left py-4 px-4 font-bold text-blue-700">Team</th>
                  <th className="text-left py-4 px-4 font-bold text-blue-700">Class</th>
                  <th className="text-left py-4 px-4 font-bold text-blue-700">Skills</th>
                  <th className="text-left py-4 px-4 font-bold text-blue-700">Status</th>
                  <th className="text-left py-4 px-4 font-bold text-blue-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-xs font-bold text-white">AA</span>
                      </div>
                      <span className="font-bold text-green-700">Ahmed Ali</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-green-600 font-medium">STU001</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200">
                      Team Sumud
                    </span>
                  </td>
                  <td className="py-3 px-4 text-green-600 font-medium">Grade 10</td>
                  <td className="py-3 px-4 text-green-600 font-medium">Arts, Music</td>
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
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-xs font-bold text-white">FH</span>
                      </div>
                      <span className="font-bold text-blue-700">Fatima Hassan</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-blue-600 font-medium">STU002</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200">
                      Team Aqsa
                    </span>
                  </td>
                  <td className="py-3 px-4 text-blue-600 font-medium">Grade 11</td>
                  <td className="py-3 px-4 text-blue-600 font-medium">Dance, Drama</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-lg">
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
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-rose-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-xs font-bold text-white">OK</span>
                      </div>
                      <span className="font-bold text-red-700">Omar Khalil</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-red-600 font-medium">STU003</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200">
                      Team Inthifada
                    </span>
                  </td>
                  <td className="py-3 px-4 text-red-600 font-medium">Grade 12</td>
                  <td className="py-3 px-4 text-red-600 font-medium">Sports, Photography</td>
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