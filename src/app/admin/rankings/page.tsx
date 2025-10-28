import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

export default function RankingsPage() {
  // Sample data for charts
  const teamData = [
    { name: "Team Aqsa", points: 245, color: "bg-gray-600", percentage: 100 },
    { name: "Team Sumud", points: 238, color: "bg-green-500", percentage: 97 },
    { name: "Team Inthifada", points: 232, color: "bg-red-500", percentage: 95 }
  ];

  const sectionData = {
    senior: [
      { name: "Team Aqsa", points: 85, percentage: 100, color: "bg-gray-600" },
      { name: "Team Sumud", points: 82, percentage: 96, color: "bg-green-500" },
      { name: "Team Inthifada", points: 78, percentage: 92, color: "bg-red-500" }
    ],
    junior: [
      { name: "Team Sumud", points: 92, percentage: 100, color: "bg-green-500" },
      { name: "Team Aqsa", points: 88, percentage: 96, color: "bg-gray-600" },
      { name: "Team Inthifada", points: 85, percentage: 92, color: "bg-red-500" }
    ],
    subJunior: [
      { name: "Team Inthifada", points: 69, percentage: 100, color: "bg-red-500" },
      { name: "Team Aqsa", points: 72, percentage: 97, color: "bg-gray-600" },
      { name: "Team Sumud", points: 64, percentage: 93, color: "bg-green-500" }
    ],
    general: [
      { name: "Team Aqsa", points: 45, percentage: 100, color: "bg-gray-600" },
      { name: "Team Sumud", points: 42, percentage: 93, color: "bg-green-500" },
      { name: "Team Inthifada", points: 38, percentage: 84, color: "bg-red-500" }
    ]
  };

  const categoryData = {
    arts: [
      { name: "Team Aqsa", points: 95, percentage: 100, color: "bg-gray-600" },
      { name: "Team Sumud", points: 88, percentage: 93, color: "bg-green-500" },
      { name: "Team Inthifada", points: 82, percentage: 86, color: "bg-red-500" }
    ],
    sports: [
      { name: "Team Sumud", points: 92, percentage: 100, color: "bg-green-500" },
      { name: "Team Inthifada", points: 89, percentage: 97, color: "bg-red-500" },
      { name: "Team Aqsa", points: 85, percentage: 92, color: "bg-gray-600" }
    ]
  };

  const renderBarChart = (data: any[], title: string) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{item.name}</span>
              <span className="text-sm font-bold text-gray-900">{item.points} pts</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full ${item.color} transition-all duration-1000 ease-out`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <Breadcrumb pageName="Rank & Top" />

      <div className="space-y-6">
        {/* Overall Team Rankings Chart */}
        <ShowcaseSection title="Overall Team Rankings - Visual Chart">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Team Points Comparison</h3>
              <div className="flex items-end justify-between h-64 space-x-4">
                {teamData.map((team, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="w-full flex flex-col items-center">
                      <div 
                        className={`w-full ${team.color} rounded-t-lg transition-all duration-1000 ease-out flex items-end justify-center pb-2`}
                        style={{ height: `${(team.points / 245) * 200}px` }}
                      >
                        <span className="text-white font-bold text-sm">{team.points}</span>
                      </div>
                      <div className="mt-2 text-center">
                        <p className="text-xs font-medium text-gray-700">{team.name}</p>
                        <div className="flex items-center justify-center mt-1">
                          {index === 0 && <span className="text-lg">🥇</span>}
                          {index === 1 && <span className="text-lg">🥈</span>}
                          {index === 2 && <span className="text-lg">🥉</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pie Chart Representation */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Points Distribution</h3>
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  {/* Pie chart using conic-gradient */}
                  <div 
                    className="w-full h-full rounded-full"
                    style={{
                      background: `conic-gradient(
                        #4b5563 0deg ${(245/715) * 360}deg,
                        #10b981 ${(245/715) * 360}deg ${((245+238)/715) * 360}deg,
                        #ef4444 ${((245+238)/715) * 360}deg 360deg
                      )`
                    }}
                  ></div>
                  <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">715</div>
                      <div className="text-sm text-gray-600">Total Points</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-600 rounded"></div>
                  <span className="text-sm text-gray-700">Team Aqsa (34.3%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-700">Team Sumud (33.3%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm text-gray-700">Team Inthifada (32.4%)</span>
                </div>
              </div>
            </div>
          </div>
        </ShowcaseSection>

        {/* Section-wise Rankings */}
        <ShowcaseSection title="Section-wise Rankings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderBarChart(sectionData.senior, "Senior Section Rankings")}
            {renderBarChart(sectionData.junior, "Junior Section Rankings")}
            {renderBarChart(sectionData.subJunior, "Sub Junior Section Rankings")}
            {renderBarChart(sectionData.general, "General Section Rankings")}
          </div>
        </ShowcaseSection>

        {/* Category-wise Rankings */}
        <ShowcaseSection title="Category-wise Performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderBarChart(categoryData.arts, "Arts Category Rankings")}
            {renderBarChart(categoryData.sports, "Sports Category Rankings")}
          </div>
        </ShowcaseSection>

        {/* Overall Rankings */}
        <ShowcaseSection title="Overall Team Rankings">
          <div className="space-y-4">
            {/* 1st Place */}
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl animate-bounce">🥇</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Team Aqsa</h3>
                    <p className="text-gray-700 font-medium">Creative & Athletic Champions</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-yellow-600">245</div>
                  <p className="text-yellow-700">Total Points</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-gray-900">8</div>
                  <p className="text-sm text-gray-600">Gold Medals</p>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">5</div>
                  <p className="text-sm text-gray-600">Silver Medals</p>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">3</div>
                  <p className="text-sm text-gray-600">Bronze Medals</p>
                </div>
              </div>
            </div>

            {/* 2nd Place */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">🥈</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Team Sumud</h3>
                    <p className="text-green-600 font-medium">Arts & Sports Excellence</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-600">238</div>
                  <p className="text-gray-700">Total Points</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-gray-900">7</div>
                  <p className="text-sm text-gray-600">Gold Medals</p>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">6</div>
                  <p className="text-sm text-gray-600">Silver Medals</p>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">4</div>
                  <p className="text-sm text-gray-600">Bronze Medals</p>
                </div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">🥉</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Team Inthifada</h3>
                    <p className="text-red-600 font-medium">Innovation & Competition</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-orange-600">232</div>
                  <p className="text-orange-700">Total Points</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-gray-900">6</div>
                  <p className="text-sm text-gray-600">Gold Medals</p>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">7</div>
                  <p className="text-sm text-gray-600">Silver Medals</p>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">5</div>
                  <p className="text-sm text-gray-600">Bronze Medals</p>
                </div>
              </div>
            </div>
          </div>
        </ShowcaseSection>

        {/* Top Performers */}
        <ShowcaseSection title="Top Individual Performers">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="font-semibold text-gray-900">Ahmed Ali</h3>
              <p className="text-sm text-gray-600 mb-2">Team Sumud • Chest No. 001</p>
              <p className="text-lg font-bold text-gray-900">45 Points</p>
              <p className="text-xs text-gray-500">Arts Champion</p>
            </div>

            <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="font-semibold text-gray-900">Fatima Hassan</h3>
              <p className="text-sm text-gray-600 mb-2">Team Aqsa • Chest No. 002</p>
              <p className="text-lg font-bold text-gray-900">42 Points</p>
              <p className="text-xs text-gray-500">Dance Star</p>
            </div>

            <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="w-16 h-16 bg-orange-300 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="font-semibold text-gray-900">Omar Khalil</h3>
              <p className="text-sm text-gray-600 mb-2">Team Inthifada • Chest No. 003</p>
              <p className="text-lg font-bold text-gray-900">40 Points</p>
              <p className="text-xs text-gray-500">Sports Hero</p>
            </div>
          </div>
        </ShowcaseSection>

        {/* Performance Trends */}
        <ShowcaseSection title="Performance Trends">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Daily Points Progress</h3>
            <div className="space-y-4">
              {/* Day 1 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Day 1 (March 10)</span>
                  <span className="text-sm text-gray-600">Total: 180 pts</span>
                </div>
                <div className="flex space-x-1 h-4">
                  <div className="bg-gray-600 rounded" style={{ width: '35%' }}></div>
                  <div className="bg-green-500 rounded" style={{ width: '33%' }}></div>
                  <div className="bg-red-500 rounded" style={{ width: '32%' }}></div>
                </div>
              </div>

              {/* Day 2 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Day 2 (March 11)</span>
                  <span className="text-sm text-gray-600">Total: 195 pts</span>
                </div>
                <div className="flex space-x-1 h-4">
                  <div className="bg-gray-600 rounded" style={{ width: '36%' }}></div>
                  <div className="bg-green-500 rounded" style={{ width: '34%' }}></div>
                  <div className="bg-red-500 rounded" style={{ width: '30%' }}></div>
                </div>
              </div>

              {/* Day 3 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Day 3 (March 12)</span>
                  <span className="text-sm text-gray-600">Total: 340 pts</span>
                </div>
                <div className="flex space-x-1 h-4">
                  <div className="bg-gray-600 rounded" style={{ width: '34%' }}></div>
                  <div className="bg-green-500 rounded" style={{ width: '33%' }}></div>
                  <div className="bg-red-500 rounded" style={{ width: '33%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-600 rounded"></div>
                <span className="text-sm text-gray-700">Team Aqsa</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-700">Team Sumud</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-700">Team Inthifada</span>
              </div>
            </div>
          </div>
        </ShowcaseSection>
      </div>
    </>
  );
}