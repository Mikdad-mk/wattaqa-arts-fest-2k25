import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

export default function BasicPage() {
  return (
    <>
      <Breadcrumb pageName="Basic" />

      <div className="space-y-6">
        {/* Festival Overview */}
        <ShowcaseSection title="Festival 2K25 Structure">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="text-lg mr-2">🎭</span>
                  Festival Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Festival Name:</span>
                    <span className="text-gray-900 font-medium">Wattaqa Arts Festival 2K25</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="text-gray-900 font-medium">7 Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="text-gray-900 font-medium">March 10, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Date:</span>
                    <span className="text-gray-900 font-medium">March 16, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Venue:</span>
                    <span className="text-gray-900 font-medium">Wattaqa School Campus</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="text-lg mr-2">📊</span>
                  Festival Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">135</div>
                    <p className="text-sm text-gray-600">Total Students</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">3</div>
                    <p className="text-sm text-gray-600">Teams</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">200+</div>
                    <p className="text-sm text-gray-600">Programs</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">15</div>
                    <p className="text-sm text-gray-600">Categories</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="text-lg mr-2">👥</span>
                  Team Structure
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-lg flex items-center justify-center">
                        <span className="text-gray-700 font-bold text-sm">S</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Team Sumud</p>
                        <p className="text-xs text-gray-600">Arts & Sports Excellence</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">45 members</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-lg flex items-center justify-center">
                        <span className="text-gray-700 font-bold text-sm">A</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Team Aqsa</p>
                        <p className="text-xs text-gray-600">Creative & Athletic</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">45 members</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-lg flex items-center justify-center">
                        <span className="text-gray-700 font-bold text-sm">I</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Team Inthifada</p>
                        <p className="text-xs text-gray-600">Innovation & Competition</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">45 members</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ShowcaseSection>

        {/* Program Categories */}
        <ShowcaseSection title="Program Categories">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">🎨</div>
                <h3 className="font-bold text-gray-900 text-lg">Arts & Crafts</h3>
              </div>
              <ul className="text-sm text-purple-700 space-y-2 font-medium">
                <li>• Painting Competition</li>
                <li>• Sculpture Making</li>
                <li>• Calligraphy</li>
                <li>• Digital Art</li>
                <li>• Handicrafts</li>
              </ul>
              <div className="mt-4 text-center">
                <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full font-medium shadow-lg">25 Programs</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">🎵</div>
                <h3 className="font-bold text-gray-900 text-lg">Music & Performance</h3>
              </div>
              <ul className="text-sm text-blue-700 space-y-2 font-medium">
                <li>• Singing Competition</li>
                <li>• Instrumental Music</li>
                <li>• Choir Performance</li>
                <li>• Beatboxing</li>
                <li>• Music Composition</li>
              </ul>
              <div className="mt-4 text-center">
                <span className="text-xs bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full font-medium shadow-lg">20 Programs</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300">
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">💃</div>
                <h3 className="font-bold text-gray-900 text-lg">Dance & Movement</h3>
              </div>
              <ul className="text-sm text-green-700 space-y-2 font-medium">
                <li>• Classical Dance</li>
                <li>• Modern Dance</li>
                <li>• Folk Dance</li>
                <li>• Hip Hop</li>
                <li>• Choreography</li>
              </ul>
              <div className="mt-4 text-center">
                <span className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full font-medium shadow-lg">18 Programs</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-6 hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300">
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">🎭</div>
                <h3 className="font-bold text-gray-900 text-lg">Drama & Theater</h3>
              </div>
              <ul className="text-sm text-red-700 space-y-2 font-medium">
                <li>• Stage Drama</li>
                <li>• Monologue</li>
                <li>• Comedy Acts</li>
                <li>• Mime Performance</li>
                <li>• Storytelling</li>
              </ul>
              <div className="mt-4 text-center">
                <span className="text-xs bg-gradient-to-r from-red-500 to-rose-500 text-white px-3 py-1 rounded-full font-medium shadow-lg">15 Programs</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-6 hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300">
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">⚽</div>
                <h3 className="font-bold text-gray-900 text-lg">Sports & Athletics</h3>
              </div>
              <ul className="text-sm text-orange-700 space-y-2 font-medium">
                <li>• Football Tournament</li>
                <li>• Basketball</li>
                <li>• Track & Field</li>
                <li>• Table Tennis</li>
                <li>• Badminton</li>
              </ul>
              <div className="mt-4 text-center">
                <span className="text-xs bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-3 py-1 rounded-full font-medium shadow-lg">22 Programs</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300">
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="font-bold text-gray-900 text-lg">Literature & Writing</h3>
              </div>
              <ul className="text-sm text-indigo-700 space-y-2 font-medium">
                <li>• Poetry Competition</li>
                <li>• Essay Writing</li>
                <li>• Short Story</li>
                <li>• Debate</li>
                <li>• Speech Contest</li>
              </ul>
              <div className="mt-4 text-center">
                <span className="text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full font-medium shadow-lg">12 Programs</span>
              </div>
            </div>
          </div>
        </ShowcaseSection>

        {/* Festival Schedule */}
        <ShowcaseSection title="Festival Schedule Overview">
          <div className="space-y-4">
            {[
              { day: "Day 1", date: "March 10", events: "Opening Ceremony, Arts Competitions", status: "Completed" },
              { day: "Day 2", date: "March 11", events: "Music & Dance Performances", status: "Completed" },
              { day: "Day 3", date: "March 12", events: "Sports Events, Drama Competitions", status: "Completed" },
              { day: "Day 4", date: "March 13", events: "Literature & Writing Contests", status: "In Progress" },
              { day: "Day 5", date: "March 14", events: "Team Challenges, Group Events", status: "Upcoming" },
              { day: "Day 6", date: "March 15", events: "Finals & Semi-Finals", status: "Upcoming" },
              { day: "Day 7", date: "March 16", events: "Closing Ceremony, Awards", status: "Upcoming" }
            ].map((schedule, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center">
                    <span className="font-bold text-gray-700">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{schedule.day} - {schedule.date}</h3>
                    <p className="text-sm text-gray-600">{schedule.events}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  schedule.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  schedule.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {schedule.status}
                </span>
              </div>
            ))}
          </div>
        </ShowcaseSection>
      </div>
    </>
  );
}