import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

export default function RankingsPage() {
  return (
    <>
      <Breadcrumb pageName="Rank & Top" />

      <div className="space-y-6">
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

        {/* Category-wise Rankings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Arts Category */}
          <ShowcaseSection title="Arts Category Rankings">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🥇</span>
                  <span className="font-semibold text-gray-900">Team Aqsa</span>
                </div>
                <span className="font-bold text-gray-900">95 pts</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🥈</span>
                  <span className="font-semibold text-gray-900">Team Sumud</span>
                </div>
                <span className="font-bold text-gray-900">88 pts</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🥉</span>
                  <span className="font-semibold text-gray-900">Team Inthifada</span>
                </div>
                <span className="font-bold text-gray-900">82 pts</span>
              </div>
            </div>
          </ShowcaseSection>

          {/* Sports Category */}
          <ShowcaseSection title="Sports Category Rankings">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🥇</span>
                  <span className="font-semibold text-gray-900">Team Sumud</span>
                </div>
                <span className="font-bold text-gray-900">92 pts</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🥈</span>
                  <span className="font-semibold text-gray-900">Team Inthifada</span>
                </div>
                <span className="font-bold text-gray-900">89 pts</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🥉</span>
                  <span className="font-semibold text-gray-900">Team Aqsa</span>
                </div>
                <span className="font-bold text-gray-900">85 pts</span>
              </div>
            </div>
          </ShowcaseSection>
        </div>

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
      </div>
    </>
  );
}