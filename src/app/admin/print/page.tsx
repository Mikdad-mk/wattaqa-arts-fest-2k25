import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

export default function PrintPage() {
  return (
    <>
      <Breadcrumb pageName="Print" />

      <div className="space-y-6">
        {/* Print Options */}
        <ShowcaseSection title="Print Reports & Documents">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer transform hover:scale-105">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-bold text-gray-900 mb-2">Team Rankings Report</h3>
              <p className="text-sm text-blue-600 mb-4 font-medium">Complete rankings with points and medals</p>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl">
                Generate PDF
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="text-3xl mb-3">👥</div>
              <h3 className="font-semibold text-gray-900 mb-2">Candidates List</h3>
              <p className="text-sm text-gray-600 mb-4">All registered candidates with details</p>
              <button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Generate PDF
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="text-3xl mb-3">🏆</div>
              <h3 className="font-semibold text-gray-900 mb-2">Results Summary</h3>
              <p className="text-sm text-gray-600 mb-4">All competition results and winners</p>
              <button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Generate PDF
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="text-3xl mb-3">📅</div>
              <h3 className="font-semibold text-gray-900 mb-2">Festival Schedule</h3>
              <p className="text-sm text-gray-600 mb-4">Complete event schedule and timeline</p>
              <button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Generate PDF
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="text-3xl mb-3">🎖️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Certificates</h3>
              <p className="text-sm text-gray-600 mb-4">Winner certificates and participation awards</p>
              <button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Generate PDF
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="text-3xl mb-3">📈</div>
              <h3 className="font-semibold text-gray-900 mb-2">Analytics Report</h3>
              <p className="text-sm text-gray-600 mb-4">Festival statistics and performance metrics</p>
              <button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Generate PDF
              </button>
            </div>
          </div>
        </ShowcaseSection>

        {/* Custom Report Builder */}
        <ShowcaseSection title="Custom Report Builder">
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                  <option value="">Select report type</option>
                  <option value="teams">Team Report</option>
                  <option value="candidates">Candidate Report</option>
                  <option value="results">Results Report</option>
                  <option value="events">Events Report</option>
                  <option value="custom">Custom Report</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                  <option value="">Select date range</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="festival">Entire Festival</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Filter
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                  <option value="">All Teams</option>
                  <option value="sumud">Team Sumud</option>
                  <option value="aqsa">Team Aqsa</option>
                  <option value="inthifada">Team Inthifada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Filter
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                  <option value="">All Categories</option>
                  <option value="arts">Arts</option>
                  <option value="sports">Sports</option>
                  <option value="music">Music</option>
                  <option value="dance">Dance</option>
                  <option value="drama">Drama</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Include Sections
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  'Summary Statistics',
                  'Team Rankings',
                  'Individual Results',
                  'Event Schedule',
                  'Participant Lists',
                  'Awards & Medals',
                  'Performance Charts',
                  'Photo Gallery'
                ].map((section) => (
                  <label key={section} className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className="text-sm text-gray-700">{section}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Generate Custom Report
              </button>
              <button
                type="button"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition-colors"
              >
                Preview Report
              </button>
            </div>
          </form>
        </ShowcaseSection>

        {/* Recent Print Jobs */}
        <ShowcaseSection title="Recent Print Jobs">
          <div className="space-y-3">
            {[
              { name: "Team Rankings Report", date: "March 15, 2025", status: "Completed", size: "2.4 MB" },
              { name: "Candidates List", date: "March 14, 2025", status: "Completed", size: "1.8 MB" },
              { name: "Results Summary", date: "March 14, 2025", status: "Completed", size: "3.2 MB" },
              { name: "Festival Schedule", date: "March 13, 2025", status: "Completed", size: "1.2 MB" },
              { name: "Custom Analytics Report", date: "March 13, 2025", status: "Processing", size: "..." }
            ].map((job, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center">
                    <span className="text-gray-700 text-lg">📄</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{job.name}</h3>
                    <p className="text-sm text-gray-600">{job.date} • {job.size}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    job.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    job.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {job.status}
                  </span>
                  {job.status === 'Completed' && (
                    <button className="text-gray-600 hover:text-gray-900 text-sm">
                      Download
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ShowcaseSection>

        {/* Print Settings */}
        <ShowcaseSection title="Print Settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Default Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Paper Size
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="a4">A4</option>
                    <option value="letter">Letter</option>
                    <option value="legal">Legal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Orientation
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Header & Footer</h3>
              <div className="space-y-3">
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className="text-sm text-gray-700">Include Festival Logo</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className="text-sm text-gray-700">Include Date & Time</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className="text-sm text-gray-700">Include Page Numbers</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </ShowcaseSection>
      </div>
    </>
  );
}